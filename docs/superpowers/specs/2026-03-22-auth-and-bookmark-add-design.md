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
  registeredUsers: Array<{ email: string; name: string; password: string }>
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (email: string, name: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}
```

- `persist` middleware でlocalStorage key `hippomark-auth` に永続化
- `registeredUsers` もlocalStorageに保存（同一ブラウザで登録したユーザーがログインできる）
- **バリデーション:**
  - 登録: メール重複チェック、パスワード6文字以上、名前1文字以上
  - ログイン: メール・パスワード一致チェック

#### `src/store/useBookmarkStore.ts`（変更）

- `persist` middleware を追加。localStorage key `hippomark-bookmarks` に永続化
- `addBookmark` アクションはすでに実装済みのため変更不要

### ルーティング

```
/              → LandingPage（認証不要）
/login         → AuthPage（ログイン/登録タブ）
/app           → ProtectedRoute → AppPage
/dashboard     → ProtectedRoute → DashboardPage
/categories    → ProtectedRoute → CategoryPage
*              → NotFoundPage
```

- `ProtectedRoute` は `useAuthStore` の `user` を確認し、未ログインなら `/login` にリダイレクト
- ログイン済みユーザーが `/login` にアクセスした場合は `/app` にリダイレクト

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
| URL | ✓ | `https://` で始まるか簡易チェック |
| タイトル | — | 空の場合はURLのホスト名を自動設定 |
| 説明 | — | 任意の自由テキスト |
| カテゴリ | ✓ | MOCK_CATEGORIESのselectボックス |

- 保存後、フォームをリセットしてモーダルを閉じる
- `useBookmarkStore` の `addBookmark` を呼び出してストアに追加

### `src/components/layout/Navbar.tsx`（変更）

- 「+ 追加」ボタンに `AddBookmarkModal` の開閉状態を追加
- 右上のアカウントアバター（`H`）をクリックでログアウトメニュー表示（シンプルなドロップダウン）
- ログイン中ユーザー名の頭文字をアバターに表示

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
