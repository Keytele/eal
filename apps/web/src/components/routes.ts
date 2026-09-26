import type { Route } from 'next';

/**
 * Locale and market segments are runtime validated before this boundary. Next
 * cannot infer every localized catch-all route at compile time, so this is the
 * single explicit conversion for those validated internal paths.
 */
export function toRoute(path: string): Route {
  return path as Route;
}
