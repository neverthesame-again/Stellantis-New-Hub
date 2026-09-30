/**
 * @file Hook that follows the app's light/dark theme.
 */

import { useEffect, useState } from 'react';

/**
 * Reads the theme the core app sets on `<html data-theme>`.
 *
 * @returns {'light' | 'dark'}
 */
const readTheme = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

/**
 * Current app theme, updated whenever the user toggles it. The core app keeps
 * the theme in its own state and only mirrors it onto `<html>`, so AMS
 * components (for example the React Flow canvas) observe that attribute.
 *
 * @returns {'light' | 'dark'}
 */
export function useDocumentTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
