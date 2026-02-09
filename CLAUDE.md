# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (default: http://localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run test         # Jest tests (ESM mode)
npm run test:watch   # Jest watch mode
npm run format       # Prettier format src files
```

Run a single test file:
```bash
npm run test -- src/components/MessageList/MessageList.test.tsx
```

## Architecture

This is an **AI UI Builder** - a React chat application that generates UI components based on user prompts.

### Layout
Two-column layout in `App.tsx`:
- **Left panel**: Chat interface (MessageList, MessageInput, FileUpload, ScreenshotCapture)
- **Right panel**: Live UI preview (UIPreview) of generated components

### Data Flow
1. User sends message via `MessageInput`
2. `App.tsx` calls `sendMockMessage()` from `services/mockApi.ts`
3. Mock API detects component keywords (navbar, button, card, form, modal, table, sidebar, hero)
4. Returns predefined TSX code with status progression: received -> thinking -> generating -> completed
5. `App.tsx` extracts code blocks from response and renders them in `UIPreview`

### Component Structure
Each component follows this pattern:
```
src/components/ComponentName/
├── ComponentName.tsx      # Implementation
├── types.ts               # TypeScript interfaces
├── styles.css             # Component styles
├── index.ts               # Barrel export
└── ComponentName.test.tsx # Tests
```

### Key Types (src/types/index.ts)
- `Message`: Chat message with id, role (user/assistant), content, attachments
- `Attachment`: File attachment (image or code)
- `FileUploadResult`: Result from file upload with preview
- `ALLOWED_IMAGE_TYPES`: PNG, JPEG, SVG
- `ALLOWED_CODE_EXTENSIONS`: .tsx, .ts, .json, .css

### Mock API (src/services/mockApi.ts)
Currently uses mock data instead of real AI. Keywords in user messages trigger predefined component responses. The `TaskProgress` callback shows status updates in the UI header.

## Stack
- Vite 7 + React 19 + TypeScript
- Tailwind CSS v4 (via @tailwindcss/vite plugin, not PostCSS config)
- Jest 30 with ESM mode + Testing Library
- Vercel AI SDK packages installed but not currently used (mock API active)

## Testing Notes
- Tests require explicit Jest imports: `import { jest, describe, it, expect } from '@jest/globals'`
- CSS modules mocked via identity-obj-proxy
- Test files excluded from production build via tsconfig.app.json
