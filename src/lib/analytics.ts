/* src/lib/analytics.ts
   No-op analytics stub for local development.
   Keeps the same exported functions so other modules don't change.
*/
export function initAnalytics() {
  // no-op in local preview
  return;
}

export function track(event: string, props?: Record<string, any>) {
  // no-op in local preview
  return;
}
