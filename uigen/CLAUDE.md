# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator. Users describe components in a chat interface, Claude generates code via streaming, and the result renders live in a sandboxed preview. Built with Next.js 15 (App Router), React 19, TypeScript (strict mode).

## Commands

```bash
npm run setup          # Install deps + generate Prisma client + run migrations
npm run dev            # Start dev server (Next.js + Turbopack)
npm run build          # Production build
npm test               # Run all tests (Vitest)
npm test -- --watch    # Watch mode
npm test -- src/components/editor  # Run tests in a specific directory
npx prisma migrate dev --name <name>  # Create a new migration
npx prisma generate    # Regenerate Prisma client after schema changes
```

Note: On Windows, `npm run dev` may fail due to Unix-style `NODE_OPTIONS`. Use bash or run directly: `NODE_OPTIONS='--require ./node-compat.cjs' npx next dev --turbopack`

## Architecture

### Core Flow
1. User sends message in chat UI -> `POST /api/chat` streams response from Claude (Haiku 4.5 via Vercel AI SDK)
2. Claude uses tools (`str_replace_editor`, `file_manager`) to create/edit files in a **VirtualFileSystem** (in-memory, no disk writes)
3. PreviewFrame renders files in a sandboxed iframe using client-side Babel JSX transformation + esm.sh import maps
4. If authenticated, project state (messages + virtual FS) is persisted to SQLite via Prisma

### Key Directories
- `src/actions/` - Server actions for auth (signUp/signIn/signOut) and project CRUD
- `src/app/api/chat/route.ts` - Streaming chat endpoint; wires up AI tools and model
- `src/lib/file-system.ts` - `VirtualFileSystem` class: in-memory file tree, serializable for DB storage
- `src/lib/tools/` - AI tool definitions (str_replace_editor, file_manager) that manipulate VirtualFileSystem
- `src/lib/prompts/generation.tsx` - System prompt instructing Claude how to generate components
- `src/lib/provider.ts` - Model provider; returns Claude or MockLanguageModel when no API key
- `src/lib/contexts/` - React contexts: `ChatContext` (Vercel AI `useChat`) and `FileSystemContext` (virtual FS state + tool call handling)
- `src/lib/transform/` - Client-side Babel JSX transformation for live preview
- `src/components/` - UI organized by feature: `auth/`, `chat/`, `editor/`, `preview/`, `ui/` (Shadcn)

### Auth System
JWT sessions stored in HTTP-only cookies (7-day expiry). Anonymous users can work without auth; their state lives in sessionStorage and migrates to a real project on sign-in.

### Database (Prisma + SQLite)
Two models: `User` (email, hashed password) and `Project` (name, messages as JSON, data as serialized VirtualFS). Schema at `prisma/schema.prisma`.

### Preview System
PreviewFrame uses iframe `srcdoc` with Babel standalone for JSX->JS. Import map resolves React 19 and custom files via blob URLs. Entry point detection: App.jsx -> index.jsx -> first .jsx file.

## Testing

Vitest + React Testing Library + jsdom. Tests live in `__tests__/` folders alongside source. Path aliases (`@/*`) work in tests via `vite-tsconfig-paths`.

## Environment Variables

- `ANTHROPIC_API_KEY` - Optional. Without it, a mock provider returns static component code.
- `JWT_SECRET` - Optional. Defaults to a dev key.
