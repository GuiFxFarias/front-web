import ClienteForm from './formCliente';

export default function PageCliente() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center lg:h-[50vh] overflow-y-auto'>
      <ClienteForm />
    </div>
  );
}
