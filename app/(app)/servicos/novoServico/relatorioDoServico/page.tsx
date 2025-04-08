import { Suspense } from 'react';
import Relatorio from './relatorio';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando relatório...</div>}>
      <Relatorio />
    </Suspense>
  );
}
