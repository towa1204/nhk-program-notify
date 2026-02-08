# nhk-program-notify 作業ガイド

## プロジェクト概要

- NHK 番組表からキーワード一致の番組を抽出し、LINE に通知する

## システム構成

- フロントエンド: Deno Fresh
- バックエンド: Deno KV + サービス層
- 外部 API: NHK Program API v3 / LINE Messaging Push API
- 定期実行: Deno cron（`CRON_ENABLED=true` / `cron.ts`）
- セキュリティ: Basic 認証（`.env` の `BASIC_AUTH_*`）

## テスト運用ルール

- 作業終了時に `deno task check` を実行。失敗した場合、見直したうえで修正する。
  - フォーマット関連のエラーの場合、`deno fmt`を実行する。
