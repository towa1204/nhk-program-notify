# nhk-program-notify

## 機能概要

- 監視したい番組キーワードをWeb UIで設定できる
- NHK API（放送エリア・APIキー）を設定できる
- 通知先（LINEのユーザーID/アクセストークン）を設定できる
- NHK番組表から一致する番組を抽出し、LINEに通知する
- 日次・週次の定期通知（Deno cron）を実行できる

## システム構成

- フロントエンド: Fresh（設定ページ `\/program`, `\/nhkapi`, `\/notification`）
- バックエンド: Deno KV に設定保存、サービス層で番組取得と通知実行
- 外部API:
  - NHK Program API v3（`papiPgDateTv`）から番組取得
  - LINE Messaging Push API で通知送信
- 定期実行:
  - `CRON_ENABLED=true` で Deno cron が有効化される
  - 日次・週次で番組通知を実行（`cron.ts` のスケジュール）
- セキュリティ:
  - Basic認証でUIアクセス制御（`.env` の `BASIC_AUTH_*`）

## テスト方法

- pushするまえに`deno task check`を実行
- API関連処理に変更がある場合、APIリクエストを伴うテストも実施する
- デフォルトではignoreとなっているため、テスト一覧から見つけてignoreをtrueにする
