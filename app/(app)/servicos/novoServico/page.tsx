// app/servicos/novoServico/page.tsx
import { Suspense } from 'react';
import NewServiceForm from './newServiceForm';

export default function PageNewService() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <NewServiceForm />
    </Suspense>
  );
}
