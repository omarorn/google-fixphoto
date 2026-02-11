# Project Overview: google-fixphoto (NanoBanana Editor)

## Purpose
An AI-powered image editor that uses Google Gemini 2.5 Flash Image model to restore, age, fix, and transform photos via text prompts. Originally created in Google AI Studio.

## Tech Stack
- React 19 with TypeScript
- Vite 6 (build tool)
- Google GenAI SDK (`@google/genai`)
- Lucide React (icons)
- Gemini 2.5 Flash Image (AI model)

## Key Files
- `App.tsx` — Main application component
- `components/ImageEditor.tsx` — Core image editing UI component
- `components/Button.tsx` — Reusable button component
- `services/geminiService.ts` — Gemini API integration service
- `types.ts` — TypeScript type definitions
- `metadata.json` — AI Studio app metadata (name, description)
- `vite.config.ts` — Vite build configuration

## Build/Run Commands
- `npm install` — Install dependencies
- `npm run dev` — Run development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- Requires `GEMINI_API_KEY` in `.env.local`

## Notes
- Google AI Studio exported app (can be viewed/edited in AI Studio)
- Simple flat project structure (no src/ directory — components at root level)
- Package name is "nanobanana-editor"
