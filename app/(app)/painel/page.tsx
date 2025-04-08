'use server';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function Painel() {
  return (
    <div className='flex w-full min-h-screen bg-gray-100'>
      {/* Dashboard */}
      <main className='flex-1 p-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6'>
          Dashboard de Vendas
        </h1>
        <div className='grid grid-cols-3 gap-6'>
          {/* Card 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-semibold text-gray-700'>
                R$ 50.000,00
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-semibold text-gray-700'>350</p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Novos Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-semibold text-gray-700'>45</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
