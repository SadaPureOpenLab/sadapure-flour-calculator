export function Icon({ kind }: { kind: 'file' | 'copy' | 'share' | 'print' }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'file' ? <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 12h6M9 16h6"/></> : kind === 'copy' ? <><rect x="8" y="7" width="12" height="14" rx="2"/><path d="M15 7V3H4v14h4"/></> : kind === 'share' ? <><circle cx="18" cy="4" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="20" r="3"/><path d="m8.5 10.5 7-5M8.5 13.5l7 5"/></> : <><path d="M6 8V3h12v5M6 17H3V8h18v9h-3"/><path d="M6 14h12v7H6zM17 11h1"/></>}
  </svg>;
}
