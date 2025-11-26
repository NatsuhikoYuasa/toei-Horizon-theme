# テーマ概要（日本語補足）

このドキュメントは、Horizon ベースのテーマ構造を  
**開発チームで共有しやすい形でまとめた技術メモ**です。

目的：
- どのディレクトリにどんな役割のファイルがあるか、全員で共通認識を持つ  
- 新規開発時に「触るべき場所」を素早く判断できる  
- カスタム箇所の切り分け（Horizon 標準との違い）  

補足：
- Horizon は構造が大きく、似た役割のセクション/スニペットが多いため、  
  Figma の仕様や実装対象ページと照らし合わせて使うことを推奨します。

## Theme Overview

This document summarizes the current Horizon-based theme structure and enumerates key files in the primary Shopify theme directories.

## Directory layout (Horizon standard)
- `assets/` – Theme JavaScript, CSS, SVG assets, and supporting config files.
- `config/` – Theme settings schema (`settings_schema.json`) and merchant data (`settings_data.json`).
- `layout/` – Liquid layout wrappers (not enumerated here, Horizon defaults).
- `sections/` – Page-level sections and supporting groups used across templates.
- `snippets/` – Reusable Liquid snippets for UI components and utilities.
- `templates/` – JSON and Liquid templates used for Shopify resources (pages, products, collections, etc.).

## sections/
- Announcement & header: `header-announcements.liquid`, `header.liquid`, `header-group.json`, `logo.liquid`
- Footer: `footer.liquid`, `footer-utilities.liquid`, `footer-group.json`, `password-footer.liquid`
- Content/hero: `hero.liquid`, `marquee.liquid`, `media-with-content.liquid`, `slideshow.liquid`, `divider.liquid`, `_blocks.liquid`, `section.liquid`
- Commerce: `product-information.liquid`, `product-list.liquid`, `product-recommendations.liquid`, `section-rendering-product-card.liquid`, `predictive-search.liquid`, `predictive-search-empty.liquid`, `search-results.liquid`, `search-header.liquid`
- Templates: `main-404.liquid`, `main-blog.liquid`, `main-blog-post.liquid`, `main-cart.liquid`, `main-collection.liquid`, `main-collection-list.liquid`, `main-page.liquid`, `password.liquid`
- Collections/blog features: `collection-links.liquid`, `collection-list.liquid`, `featured-blog-posts.liquid`, `featured-product.liquid`
- Custom-prefixed sections: `Custom-collection-shelf.liquid`, `Custom-featured-blog-posts.liquid`, `Custom-featured-collection.liquid`, `Custom-pickup-collections.liquid`, `Custom-popular-tags-menu.liquid`, `Custom-recently-viewed-products.liquid`, `Custom-recommendations-collection.liquid`, `Custom-slider.liquid`, `custom-liquid.liquid`

## snippets/
- Header, navigation, and menus: `header-actions.liquid`, `header-drawer.liquid`, `header-menu.liquid`, `header-row.liquid`, `mega-menu.liquid`, `mega-menu-list.liquid`, `overflow-list.liquid`
- Product and cart: `product-card.liquid`, `product-grid.liquid`, `add-to-cart-button.liquid`, `variant-picker.liquid`, `quick-add.liquid`, `cart-drawer.liquid`, `cart-products.liquid`, `cart-summary.liquid`, `tax-info.liquid`
- Visual components: `background-image.liquid`, `background-video.liquid`, `bento-grid.liquid`, `button.liquid`, `image.liquid`, `slideshow.liquid`, `video.liquid`, `icon.liquid`, `icon-or-image.liquid`
- Utilities and styles: `color-schemes.liquid`, `gap-style.liquid`, `spacing-style.liquid`, `typography-style.liquid`, `theme-editor.liquid`, `stylesheets.liquid`, `scripts.liquid`, `meta-tags.liquid`
- Commerce helpers: `facets-actions.liquid`, `price-filter.liquid`, `list-filter.liquid`, `sorting.liquid`, `predictive-search.liquid`, `search-modal.liquid`, `filters-toggle.liquid`
- Custom-prefixed snippets and app integrations: `Custom-product-breadcrumbs.liquid`, `Custom-recently-viewed-recorder.liquid`, `hulkapps-wishlist-*.liquid`

## templates/
- Core JSON templates: `index.json`, `product.json`, `product.preorder.json`, `product.comingsoon.json`, `collection.json`, `list-collections.json`, `blog.json`, `article.json`, `cart.json`, `search.json`, `404.json`, `password.json`, `page.json`, `page.contact.json`
- Specialized Liquid templates: `gift_card.liquid`, `page.Custom-recommendations.liquid`

## assets/
- JavaScript entry points: `critical.js`, `section-hydration.js`, `section-renderer.js`, `theme-editor.js`
- UI behavior scripts: `announcement-bar.js`, `header.js`, `header-drawer.js`, `header-menu.js`, `marquee.js`, `slideshow.js`, `media-gallery.js`, `predictive-search.js`, `quick-add.js`
- Product/cart utilities: `product-form.js`, `product-card.js`, `product-recommendations.js`, `cart-drawer.js`, `component-cart-items.js`, `variant-picker.js`, `local-pickup.js`, `product-price.js`
- Custom or auxiliary scripts: `accordion-custom.js`, `disclosure-custom.js`, `anchored-popover.js`, `jumbo-text.js`, `product-title-truncation.js`, `view-transitions.js`, `qr-code-generator.js`, `qr-code-image.js`, `recently-viewed-products.js`
- Styles and other assets: `base.css`, `overflow-list.css`, `template-giftcard.css`, SVG icons (e.g., `icon-cart.svg`, `icon-add-to-cart.svg`), TypeScript definitions (`global.d.ts`), and configuration (`jsconfig.json`)

## config/
- `settings_schema.json` – Defines theme settings available in the customizer.
- `settings_data.json` – Stores merchant-selected settings and presets.

---

## 🗂️ Template Usage Mapping（今後追記していく項目）
※まだ空ですが、ページごとにどのテンプレートが参照されているか追記する想定です。

- `templates/index.json` → トップページ
- `templates/collection.json` → コレクション一覧
- `templates/product.json` → 商品詳細ページ（通常）
- `templates/product.preorder.json` → 予約販売用 PDP
- `templates/page.json` → 固定ページ

開発が進むにつれて、ここに “どのページがどのテンプレートを使っているか” を追記していきます。
