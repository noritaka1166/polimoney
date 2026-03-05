# Polimoney AI Coding Instructions

政治資金透明化プラットフォームのためのオープンソースプロジェクト。

## Project Architecture

### Key Components

- **Frontend**: Next.js 15 + React 19 + Chakra UI v3 + Nivo charts
- **Build Tools**: Biome (JS/TS)、Ruff+Pyright (Python)

## Development Guidelines

### 会話

- 特に指示がない場合、日本語でコミュニケーションを行う
- 作業説明的なコメントを避ける（`// この行を追加` など）
- シンプルな関数型プログラミングを心掛ける

## Critical Patterns

### Error Handling Pattern

- エラー発生時は根本原因の特定を心がけること
- コードの変更を行った際、ワークスペース内で検出されている問題を確認すること

## Integration Points

### External APIs

- **Gemini API**: 資料解析
- **Auth0**: 認証
