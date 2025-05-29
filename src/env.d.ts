/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
  readonly VITE_BOT_API: string
  readonly VITE_SHARE_APP: string
  readonly VITE_ADSGRAM_BLOCK_ID: string
  readonly VITE_MANIFEST_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}