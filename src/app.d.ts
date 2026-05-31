/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    interface Platform {
      env: {
        BD: D1Database;
        GOOGLE_CLIENT_ID?: string;
        GOOGLE_CLIENT_SECRET?: string;
        OPENAI_API_KEY?: string;
        API_SECRET?: string;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
