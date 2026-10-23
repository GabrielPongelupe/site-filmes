/* eslint-disable @next/next/no-img-element -- imagens remotas de hosts variados, sem otimização */

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  label?: string;
  variant?: '' | 'sm' | 'poster' | 'thumb';
  eager?: boolean;
  children?: React.ReactNode;
};

// Bloco de imagem: usa a foto quando há src; sem src, mostra o placeholder listrado do design.
export function Media({ src, alt = '', className = '', label, variant = '', eager, children }: Props) {
  const v = variant ? ` placeholder--${variant}` : '';
  return (
    <div className={`media placeholder${v} ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" referrerPolicy="no-referrer" />
      ) : (
        label
      )}
      {children}
    </div>
  );
}
