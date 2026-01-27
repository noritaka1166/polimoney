# Polimoney AI Coding Instructions

政治資金透明化プラットフォームのためのオープンソースプロジェクト。

## Project Architecture

### Key Components

- **Frontend**: Next.js 15 + React 19 + Chakra UI v3 + Nivo charts
- **Build Tools**: Biome (JS/TS)、Ruff+Pyright (Python)

## Development Guidelines

### 言語・スタイル

- 日本語でのコミュニケーション
- 作業説明的なコメントを避ける（`// この行を追加` など）
- シンプルな関数型プログラミング

## Critical Patterns

### Data Conversion Pipeline

1. `tools/pdf_to_images.py` - PDF→画像変換
2. `tools/analyze_image.py` - AI 解析（Gemini）
3. `tools/merge_jsons.py` - JSON 統合
4. `data/converter.ts` - フロントエンド用変換

### Error Handling Pattern

- エラー発生時は根本原因の特定を心がけること
- コードの変更を行った際、ワークスペース内で検出されている問題を確認すること

## Integration Points

### External APIs

- **Gemini API**: 資料解析
- **Auth0**: 認証

## File Patterns

### Critical Files

- `models/type.d.ts` - 型定義（最重要）
- `data/converter.ts` - データ変換ロジック
- `scripts/create-json-for-web.sh` - 全体パイプライン
- `tools/README.md` - Python環境セットアップ

### Configuration

- `biome.json` - JS/TS linting (tools除外)
- `lefthook.yml` - Git hooks
- `tools/pyproject.toml` - Python dependencies
