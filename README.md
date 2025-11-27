# toei Horizon theme

東映ビデオ向け Shopify テーマ（Horizon ベース）の開発リポジトリです。

## easyPoints 連携メモ

- 現状：
  - easyPoints のカスタムセットアップは未実施。
  - 以下3つのスニペットはダミー実装になっている。
    - `snippets/easypoints-customer-points.liquid`
    - `snippets/easypoints-customer-tier.liquid`
    - `snippets/easypoints-history.liquid`
- 使用箇所：
  - `easypoints-customer-points`：
    - `/pages/mypage` … `sections/mypage-dashboard.liquid` の「現在のポイント」表示
    - `/pages/points-history` … `sections/points-history.liquid` のヒーローエリア「現在のポイント」表示
  - `easypoints-customer-tier`：
    - `/pages/mypage` … 会員ランク表示
  - `easypoints-history`：
    - `/pages/points-history` … ポイント履歴テーブル `<tbody>` 内の行として `render` されている
- カスタムセットアップ完了後にやること：
  - easyPoints 側から提供されたコードで、上記3スニペットの中身を置き換える。
  - 特に `easypoints-history` は `<tr>...</tr>` を出力する実装である必要がある（周囲で `<table>` や `<tbody>` を持っているため）。
  - セクション側（`mypage-dashboard` / `points-history`）のHTML構造やクラスは基本的に触らず、スニペット内のロジックのみ差し替えること。
- 関連ページ：
  - `/pages/mypage` … `templates/page.mypage.json` + `sections/mypage-dashboard.liquid`
  - `/pages/points-history` … `templates/page.points-history.json` + `sections/points-history.liquid`
