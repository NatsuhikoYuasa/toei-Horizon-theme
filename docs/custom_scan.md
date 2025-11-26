# カスタムファイル スキャン結果（日本語補足）

このドキュメントは、本テーマ（Horizon ベース）において  
**標準テーマに含まれない可能性が高いファイル**を一覧化した社内向けメモです。

目的：
- Horizon 標準との差分を把握する
- 納品時に「どこが独自カスタムなのか」を明確にする
- コードレビュー時に「触るべきポイント、触らないほうがよいポイント」を判断しやすくする

※ここに載っているファイルが「問題」という意味ではなく、  
  あくまで **“要確認 & 要理解” の候補**という扱いです。

## Customization Scan

The following files stand out as potentially customized additions or overrides compared to the Horizon base theme, based on naming patterns (e.g., `Custom-` prefix) and app-specific references.

## Sections (custom-prefixed)
- `sections/Custom-collection-shelf.liquid`
- `sections/Custom-featured-blog-posts.liquid`
- `sections/Custom-featured-collection.liquid`
- `sections/Custom-pickup-collections.liquid`
- `sections/Custom-popular-tags-menu.liquid`
- `sections/Custom-recently-viewed-products.liquid`
- `sections/Custom-recommendations-collection.liquid`
- `sections/Custom-slider.liquid`
- `sections/custom-liquid.liquid` (customizable Liquid block)

## Snippets
- `snippets/Custom-product-breadcrumbs.liquid`
- `snippets/Custom-recently-viewed-recorder.liquid`
- `snippets/hulkapps-wishlist-account-btn.liquid`
- `snippets/hulkapps-wishlist-cart-btn.liquid`
- `snippets/hulkapps-wishlist-collection-btn.liquid`
- `snippets/hulkapps-wishlist-header-icon.liquid`
- `snippets/hulkapps-wishlist-saveforlater-allitems.liquid`

## Templates
- `templates/page.Custom-recommendations.liquid` (non-standard page template)

## Assets (scripts/styles with custom naming)
- `assets/accordion-custom.js`
- `assets/disclosure-custom.js`
- `assets/overflow-list.css`
- `assets/product-title-truncation.js`
- `assets/recently-viewed-products.js`

---

## 💡 Notes（補足）
- `custom-liquid.liquid` は OS2.0 標準の「自由入力」セクションとして存在する場合があります。
  → 完全なカスタムとは限らないため、**変更点があるかどうか要チェック**。
- hulkapps 系ファイルはアプリ連携部分。削除・編集には注意。
- These items merit review to confirm whether they are intentional customizations, app integrations, or overrides of default Horizon behavior.
