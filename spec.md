# Webアプリケーション開発 仕様書

- **ソースコードリポジトリ**: https://github.com/iotaish/webpro
- **対象サーバファイル**: `app5.js`
- **技術スタック**: Node.js（Deno 互換） / Express / EJS / Vanilla JavaScript (`fetch`)

---

## 0. 概要と授業要件

### 0.1. システム概要
本システムは、京葉線駅一覧システム（`/keiyo2`）の一覧表示・詳細表示をベースとして発展させ、**REST API による一覧表示・詳細表示・追加・変更・削除（CRUD）** を備えた 3 つの Web アプリケーションを提供する。

### 0.2. 課題要件
- `keiyo2` のように一覧表示をベースとした Web アプリケーションを京葉線システム以外に 3 つ開発する
- REST API による、データの一覧・詳細表示、追加、削除、変更を実装する（基本は変数内にデータを記録する）
- JS ファイルの先頭に `"use strict";` を付ける
- 仕様書は Markdown で作成し、利用者向け・管理者向け・開発者向けの 3 部構成とする
- ソースコードは GitHub に置き、ドキュメント内に URL を示す
- 授業で説明していない技術については、その概要と採用理由を記載する

### 0.3. 開発対象アプリケーション一覧

| No. | アプリケーション名 | 画面URL | REST API ベースURL | 概要 |
| --- | --- | --- | --- | --- |
| 1 | 授業・時間割管理 | `/classes` | `/api/classes` | 履修授業（科目名・曜日・時限・教室・担当教員・単位数・メモ）の一覧・検索・CRUD 管理 |
| 2 | <!-- TODO: 第2アプリ名 --> | `<!-- TODO -->` | `<!-- TODO -->` | <!-- TODO: 概要を記述 --> |
| 3 | <!-- TODO: 第3アプリ名 --> | `<!-- TODO -->` | `<!-- TODO -->` | <!-- TODO: 概要を記述 --> |

---

# 第1部 利用者向け仕様

## 1.1. 利用前の準備

ブラウザ（Chrome / Safari / Edge / Firefox 等のモダンブラウザ、JavaScript 有効）からサーバの URL（ローカル環境では `http://localhost:8080`）へアクセスする。

## 1.2. 画面URL一覧

各アプリケーション共通で、以下の URL 設計パターンで操作できる。

| 種別 | URL パターン | 備考 |
| --- | --- | --- |
| 一覧画面 | `GET /:resource` | 初期表示は EJS による一覧描画 |
| 新規追加画面 | `/public/:resource_add.html` | 登録成功後、一覧画面へ遷移 |
| 詳細・直接編集・削除画面 | `GET /:resource/:id` | 存在しない ID 指定時は HTTP `404` 表示 |

- 各アプリの実ルート例:
  - アプリ1（授業・時間割管理）: `/classes`, `/public/classes_add.html`, `/classes/:id`
  - アプリ2: `<!-- TODO -->`
  - アプリ3: `<!-- TODO -->`

## 1.3. 基本操作手順（全アプリ共通）

### 1.3.1. 一覧表示・サマリ確認・絞り込み
1. 各アプリの一覧画面 URL（`/:resource`）を開く。
2. 画面上部のサマリバーに表示件数や集計値が表示され、その下に登録データが表形式で一覧表示される。
3. 絞り込みバーの条件選択やキーワード検索欄に入力すると、条件に一致するデータのみが即座に再取得されて表とサマリが更新される。「条件クリア」ボタンで絞り込みを解除できる。
4. 「一覧を再取得」ボタンを押すと、サーバから最新データを再取得して表を更新し、画面上部中央に緑色の完了通知（トースト）がポップ表示され、約1.8秒後に自動で消える。

### 1.3.2. 詳細表示
1. 一覧画面のテーブルにある項目名リンク、または「詳細・編集」ボタンをクリックする。
2. 選択したデータの全項目が詳細画面のテーブルに表示される。
3. 一覧へ戻りたい場合は「一覧に戻る」リンクをクリックする。

### 1.3.3. 新規追加
1. 一覧画面上部の「＋ 新しい〇〇を追加する」ボタンをクリックして登録画面へ移動する。
2. フォームに各項目を入力・選択し、「登録」ボタンをクリックする。
3. 入力内容が正しい場合はデータが追加され、一覧画面へ自動的に戻る。
4. 必須項目が未入力、選択肢以外、または数値範囲外の場合は、画面上部に赤色のエラーメッセージが表示される。

### 1.3.4. データの変更（更新）
1. 一覧画面から対象アイテムの「詳細・編集」をクリックし、詳細画面を開く。
2. 詳細テーブルの各項目欄（ID を除く）がそのまま入力・選択欄になっているため、変更したい値を直接書き換える。
3. 「変更を保存」ボタンをクリックすると内容が保存され、ページタイトル・見出し・表示値が同期するとともに、画面上部中央に緑色の完了通知（トースト）がポップ表示され、約1.8秒後に自動で消える。
4. 入力内容が不正な場合は赤色のエラーメッセージが画面上に残る。

### 1.3.5. データの削除
- **一覧画面から削除する場合**: 対象行の「削除」ボタンをクリックし、確認ダイアログで「OK」を選択する。削除後は表・サマリが更新され、画面上部中央に緑色の完了通知（トースト）がポップ表示され約1.8秒後に自動で消える。
- **詳細画面から削除する場合**: 画面下部の「削除」ボタンをクリックし、確認ダイアログで「OK」を選択すると削除され、一覧画面へ戻る。

## 1.4. 各アプリの入力項目と制限

### 1.4.1. 授業・時間割管理（`/classes`）

- **サマリ表示**: 表示中の件数および合計単位数を算出して表示する。
- **絞り込み条件**: 曜日セレクト（`すべて` / `月`〜`土`）およびキーワード検索（科目名・教室・担当教員・メモの部分一致）。

| 項目名 | フィールド名 | 必須 | 型 / 入力形式 | 制限・初期値 |
| --- | --- | --- | --- | --- |
| 科目名 | `course` | 必須 | テキスト | 前後空白除去後に空文字不可 |
| 曜日 | `day` | 必須 | セレクト | `月` / `火` / `水` / `木` / `金` / `土` のみ許可（新規フォーム初期値: `金`） |
| 時限 | `period` | 必須 | テキスト | 前後空白除去後に空文字不可（例: `2-3限`） |
| 教室 | `room` | 必須 | テキスト | 前後空白除去後に空文字不可（例: `1102`） |
| 担当教員 | `teacher` | 任意 | テキスト | 未入力時は空文字 |
| 単位数 | `credits` | 任意（実質整数） | 数値 | `1`〜`10` の整数（未指定・空文字時は初期値 `2`） |
| メモ | `memo` | 任意 | テキストエリア | 講義概要・自由記述 |

### 1.4.2. 第2アプリケーション（未定）

<!-- TODO: 入力項目と制限を記述 -->

### 1.4.3. 第3アプリケーション（未定）

<!-- TODO: 入力項目と制限を記述 -->

---

# 第2部 管理者向け仕様

## 2.1. 動作環境と依存関係

| 項目 | 仕様 |
| --- | --- |
| 実行ランタイム | Node.js または Deno（`package.json` の `dr` スクリプトによる Node 互換実行） |
| モジュール方式 | CommonJS（`package.json` の `"type": "commonjs"`） |
| 依存パッケージ | `express` (`^4.21.2`), `ejs` (`^3.1.10`) |
| 待ち受けポート | `8080`（`http://localhost:8080`、環境変数 `PORT` で上書き可） |

## 2.2. 起動・停止手順

1. 初回または依存更新時はリポジトリルートで依存パッケージをインストールする。
   ```sh
   npm install
   ```
2. 以下のいずれかのコマンドでサーバを起動する。
   - **Node.js で起動する場合**:
     ```sh
     npm start
     ```
     （内部で `node app5.js` を実行）
   - **Deno で起動する場合**:
     ```sh
     npm run dr
     ```
     （内部で `deno run --allow-net --allow-read --allow-write --allow-env app5.js` を実行）
3. コンソールに待ち受け開始メッセージが表示されたら起動完了となる。
4. 停止する場合は起動中のターミナルで `Ctrl + C` を押下する。

## 2.3. データ管理と永続化に関する仕様

- **変更の経緯**: 初期実装ではメモリ内配列で管理していたが、サーバ再起動時に登録・編集・削除内容が失われるため、ファイルベースの永続化（SQLite）へ仕様変更した。
- **授業・時間割管理（`/classes`）**:
  - `node:sqlite`（`DatabaseSync`）を用いて `timetable.db`（環境変数 `TIMETABLE_DB_PATH` でパス変更可）の `classes` テーブルに永続化する。
  - **既存 DB 非初期化ルール**:
    - 起動時に `.db` ファイルが**存在しない場合のみ**、`classes` テーブルの作成と初期 5 件の投入を行う。
    - すでに `.db` ファイルが存在する場合は、レコード件数が 0 件（全件削除済み）であっても再初期化や初期データの再投入を行わず、既存データをそのまま読み込む。
    - 旧スキーマ（`teacher` / `credits` / `memo` 列なし）の既存 DB を読み込んだ場合は、`ALTER TABLE ... ADD COLUMN` により安全に列を拡張する。

<!-- TODO: 第2・第3アプリケーションのデータ管理方式を追記 -->

## 2.4. 運用監視とトラブルシューティング

- **ポート競合エラー（`EADDRINUSE`）**:
  - すでに別のプロセスがポート `8080` を使用している場合、起動に失敗する。
  - `lsof -i :8080` で占有プロセスを確認して停止するか、環境変数 `PORT` で別ポートを指定する。
- **不正な入力による `400 Bad Request`**:
  - 必須項目の欠落や許容範囲外の値が送信された場合、API は HTTP ステータス `400` と JSON 形式のエラーメッセージ `{ "error": "..." }` を返す。
- **存在しない ID へのアクセス（`404 Not Found`）**:
  - 削除済みまたは未登録の ID、あるいは正の整数でない ID が指定された場合、HTML 画面ルートではステータス `404` のテンプレートを返し、REST API ではステータス `404` と `{ "error": "..." }` を返す。

---

# 第3部 開発者向け仕様

## 3.1. リポジトリおよびファイル構成

- **リポジトリ URL**: https://github.com/iotaish/webpro

```text
.
├── app5.js                         # メインサーバ（HTML ルーティング・REST API）
├── package.json                    # 依存パッケージおよび起動スクリプト（npm start / npm run dr）
├── spec.md                         # 本仕様書
├── public/                         # 静的ファイル（新規追加フォーム HTML・クライアント JS）
│   ├── <resource>_add.html         # 各アプリの新規追加フォーム
│   ├── <resource>_add.js           # 新規追加フォーム送信スクリプト（POST /api/<resource>）
│   ├── <resource>.js               # 一覧画面制御スクリプト（絞り込み・再取得・削除）
│   └── <resource>_detail.js        # 詳細・直接編集スクリプト（PUT / DELETE）
└── views/                          # EJS テンプレート（SSR 初期表示・404 応答）
    ├── <resource>.ejs              # 一覧画面テンプレート
    └── <resource>_detail.ejs       # 詳細・直接編集画面テンプレート
```

- **授業・時間割管理（`/classes`）関連ファイル**:
  - `public/app.css`: 全アプリ共通スタイルシート（テーブル・サマリバー・絞り込みバー・トースト通知）
  - `public/classes.js`: 一覧画面（絞り込み・再取得・削除・サマリ集計）
  - `public/classes_add.html` / `public/classes_add.js`: 新規登録フォームおよび `POST /api/classes` 連携
  - `public/classes_detail.js`: 詳細直接編集（`PUT`）および削除（`DELETE`）連携
  - `views/classes.ejs` / `views/classes_detail.ejs`: 一覧・詳細（`404` 表示含む）テンプレート

<!-- TODO: 第2・第3アプリで追加したファイル一覧を追記 -->

## 3.2. コーディング規約・設計方針

1. **`"use strict";` の徹底**:
   - 課題要件に基づき、今回作成・更新するすべてのサーバ側・クライアント側 JS ファイルの先頭に `"use strict";` を記述する。
2. **HTML ルートと REST API ルートの責務分離**:
   - 初期画面描画（`GET /:resource`, `GET /:resource/:id`）は EJS による SSR とし、検索・追加・更新・削除の各操作は `/api/:resource` 配下の JSON REST API とクライアント側 `fetch` で処理する。
3. **サーバ側バリデーションと統一 HTTP ステータス**:
   - 入力値の検証をサーバ側で一元化し、必須項目欠落・型不正・範囲外は `400 Bad Request`（`{ "error": "..." }`）、対象 ID 不在は HTML/API ともに `404 Not Found` を返す。
4. **XSS（クロスサイトスクリプティング）対策**:
   - クライアント JS で API レスポンスを描画する際は `innerHTML` への文字列連結を行わず、`document.createElement` と `textContent` を組み合わせて安全に DOM を構築する。
5. **ランタイム互換性の維持**:
   - Node.js（`npm start`）および Deno（`npm run dr`）の双方でそのまま起動できるよう、CommonJS および標準互換 API で構成する。

## 3.3. 画面遷移図と通信シーケンス

### 3.3.1. 共通画面遷移図

```mermaid
stateDiagram-v2
  [*] --> List: GET /:resource
  List --> List: 絞り込み・再取得・削除 (fetch API)
  List --> AddForm: 「＋ 新しく追加」クリック
  AddForm --> AddForm: 入力不正 (400 エラー表示)
  AddForm --> List: 登録成功 (POST 201)
  List --> Detail: 項目名 / 「詳細・編集」クリック
  Detail --> Detail: 変更を保存 (PUT 200) / 入力不正 (400)
  Detail --> List: 「一覧に戻る」 / 削除完了 (DELETE 200)
  List --> NotFound: 不正 ID アクセス
  NotFound --> List: 「一覧に戻る」クリック
```

### 3.3.2. 共通通信シーケンス（一覧・詳細・CRUD）

```mermaid
sequenceDiagram
  autonumber
  actor User as 利用者ブラウザ
  participant Client as クライアントJS (fetch)
  participant Server as app5.js (Express / データ管理層)

  User->>Server: GET /:resource
  Server-->>User: 一覧HTML (EJS SSR)

  User->>Client: 条件入力 / 「一覧を再取得」
  Client->>Server: GET /api/:resource?条件
  Server-->>Client: 200 OK (JSON配列)
  Client-->>User: テーブル・サマリ動的更新

  User->>Client: 新規追加フォーム送信 (/public/:resource_add.html)
  Client->>Server: POST /api/:resource (JSON)
  Server-->>Client: 201 Created (または 400 Bad Request)
  Client-->>User: 成功時は /:resource へ遷移

  User->>Server: GET /:resource/:id
  Server-->>User: 詳細HTML (EJS SSR / 不在時は 404)

  User->>Client: 項目編集して「変更を保存」
  Client->>Server: PUT /api/:resource/:id (JSON)
  Server-->>Client: 200 OK (または 400 / 404)
  Client-->>User: 画面表示同期・トースト通知

  User->>Client: 「削除」確定
  Client->>Server: DELETE /api/:resource/:id
  Server-->>Client: 200 OK (または 404)
  Client-->>User: 一覧更新または /:resource へ遷移
```

## 3.4. データモデルと REST API 仕様

### 3.4.1. 授業・時間割管理（`/classes`, `/api/classes`）

#### データモデル（`ClassItem` / `classes` テーブル）

| フィールド | 型（SQLite 型） | 説明 |
| --- | --- | --- |
| `id` | `number`（`INTEGER PRIMARY KEY AUTOINCREMENT`） | 正の整数の一意識別子（自動採番） |
| `course` | `string`（`TEXT NOT NULL`） | 科目名（必須） |
| `day` | `string`（`TEXT NOT NULL`） | 曜日（必須、`月` / `火` / `水` / `木` / `金` / `土`） |
| `period` | `string`（`TEXT NOT NULL`） | 時限（必須） |
| `room` | `string`（`TEXT NOT NULL`） | 教室（必須） |
| `teacher` | `string`（`TEXT NOT NULL DEFAULT ''`） | 担当教員（任意、既定値 `""`） |
| `credits` | `number`（`INTEGER NOT NULL DEFAULT 2`） | 単位数（`1`〜`10` の整数、未指定時 `2`） |
| `memo` | `string`（`TEXT NOT NULL DEFAULT ''`） | メモ（任意、既定値 `""`） |

#### 画面ルート・REST API エンドポイント

| メソッド・パス | 概要 | クエリ / リクエストボディ | レスポンス |
| --- | --- | --- | --- |
| `GET /classes` | 一覧画面初期表示 | — | HTML（`views/classes.ejs`） |
| `GET /classes/:id` | 詳細・直接編集画面 | パス `id`（正の整数） | HTML（`views/classes_detail.ejs` / 不在時 `404`） |
| `GET /api/classes` | 授業一覧取得・絞り込み | `?day=曜日&q=キーワード`（`course`/`room`/`teacher`/`memo` 部分一致） | `200` `{ data: ClassItem[] }` |
| `GET /api/classes/:id` | 授業詳細取得 | パス `id` | `200` `{ data: ClassItem }` / `404` `{ error }` |
| `POST /api/classes` | 新規授業登録 | JSON（`course`, `day`, `period`, `room`, `teacher?`, `credits?`, `memo?`） | `201` `{ data: ClassItem }` / `400` `{ error }` |
| `PUT /api/classes/:id` | 授業情報更新 | パス `id`、JSON（同上） | `200` `{ data: ClassItem }` / `400`, `404` `{ error }` |
| `DELETE /api/classes/:id` | 授業削除 | パス `id` | `200` `{ deleted: ClassItem }` / `404` `{ error }` |

### 3.4.2. 第2アプリケーション（未定）

<!-- TODO: データモデルおよび REST API 仕様を記述 -->

### 3.4.3. 第3アプリケーション（未定）

<!-- TODO: データモデルおよび REST API 仕様を記述 -->

## 3.5. 授業で説明していない技術の概要と採用理由

| 技術名 | 概要 | 採用の理由 |
| --- | --- | --- |
| HTTP メソッド（`POST` / `PUT` / `DELETE`） | 資源の作成（`POST`）・全体または項目更新（`PUT`）・削除（`DELETE`）を意味づける HTTP メソッド | 授業前半では `GET` 中心（一部 `POST` のみ）だったが、REST API の設計原則に沿って操作種別を URL とメソッドで明確に分離するため採用。 |
| `express.urlencoded()` / `express.json()` | リクエストボディを解析して `req.body` に格納する Express 標準ミドルウェア | フォーム送信（URL エンコード形式）と REST API 通信（JSON 形式）の双方をサーバ側で安全かつ簡潔に受け取るため採用。 |
| ブラウザ `fetch` API | ブラウザから非同期で HTTP リクエストを送受信する Web 標準 API | 画面全体をリロードせずに一覧の再取得・絞り込み・直接編集・削除を即座に反映し、操作性の高い UI を実現するため採用。 |
| Deno（`deno run`） | セキュアな権限モデルと Node.js 互換機能を備えた JavaScript/TypeScript ランタイム | `package.json` の `dr` スクリプトを通じてファイル・ネットワーク権限を明示した状態で Node.js 互換の動作確認を行えるようにするため採用。 |
| `node:sqlite`（`DatabaseSync`） | Node.js 標準組み込みの同期型 SQLite データベースモジュール | 追加の外部 npm パッケージやネイティブビルドを不要にしつつ、Node.js・Deno の双方で同一コードのままデータをファイル永続化（`.db`）できるため採用。 |

<!-- TODO: 各アプリで追加採用した技術がある場合は追記 -->
