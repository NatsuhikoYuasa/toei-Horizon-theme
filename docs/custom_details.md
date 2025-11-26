# Custom ファイルの詳細メモ

本テーマに含まれる Custom 系セクション／スニペット／JS／CSS の挙動と利用状況、留意点を整理します。

## Sections
- **sections/Custom-collection-shelf.liquid**
  - **概要**: コレクション商品をグリッドまたはSP横スクロールで表示し、公開期間やメタフィールドをもとにNEW・予約・初回特典残りわずか・早期予約特典・締切間近のバッジを付与する。価格表示や列数、余白、背景色をセクション設定で制御。【F:sections/Custom-collection-shelf.liquid†L1-L207】
  - **使用箇所**: `templates/index.json` で複数インスタンスが定義されている（例: `custom_collection_shelf_7nq6U6` など）。【F:templates/index.json†L1-L1】
  - **懸念/改善**: display_start/end 判定やバッジロジックが長文化しており、Featured Collection など他セクションと重複。スニペット化して共通化すると保守性向上。PC/SPのスタイルをインライン`<style>`に持つため、他ページで再利用しづらく CSS の肥大化につながる。
  - **今後の注意**: バッジ判定はメタフィールド依存のため、メタフィールド未設定環境で例外が出ないか確認しつつ改修する。日付比較はサーバ時刻依存なので、公開時刻設定の運用変更時は挙動確認をする。

- **sections/Custom-featured-blog-posts.liquid**
  - **概要**: 汎用コレクションと同じカードUIでブログ記事を最大12件表示。メタフィールド`custom.external_url`があれば外部リンクとして開く。抜粋表示はオプション。【F:sections/Custom-featured-blog-posts.liquid†L1-L114】【F:sections/Custom-featured-blog-posts.liquid†L115-L200】
  - **使用箇所**: `templates/index.json` で `custom_featured_blog_posts_mJKNnT` としてホーム構成に含まれる。【F:templates/index.json†L1-L1】
  - **懸念/改善**: 外部リンク判定が `-` や `#` など文字列に依存しており、意図しない入力でも外部遷移になり得る。入力バリデーションや UI 説明を追記するのが安全。
  - **今後の注意**: サムネイルがない記事で余白が生まれるため、プレースホルダや aspect-ratio 指定の検討。ブログタイトルを見出しに流用するため、ブログ名変更がページ文言に直結する点に留意。

- **sections/Custom-featured-collection.liquid**
  - **概要**: コレクションの代表画像と CTA を左に置き、右側で商品4件を表示。表示期間ロックやバッジ判定ロジックは汎用コレクションと同じ。【F:sections/Custom-featured-collection.liquid†L1-L110】
  - **使用箇所**: ホームの `templates/index.json` で複数配置（例: `custom_featured_collection_pPAFT8` など）。【F:templates/index.json†L1-L1】
  - **懸念/改善**: ロジック重複が多く、表示計算を分離できていない。左側のコレクション画像が未設定時プレースホルダーのみでレイアウトが崩れやすい。
  - **今後の注意**: スキーマ固定で商品表示数が4件にハードコードされているため、要件変更時は Liquid とスタイルの両方を調整する。

- **sections/Custom-pickup-collections.liquid**
  - **概要**: 複数ブロックでコレクションを選択し、各コレクションの画像・タイトルのみをグリッド／横スクロールで列挙する。価格やバッジは非表示。【F:sections/Custom-pickup-collections.liquid†L1-L72】
  - **使用箇所**: ホームテンプレート `templates/index.json` に `custom_pickup_collections_BaGwNK` が含まれる。【F:templates/index.json†L1-L1】
  - **懸念/改善**: ブロックごとに画像選択→コレクション画像→先頭商品の画像の優先順で求めており、画像未設定だと空枠になる。プレースホルダーやアスペクト比指定を入れたい。
  - **今後の注意**: 見出し・もっと見るの文言が設定依存なので、多言語対応時は翻訳データ連携を検討する。

- **sections/Custom-popular-tags-menu.liquid**
  - **概要**: ナビゲーションメニューを参照し、タグリンクをカード風リストで表示する簡易メニュー。汎用コレクションと同じ見出し装飾を持つ。【F:sections/Custom-popular-tags-menu.liquid†L1-L38】
  - **使用箇所**: ホームテンプレートで `custom_popular_tags_menu_86mcdY` として利用。【F:templates/index.json†L1-L1】
  - **懸念/改善**: リンクリスト未設定時は説明テキストのみのセクションとなる。メニュー件数上限や空状態のスタイルをガイド化すると運用が楽。
  - **今後の注意**: メニュー管理は Online Store 2.0 のナビに依存するため、ハンドル変更時にセクション設定がリセットされないか確認する。

- **sections/Custom-recently-viewed-products.liquid**
  - **概要**: localStorage に保存された `recentlyViewedEx` を読み込み、コレクション商品と同じ UI で最近見た商品を表示するセクション。保存データのバッジフラグをそのまま描画に使用。【F:sections/Custom-recently-viewed-products.liquid†L1-L70】
  - **使用箇所**: ホームテンプレートで `custom_recently_viewed_products_Rbnqwh` として定義。【F:templates/index.json†L1-L1】
  - **懸念/改善**: 保存形式に依存するため、レコーダー側のスキーマ変更時に表示が壊れやすい。データスキーマのバージョン管理やフォールバック処理を入れると安全。
  - **今後の注意**: localStorage への依存でサーバサイドレンダリングはできないため、SSR が必要な環境では別実装が必要。

- **sections/Custom-recommendations-collection.liquid**
  - **概要**: 推薦対象コレクションを指定し、商品グリッドを表示するセクション。価格表示や列数、余白などを設定可能。【F:sections/Custom-recommendations-collection.liquid†L1-L80】
  - **使用箇所**: ホームテンプレートに `custom_recommendations_collection_wtaThY` として含まれる。【F:templates/index.json†L1-L1】
  - **懸念/改善**: 商品取得は同期 Liquid で行うため、コレクション件数が多いとパフォーマンス影響がある。表示上限やキャッシュ戦略を検討。
  - **今後の注意**: 「おすすめ」用途のため、AI Recommendations など別ロジックを導入する際は type 名を変えずに差し替えるかどうかを事前決定しておく。

- **sections/Custom-slider.liquid**
  - **概要**: Swiper ベースのスライダー。PC/SPのピーク量や角丸、背景色、ボタン色を設定でき、各スライドに画像・タイトル・本文・CTA ボタンを持つ。【F:sections/Custom-slider.liquid†L1-L52】
  - **使用箇所**: ホームテンプレート `templates/index.json` に `custom_slider_XUAArH` として配置。【F:templates/index.json†L1-L1】
  - **懸念/改善**: ヘッダー内で `block.settings` を参照する誤記があり（`h2` 直下の不要行）、Liquid エラーのリスク。テーマ JS の Swiper 初期化依存があるため、削除すると表示が崩れる点に注意。
  - **今後の注意**: 画像が片方のみ設定された場合のフォールバックや、Autoplay/Dots の設定をテーマ全体のアクセシビリティポリシーに合わせる。

- **sections/custom-liquid.liquid**
  - **概要**: 自由入力用の汎用セクション。リッチテキストやカスタム Liquid を挿入できるシンプルなブロック構成。【F:sections/custom-liquid.liquid†L1-L60】
  - **使用箇所**: `templates/index.json` には現在含まれない（手動追加用）。
  - **懸念/改善**: 任意 Liquid を許容するため、移植時に外部スクリプトや未翻訳テキストが混入する恐れ。利用ルールをドキュメント化したい。
  - **今後の注意**: 権限のないスタッフが Liquid を編集できないよう、テーマエディタの利用権限と併せて運用する。

## Snippets
- **snippets/Custom-product-breadcrumbs.liquid**
  - **概要**: 商品メタオブジェクト（ジャンル・索引・作品・商品カテゴリー）を参照し、多階層のパンくずを生成する。未設定階層はスキップする。【F:snippets/Custom-product-breadcrumbs.liquid†L1-L55】
  - **使用箇所**: `sections/product-information.liquid` で商品ページ冒頭にレンダー。【F:sections/product-information.liquid†L50-L60】
  - **懸念/改善**: メタオブジェクトやコレクションが欠落しているとリンクが `#` になるため、存在チェックやデフォルト挙動の明示が必要。
  - **今後の注意**: メタフィールドスキーマ変更時はパンくず構造が変わるため、商品テンプレートの QA を必ず行う。

- **snippets/Custom-recently-viewed-recorder.liquid**
  - **概要**: 商品ページで表示期間ロックや特典フラグを Liquid で計算し、localStorage `recentlyViewedEx`/`recentlyViewed` に保存する JS を出力する。【F:snippets/Custom-recently-viewed-recorder.liquid†L1-L74】
  - **使用箇所**: `sections/product-information.liquid` 内で読み込まれ、最近見た商品セクションのデータソースとなる。【F:sections/product-information.liquid†L90-L110】
  - **懸念/改善**: localStorage 40件上限やメタフィールド計算の変更がセクション表示に直結する。データバージョンを付け、古い形式をクリーンアップする仕組みがあると安全。
  - **今後の注意**: `console.log` が残っており、本番で冗長ログになる可能性。必要に応じて削除またはデバッグフラグ化する。

## JavaScript Assets
- **assets/accordion-custom.js**
  - **概要**: `<accordion-custom>` Web Component で details/summary を拡張し、ブレークポイント毎の初期 open 状態や ESC でのクローズを制御する。【F:assets/accordion-custom.js†L1-L73】
  - **使用箇所**: フィルターやヘッダードロワーなど複数スニペットで `accordion-custom` タグが使われる（例: `snippets/price-filter.liquid`）。【F:snippets/price-filter.liquid†L1-L20】
  - **懸念/改善**: `dataset` 依存の布置で、属性漏れ時に Error を投げる実装。try/catch で握りつぶさない方針だが、テーマ拡張時はエラーハンドリング方針を決める。
  - **今後の注意**: `mediaQueryLarge`/`isMobileBreakpoint` のユーティリティに依存するため、ユーティリティ側の変更で挙動が変わる点を周知する。

- **assets/disclosure-custom.js**
  - **概要**: `disclosure-custom` Web Component で開閉状態に応じた `aria-expanded` と `inert` を管理し、CSS グリッドアニメーションを前提にしたアクセシブルなディスクロージャを提供する。【F:assets/disclosure-custom.js†L1-L43】
  - **使用箇所**: カート割引やスクリプト読込スニペットで利用。【F:snippets/cart-discount.liquid†L1-L10】
  - **懸念/改善**: 開閉アニメーションは CSS 側依存のため、JS 側では高さ調整をしていない。`data-disclosure-open/close` 属性がない場合の aria-label が空になるのでフォールバック検討。
  - **今後の注意**: Component 基底クラスの API 変更に備え、ref 名や requiredRefs がずれないように保守する。

- **assets/product-title-truncation.js**
  - **概要**: `<product-title>` カスタム要素で表示領域の高さから行数を計算し、`-webkit-line-clamp` を設定してタイトルを省略表示する。ResizeObserver を優先利用。【F:assets/product-title-truncation.js†L1-L63】
  - **使用箇所**: `snippets/scripts.liquid` から読み込まれ、商品カード等で利用可能。【F:snippets/scripts.liquid†L40-L60】
  - **懸念/改善**: line-height が `normal` の場合に計算が不安定。フォントサイズ変更時に clamp 値が想定外になるため、明示的な line-height を CSS 側で指定しておくと安全。
  - **今後の注意**: ResizeObserver 非対応ブラウザ向けのリサイズイベント監視は throttle されておらず、パフォーマンスに注意。

- **assets/recently-viewed-products.js**
  - **概要**: ローカルストレージに直近最大4件の productId を保存・取得するユーティリティクラス `RecentlyViewed`。【F:assets/recently-viewed-products.js†L1-L29】
  - **使用箇所**: 検索サジェストなどで読み込まれ、関連商品の保存に使用。【F:assets/predictive-search.js†L150-L175】
  - **懸念/改善**: `productId` 文字列以外の入力バリデーションなし。`localStorage` 例外（Safari シークレットモード等）に備えた try/catch がない。
  - **今後の注意**: セッション継続条件を変えたい場合は storage key や MAX_PRODUCTS を設定で受け取れるよう拡張すると運用が柔軟。

## CSS Assets
- **assets/overflow-list.css**
  - **概要**: `<overflow-list>` コンポーネント用スタイル。フレックスレイアウトでアイテムを詰め、`slot[name="more"]` の表示制御や `part` 属性での装飾を提供する。【F:assets/overflow-list.css†L1-L36】
  - **使用箇所**: バリエーションスウォッチやヘッダーメニューなど複数スニペットでインポートされ、リストの折りたたみ表示に使われる。【F:snippets/overflow-list.liquid†L1-L20】
  - **懸念/改善**: CSS カスタムプロパティ依存で初期値がテーマ CSS 側に散在しているため、コンポーネント単体での再利用性が低い。`display: none` になる overflow パートのアクセシビリティ（フォーカス可否）を確認する。
  - **今後の注意**: CSS Modules 化やスコープ付与を検討し、テーマ外部への移植性を確保する。

## Templates
- **templates/page.Custom-recommendations.liquid**
  - **概要**: クエリパラメータ `pid`/`fb` を使い、Product Recommendations API とコレクションAPIを組み合わせて36件まで商品カードを描画する静的ページ。localStorage の `wb_last_pid` をフォールバックに使う。【F:templates/page.Custom-recommendations.liquid†L1-L56】
  - **使用箇所**: ページテンプレート `page.Custom-recommendations` を選択した固定ページで利用。
  - **懸念/改善**: 直接 fetch を多重実行しており、エラーハンドリングが catch 無しの部分もある。取得数を増やしているため、ネットワーク遅延や API 制限に注意。
  - **今後の注意**: Shopify 推奨の Predictive Search/Recommendations API の仕様変更に追従するため、API レスポンス形式の差分に備えたガードを入れる。
