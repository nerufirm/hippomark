# 設計ドキュメント: 認証 + ブックマーク追加機能

**日付:** 2026-03-22
**プロジェクト:** HippoMark (`/Users/nerufirm/開発/hippomark`)
**スタック:** Vite 5 / React 18 / TypeScript / Tailwind CSS 3 / Zustand 4 / zustand-persist / localStorage

---

## 概要

HippoMarkに以下の2機能を追加する：

1. **アカウント登録・ログイン** — グラスモーフィズムUIのモック認証（localStorage永続化）
2. **ブックマーク追加モーダル** — オーバーレイモーダルでURL・タイトル・説明・カテゴリを入力して追加

バックエンドは持たず、すべてlocalStorageで永続化する。`zustand/middleware`の`persist`を使用。

---

## アーキテクチャ

### ストア設計

#### `src/store/useAuthStore.ts`（新規）

```ts
interface User {
  email: string
  name: string
}

interface AuthStore {
  user: User | null
  // 登録済みユーザー一覧（localStorageに保存、モック認証用）
  // パスワードは crypto.subtle で SHA-256 ハッシュ化して保存（平文保存禁止）
  registeredUsers: Array<{ email: string; name: string; passwordHash: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}
```

- `persist` middleware でlocalStorage key `hippomark-auth` に永続化
- `registeredUsers` もlocalStorageに保存（同一ブラウザで登録したユーザーがログインできる）
- **パスワードハッシュ化:** `crypto.subtle.digest('SHA-256', ...)` でハッシュ化し、`passwordHash` として保存。比較時も同様にハッシュ化して照合。
- **バリデーション:**
  - 登録: メール重複チェック、パスワード6文字以上、名前1文字以上
  - ログイン: メール・パスワード（ハッシュ照合）一致チェック
- **登録成功後:** 自動ログインして `/app` にリダイレクト（ログインページに戻さない）
- **localStorage `QuotaExceededError`:** 発生した場合はコンソールエラーを記録し、UIには「保存に失敗しました」トーストを表示（本実装ではスコープ外として最小対応）

#### `src/store/useBookmarkStore.ts`（変更）

- `persist` middleware を追加。localStorage key `hippomark-bookmarks` に永続化
- `addBookmark` アクションはすでに実装済みのため変更不要
- **既存localStorageキーとの競合:** 以前は `persist` なしで運用していたため競合するキーは存在しない。`hippomark-bookmarks` は新規キーとして安全に使用できる。

### ルーティング

```
/              → LandingPage（認証不要。ログイン済みでも表示可能。ランディングから「始める」クリック → /app で ProtectedRoute がチェック）
/login         → AuthPage（未ログインのみ。ログイン済みなら /app にリダイレクト）
/app           → ProtectedRoute → AppPage
/dashboard     → ProtectedRoute → DashboardPage
/categories    → ProtectedRoute → CategoryPage
*              → NotFoundPage
```

- `ProtectedRoute` は `useAuthStore` の `user` を確認し、未ログインなら `/login` にリダイレクト
- ログイン済みユーザーが `/login` にアクセスした場合は `/app` にリダイレクト
- `/`（LandingPage）はログイン状態に関わらずそのまま表示（リダイレクトなし）

---

## コンポーネント設計

### `src/pages/AuthPage.tsx`（新規）

- `/login` に配置。ログインと登録をタブで切り替え
- ページ全体が `bg-primary`（ブランドブルー）背景
- 中央にグラスモーフィズムカード（`bg-white/10 backdrop-blur border border-white/20`）
- フォームバリデーションエラーはカード内に赤テキストで表示
- ログイン成功後は `/app` にナビゲート

**ログインタブのフィールド:**
- メールアドレス（type="email"）
- パスワード（type="password"）
- ログインボタン

**登録タブのフィールド:**
- 名前
- メールアドレス（type="email"）
- パスワード（type="password"、6文字以上）
- 登録ボタン

### `src/components/layout/ProtectedRoute.tsx`（新規）

```tsx
// useAuthStore の user が null なら /login へリダイレクト
// ログイン済みなら <Outlet /> をレンダー
```

### `src/components/app/AddBookmarkModal.tsx`（新規）

- Navbarの「+ 追加」ボタンクリックで表示
- オーバーレイ（`fixed inset-0 bg-black/40`）＋中央カード
- **モーダル外クリック**でクローズ、**ESCキー**でクローズ
- カテゴリは `MOCK_CATEGORIES` から `<select>` で選択

**フィールド:**
| フィールド | 必須 | 備考 |
|-----------|------|------|
| URL | ✓ | `http://` または `https://` で始まるか簡易チェック。不正な場合はフィールド下に赤テキストでエラー表示、送信はブロック |
| タイトル | — | 空の場合はURLのホスト名（`new URL(url).hostname`）を自動設定 |
| 説明 | — | 任意の自由テキスト |
| カテゴリ | ✓ | `src/data/categories.ts` の `MOCK_CATEGORIES` をimportして `<select>` に表示 |

**`addBookmark` に渡す型（既存の `Bookmark` 型）:**
```ts
// src/types/bookmark.ts
interface Bookmark {
  id: string        // crypto.randomUUID() で生成
  title: string
  url: string
  description?: string
  category: string
  isFavourite: boolean   // 初期値 false
  createdAt: string      // new Date().toISOString()
  tags: string[]         // 初期値 []
}
```

- 保存後、フォームをリセットしてモーダルを閉じる
- `useBookmarkStore` の `addBookmark` を呼び出してストアに追加

### `src/components/layout/Navbar.tsx`（変更）

- `useState<boolean>` でモーダル開閉状態を管理（ローカル状態。将来キーボードショートカット等で別トリガーが必要になった場合はUIストアへ移行する）
- 「+ 追加」ボタンでモーダル表示、`AddBookmarkModal` の `onClose` コールバックで閉じる
- 右上アバターをクリックでログアウトドロップダウン表示（`useState<boolean>`で管理）
  - ドロップダウン内容: ユーザー名・メール（表示のみ）、「ログアウト」ボタン
  - ドロップダウン外クリックで閉じる（`useEffect` + `mousedown` イベント）
- ログイン中ユーザー名の頭文字をアバターに表示（`useAuthStore` から取得）

---

## データフロー

```
ユーザー操作
  → AuthPage フォーム送信
  → useAuthStore.login / .register
  → localStorage (hippomark-auth) に永続化
  → user が設定される
  → ProtectedRoute が Outlet をレンダー

ユーザー操作
  → Navbar「+ 追加」クリック
  → AddBookmarkModal 表示
  → フォーム入力 → 保存
  → useBookmarkStore.addBookmark
  → localStorage (hippomark-bookmarks) に永続化
  → BookmarkCard 一覧にリアルタイム反映
```

---

## ファイル変更一覧

| ファイル | 操作 |
|---------|------|
| `src/store/useAuthStore.ts` | 新規作成 |
| `src/store/useBookmarkStore.ts` | persist追加 |
| `src/pages/AuthPage.tsx` | 新規作成 |
| `src/components/layout/ProtectedRoute.tsx` | 新規作成 |
| `src/components/app/AddBookmarkModal.tsx` | 新規作成 |
| `src/components/layout/Navbar.tsx` | 変更（モーダル開閉、アバターメニュー） |
| `src/App.tsx` | 変更（/loginルート、ProtectedRoute追加） |

---

## 除外事項（スコープ外）

- メール確認フロー
- パスワードリセット
- ソーシャルログイン
- バックエンドAPI連携
- ブックマークの編集・インポート/エクスポート
