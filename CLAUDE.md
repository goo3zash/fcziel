# FC ZIEL サイトプロジェクト

東京都北区の社会人サッカーチーム FC ZIEL の公式ウェブサイト。

## 公開URL

https://fcziel.github.io/

## 技術構成

- 静的HTML / CSS / Vanilla JS（フレームワークなし）
- ホスティング：GitHub Pages（リポジトリ：fcziel/fcziel.github.io）
- フォーム：Googleフォーム（埋め込み）
- 分析：Google Analytics（G-9GGPW8HF98）
- 検索：Google Search Console 登録済み

## ページ構成

| ファイル | 内容 |
|----------|------|
| index.html | トップ・お知らせ・試合日程・ポップアップ |
| about.html | チーム情報・プロフィール・写真 |
| location.html | 活動場所・Googleマップ |
| results.html | 試合結果（2018〜現在） |
| join.html | メンバー募集・問い合わせフォーム |
| faq.html | よくある質問（8項目） |
| admin.html | 管理ツール（お知らせ・試合結果・分析） |
| update.html | 第三者用更新フォームへのリダイレクト |
| sitemap.xml | SEO用サイトマップ |
| robots.txt | クローラー設定 |
| gas_updater.js | Google Apps Script（参照用） |
| .github/workflows/health-check.yml | 週次サイト健全性チェック・自動修復 |

## ファイル構成

```
fcziel/
├── images/              画像ファイル（チーム写真・フリー素材）
├── 北区リーグ結果/      北区社会人リーグPDF（日程・結果）
├── .github/workflows/   GitHub Actions
├── *.html               サイトページ
├── style.css            共通スタイル（金×紺のカラーテーマ）
├── stars.js             ヒーロー背景の星アニメーション
└── favicon.svg          盾形ロゴアイコン
```

## チーム情報

- 正式名称：FootballClub ZIEL（フットボールクラブ ツィール）
- 設立：1989年
- 所属：東京都北区社会人サッカーリーグ 2部A
- 活動場所：赤羽スポーツの森公園 / 北運動公園
- 活動日：主に日曜日（月1回程度、リーグスケジュールによる）
- ユニフォーム：1st=金、2nd=白
- 代表：新山
- 平均年齢：35歳
- 問い合わせ：Googleフォーム → zeinokada@gmail.com に通知

## デザインルール

- カラー：金（#D4A01A）× 紺（#0D1117）/ ユニフォームカラーに統一
- フォント：Hiragino / Meiryo / sans-serif
- 表記：チーム名は **ZIEL**（全大文字で統一）
- 活動日の表記：「主に日曜日」

## コンテンツ更新方法

### 試合結果・次の試合の更新（第三者も可）
- **更新フォームURL**：https://fcziel.github.io/update
- Google フォームで入力 → 自動でサイトに反映（数分）
- 更新対象：results.html の試合テーブル、index.html のお知らせ・ポップアップ

### Google Apps Script
- スクリプトURL：https://script.google.com（FC ZIELアカウントでログイン）
- フォーム送信 → onFormSubmit → GitHub API 経由でファイル更新
- トークン：スクリプトプロパティ `GITHUB_TOKEN`（Classic token、repo権限）

### 手動更新時の挿入ポイント
- お知らせ（index.html）：`<!-- NEWS_INSERT -->` の直後に追記
- 試合結果（results.html）：`<!-- ▼ 試合結果をここに追加（新しい順） ▼ -->` の直後に追記
- 次の試合（index.html）：`<!-- NEXT_MATCH_START -->〜<!-- NEXT_MATCH_END -->` を置換
- 次の試合（results.html）：`<!-- NEXT_RESULT_ROW_START -->〜<!-- NEXT_RESULT_ROW_END -->` を置換
- ポップアップ次の試合：`<!-- POPUP_UPCOMING_START -->〜<!-- POPUP_UPCOMING_END -->` を置換
- ポップアップ結果：`<!-- POPUP_RESULT_START -->〜<!-- POPUP_RESULT_END -->` を置換

### ローカル↔GitHub 同期
- GAS がフォーム経由で GitHub を直接更新するため、ローカルは自動では更新されない
- ローカルを編集する前に必ず GitHub Desktop で **Pull** すること

### GitHubへの反映手順
1. ローカルファイルを編集
2. GitHub Desktop で Commit → Push
3. 数分でサイトに反映

## 週次サイト健全性チェック（自動）

- 毎週月曜 9:00 JST に GitHub Actions が自動実行
- results.html・index.html・faq.html の破損を検知
- 破損時：直前の正常コミットに自動修復 + GitHub Issue で通知

## 試合結果HTMLテンプレート

```html
<!-- 勝ち -->
<tr class="result-win">
  <td>5/17（日）</td><td>相手チーム</td><td>赤羽スポーツの森</td>
  <td><span class="match-score win">3 − 1</span></td>
  <td><span class="match-badge badge-win">○ 勝</span></td>
</tr>

<!-- 負け -->
<tr class="result-loss">
  <td>日付</td><td>相手</td><td>会場</td>
  <td><span class="match-score loss">0 − 2</span></td>
  <td><span class="match-badge badge-loss">● 負</span></td>
</tr>

<!-- 予定 -->
<tr class="result-upcoming">
  <td>日付</td><td>相手</td><td>会場</td>
  <td>−</td>
  <td><span class="match-badge badge-upcoming">予定</span></td>
</tr>
```

## 2026年度試合日程（PDFより）

| 日付 | 相手 | 会場 | 結果 |
|------|------|------|------|
| 4/29（水祝）| 志茂 | 北運動公園 | 1-2 負 |
| 5/17（日）| トリコロール | 赤羽スポーツの森 | 予定 |
| 5/31（日）| - | - | - |

## SEO状況

- Google Search Console：登録済み（サイトマップ送信済み）
- Google Analytics：G-9GGPW8HF98（全ページ設置）
- sitemap.xml：6ページ登録
- 対象キーワード：社会人サッカー 北区 / 北区 サッカー 未経験 / FC ZIEL

## GitHub管理ツール用トークン

GitHub → Settings → Developer settings → Personal access tokens → Classic tokens
- 対象リポジトリ：fcziel/fcziel.github.io
- 必要権限：repo（全権限）
