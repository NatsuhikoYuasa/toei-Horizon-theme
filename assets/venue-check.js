(function () {
  'use strict';

  // デバッグモード（本番では false に設定）
  const DEBUG = true;

  function log(...args) {
    if (DEBUG) {
      console.log('[VenueCheck]', ...args);
    }
  }

  function warn(...args) {
    if (DEBUG) {
      console.warn('[VenueCheck]', ...args);
    }
  }

  function error(...args) {
    console.error('[VenueCheck]', ...args);
  }

  const VenueCheck = {
    // 設定
    config: {
      apiEndpoint: '/api/venue-token', // トークン取得APIのエンドポイント
      cacheKey: 'venue_check_cache',
      cacheExpiry: 5 * 60 * 1000, // 5分
      gpsTimeout: 10000, // 10秒
      buttonSelector: '[data-add-to-cart]', // カートボタンのセレクター
      messageContainerSelector: '[data-venue-message]', // メッセージ表示エリア
    },

    /**
     * 初期化
     * @param {Object} options - オプション設定
     */
    init(options = {}) {
      log('init() called with options:', options);
      this.config = { ...this.config, ...options };
      log('config:', this.config);
      this.checkProduct();
    },

    /**
     * 商品が会場限定かチェック
     */
    checkProduct() {
      log('checkProduct() called');

      // バリアントのmetafieldsをチェック
      const productData = this.getProductData();
      if (!productData) {
        warn('Product data not found - [data-product-json] element or window.product is missing');
        return;
      }
      log('productData:', productData.title, '- variants:', productData.variants?.length);

      const currentVariantId = this.getCurrentVariantId();
      log('currentVariantId:', currentVariantId);

      const variant = productData.variants.find(v => v.id == currentVariantId);

      if (!variant) {
        warn('Current variant not found for id:', currentVariantId);
        return;
      }
      log('variant:', variant.title, '- metafields:', variant.metafields);

      const isVenueOnly = this.isVenueOnlyVariant(variant);
      log('isVenueOnly:', isVenueOnly);

      if (isVenueOnly) {
        log('This is a venue-only product, starting location check...');
        this.handleVenueOnlyProduct(variant);
      } else {
        log('This is NOT a venue-only product, enabling cart button');
        this.enableCartButton();
      }
    },

    /**
     * 商品データを取得
     */
    getProductData() {
      // product.liquid で {{ product | json }} を埋め込むことを想定
      const productJson = document.querySelector('[data-product-json]');
      if (productJson) {
        try {
          return JSON.parse(productJson.textContent);
        } catch (e) {
          console.error('Failed to parse product JSON:', e);
        }
      }

      // グローバル変数から取得（テーマによって異なる）
      if (window.product) {
        return window.product;
      }

      return null;
    },

    /**
     * 現在選択中のバリアントIDを取得
     */
    getCurrentVariantId() {
      const select = document.querySelector('select[name="id"]');
      if (select) {
        return select.value;
      }

      const input = document.querySelector('input[name="id"]');
      if (input) {
        return input.value;
      }

      return null;
    },

    /**
     * バリアントが会場限定かチェック
     * venue_configメタフィールドが存在する場合のみ会場限定として扱う
     */
    isVenueOnlyVariant(variant) {
      log('isVenueOnlyVariant() - checking variant.metafields:', variant.metafields);

      // metafieldsが存在するか確認
      if (!variant.metafields) {
        log('isVenueOnlyVariant() - no metafields on variant');
        return false;
      }

      if (!variant.metafields.variant) {
        log('isVenueOnlyVariant() - no "variant" namespace in metafields. Available namespaces:', Object.keys(variant.metafields));
        return false;
      }

      const hasVenueConfig = !!variant.metafields.variant.venue_config;
      log('isVenueOnlyVariant() - venue_config:', variant.metafields.variant.venue_config, '- hasVenueConfig:', hasVenueConfig);

      // venue_configメタフィールドが設定されている場合のみ会場限定
      return hasVenueConfig;
    },

    /**
     * 会場限定商品の処理
     */
    async handleVenueOnlyProduct(variant) {
      log('handleVenueOnlyProduct() - variant:', variant.id);
      this.disableCartButton('位置情報を確認中...');

      // キャッシュをチェック
      const cached = this.getCache();
      log('handleVenueOnlyProduct() - cached:', cached);
      if (cached && cached.token) {
        log('handleVenueOnlyProduct() - using cached token');
        await this.saveTokenToCart(cached.token);
        this.enableCartButton();
        return;
      }

      log('handleVenueOnlyProduct() - requesting GPS location...');
      // GPS位置情報を取得
      this.getLocation()
        .then(async (position) => {
          const { latitude, longitude } = position.coords;
          log('handleVenueOnlyProduct() - GPS position:', { latitude, longitude });

          // サーバーにトークンをリクエスト
          // variant.id を Shopify グローバルID形式に変換
          const variantGid = `gid://shopify/ProductVariant/${variant.id}`;
          log('handleVenueOnlyProduct() - requesting token from API...', { variantGid });
          const tokenData = await this.requestVenueToken(latitude, longitude, variantGid);
          log('handleVenueOnlyProduct() - API response:', tokenData);

          if (tokenData && tokenData.token) {
            log('handleVenueOnlyProduct() - token received, saving to cache and cart');
            // トークンをキャッシュ
            this.setCache({ token: tokenData.token, expiresAt: tokenData.expiresAt });

            // トークンをカートに保存
            await this.saveTokenToCart(tokenData.token);

            this.enableCartButton();
            // 成功メッセージは表示しない（UXをシンプルに）
          } else {
            log('handleVenueOnlyProduct() - token request failed');
            this.handleLocationCheckFailed(tokenData);
          }
        })
        .catch((err) => {
          error('GPS error:', err);
          this.handleGPSError(err);
        });
    },

    /**
     * GPS位置情報を取得
     */
    getLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: this.config.gpsTimeout,
            maximumAge: 0,
          }
        );
      });
    },

    /**
     * サーバーにトークンをリクエスト
     */
    async requestVenueToken(lat, lng, variantId) {
      try {
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lat, lng, variantId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Token request failed:', errorData);
          return errorData;
        }

        return await response.json();
      } catch (error) {
        console.error('Network error:', error);
        return null;
      }
    },

    /**
     * トークンをカートに保存
     */
    async saveTokenToCart(token) {
      try {
        await fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attributes: {
              _venue_token: token,
            },
          }),
        });
      } catch (error) {
        console.error('Failed to save token to cart:', error);
      }
    },

    /**
     * 位置チェック失敗時の処理
     */
    handleLocationCheckFailed(errorData) {
      const distance = errorData?.distance || 0;
      const message = errorData?.message || '会場外からのアクセスです';

      this.disableCartButton(message);
      this.showMessage(`${message} (距離: ${Math.round(distance)}m)`, 'error');
      this.showPassphraseInput();
    },

    /**
     * GPSエラー時の処理
     */
    handleGPSError(error) {
      let message = '位置情報の取得に失敗しました';

      if (error.code === 1) {
        message = '位置情報の使用が許可されていません';
      } else if (error.code === 2) {
        message = '位置情報を取得できませんでした';
      } else if (error.code === 3) {
        message = '位置情報の取得がタイムアウトしました';
      }

      this.disableCartButton(message);
      this.showMessage(message, 'error');
      this.showPassphraseInput();
    },

    /**
     * 合言葉入力フォームを表示
     */
    showPassphraseInput() {
      const container = document.querySelector(this.config.messageContainerSelector);
      if (!container) return;

      const formHTML = `
        <div class="venue-passphrase-form">
          <p>スタッフから受け取った合言葉を入力してください:</p>
          <input type="text" id="venue-passphrase" placeholder="合言葉を入力" />
          <button type="button" id="venue-passphrase-submit">確認</button>
        </div>
      `;

      container.innerHTML += formHTML;

      document.getElementById('venue-passphrase-submit')?.addEventListener('click', () => {
        this.submitPassphrase();
      });
    },

    /**
     * 合言葉を送信
     */
    async submitPassphrase() {
      const input = document.getElementById('venue-passphrase');
      if (!input) return;

      const passphrase = input.value.trim();
      if (!passphrase) {
        alert('合言葉を入力してください');
        return;
      }

      try {
        await fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attributes: {
              _venue_passphrase: passphrase,
            },
          }),
        });

        this.enableCartButton();
        this.showMessage('合言葉を確認しました', 'success');
      } catch (error) {
        console.error('Failed to save passphrase:', error);
        alert('エラーが発生しました。もう一度お試しください。');
      }
    },

    /**
     * カートボタンを有効化
     */
    enableCartButton() {
      const button = document.querySelector(this.config.buttonSelector);
      if (button) {
        button.disabled = false;
        // 元のHTMLを復元
        if (button.dataset.originalHtml) {
          button.innerHTML = button.dataset.originalHtml;
        }
      }
    },

    /**
     * カートボタンを無効化
     */
    disableCartButton(message) {
      const button = document.querySelector(this.config.buttonSelector);
      if (button) {
        // 元のHTMLを保存（初回のみ）
        if (!button.dataset.originalHtml) {
          button.dataset.originalHtml = button.innerHTML;
        }
        button.disabled = true;
        button.textContent = message;
      }
    },

    /**
     * メッセージを表示
     */
    showMessage(message, type = 'info') {
      const container = document.querySelector(this.config.messageContainerSelector);
      if (!container) return;

      const messageHTML = `
        <div class="venue-message venue-message--${type}">
          ${message}
        </div>
      `;

      container.innerHTML = messageHTML;
    },

    /**
     * キャッシュを取得
     */
    getCache() {
      try {
        const cached = sessionStorage.getItem(this.config.cacheKey);
        if (!cached) return null;

        const data = JSON.parse(cached);
        if (new Date(data.expiresAt) < new Date()) {
          sessionStorage.removeItem(this.config.cacheKey);
          return null;
        }

        return data;
      } catch (e) {
        return null;
      }
    },

    /**
     * キャッシュを設定
     */
    setCache(data) {
      try {
        sessionStorage.setItem(this.config.cacheKey, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to cache data:', e);
      }
    },
  };

  // グローバルに公開
  window.VenueCheck = VenueCheck;

  // スクリプト読み込み確認ログ
  log('venue-check.js loaded successfully');
  log('VenueCheck is now available at window.VenueCheck');
  log('Call VenueCheck.init() to start venue checking');
})();
