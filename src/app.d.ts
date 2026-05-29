/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace App {
    interface Platform {
      env: {
        BD: D1Database
      }
    }
  }
}

export {};
