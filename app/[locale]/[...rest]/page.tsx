import { notFound } from 'next/navigation';

// Qualquer caminho desconhecido dentro de um idioma (ex.: /es-es/xyz) mostra a 404 traduzida.
export default function CatchAll() {
  notFound();
}
