/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { setCookie } from 'cookies-next';

interface IForm {
  Email: string;
  Senha: string;
}

const loginSchema = z.object({
  Email: z.string().email('Por favor, insira um email válido.'),
  Senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<IForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: '',
      Senha: '',
    },
  });

  async function onSubmit(values: IForm) {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
        {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const resJson = await res.json();

      if (res.ok) {
        const usuario = resJson.usuario;
        const { token, expiration } = resJson.value;

        setCookie('token', token, {
          expires: new Date(expiration),
          path: '/',
          // secure: process.env.NODE_ENV === 'production',
          secure: false,
          // sameSite: 'none',
          sameSite: 'lax',
        });

        localStorage.setItem('usuarioEmail', usuario.Email);

        router.push('/painel');
      } else {
        console.error(
          'Erro no login:',
          resJson?.erro || 'Autenticação falhou.'
        );
      }
    } catch (error: any) {
      console.log('Erro no login:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg'>
        <h1 className='text-2xl font-semibold text-center text-gray-700'>
          Login
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Campo de Email */}
            <FormField
              name='Email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Digite seu email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo de Senha */}
            <FormField
              name='Senha'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Digite sua senha'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Botão de Login */}
            <Button
              type='submit'
              className='w-full flex justify-center items-center'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='animate-spin mr-2' size={20} />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
