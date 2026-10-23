export function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export const fmtViews = (n: number) => n.toLocaleString('pt-BR');

/** Olho + número. `overlay` = selo sobre a imagem do card. */
export function Views({ n, overlay = false }: { n: number; overlay?: boolean }) {
  return (
    <span className={overlay ? 'views-badge' : 'views-inline'} title={`${fmtViews(n)} visualizações`}>
      <EyeIcon size={overlay ? 15 : 14} />
      <span>{fmtViews(n)}</span>
      <span className="sr-only"> visualizações</span>
    </span>
  );
}
