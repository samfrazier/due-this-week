import { useCallback, useEffect, useState } from 'react';

// Collapsed headings are a per-device display preference, so they live in
// chrome.storage.local (not sync). Everything starts expanded.
export const COLLAPSED_HEADINGS_KEY = 'collapsed_headings';

export function headingKey(tab: string, heading: string): string {
  return `${tab}:${heading}`;
}

function storageLocal(): chrome.storage.LocalStorageArea | undefined {
  try {
    return typeof chrome !== 'undefined' ? chrome.storage?.local : undefined;
  } catch {
    return undefined;
  }
}

export interface CollapsedHeadings {
  collapsed: Set<string>;
  toggle: (key: string) => void;
}

export default function useCollapsedHeadings(): CollapsedHeadings {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const local = storageLocal();
    if (!local) return;
    local.get(COLLAPSED_HEADINGS_KEY, (result) => {
      const saved = result?.[COLLAPSED_HEADINGS_KEY];
      if (Array.isArray(saved)) setCollapsed(new Set(saved as string[]));
    });
  }, []);

  const toggle = useCallback((key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      storageLocal()?.set({ [COLLAPSED_HEADINGS_KEY]: Array.from(next) });
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
