'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import TransmissorForm from './formTransmissor';
import PosicionadorForm from './formPositioner';

export default function RegisterProductForm() {
  const [isTransmitter, setIsTransmistter] = useState<boolean>();
  const [isPositioner, setIsPositioner] = useState<boolean>();

  return (
    <>
      <h1>O cadastro será de um transmissor ou posicionador?</h1>
      <div className='flex items-center space-x-2 mt-4 border-b-[1px] pb-2 w-full'>
        <Checkbox
          id='transmistter'
          onCheckedChange={(e: boolean) => setIsTransmistter(e)}
        />
        <label
          htmlFor='transmistter'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Transmissor
        </label>

        <Checkbox
          id='positioner'
          onCheckedChange={(e: boolean) => setIsPositioner(e)}
        />
        <label
          htmlFor='positioner'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Posicionador
        </label>
      </div>
      {isTransmitter && !isPositioner ? <TransmissorForm /> : null}
      {!isTransmitter && isPositioner ? <PosicionadorForm /> : null}
    </>
  );
}
