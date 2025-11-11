'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email bo'sh bo'lmasligi kerak" })
    .min(4, {
      message: 'Email kamida 4 ta belgi bolishi kerak',
    })
    .email("Iltimos tog'ri email kiriting !"),
  password: z
    .string()
    .min(4, { message: "Parol kamida 4 ta belgi bo'lishi kerak" }),
});

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:3600/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        toast.error('Email yoki parol noto‘g‘ri');
        return;
      }
      const data = await res.json();
      const user = data.user;

      document.cookie = `token=${data.accessToken};path=/`;
      document.cookie = `role=${user.role};path=/`;
      document.cookie = `userId=${user.id};path=/`;

      toast.success('Tizimga muvaffaqiyatli kirdingiz');

      switch (user.role) {
        case 'super-admin':
          router.push('/super-admin/admin');
          break;
        case 'admin':
          router.push('/admin/teacher');
          break;
        case 'teacher':
          router.push('/pages/teacher-page/student');
          break;
        case 'student':
          router.push('/student');
          break;
        default:
          setError("Nomalum ro'l");
      }
    } catch (error) {
      console.log('Login error', error);
      setError('Xatolik yuz berdi, qayta urinib ko‘ring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container h-screen flex flex-col justify-center items-center">
      <div className="shadow sm:py-[10px] sm:px-[40px] md:py-[30px] md:px-[50px] lg:py-[40px] px-[60px] rounded-[10px] text-center">
        <h1 className="sm:mb-[10px] md:mb-[20px] font-[600] w-[303px] text-[20px]">
          Xush Kelibsiz
        </h1>
        <h2 className="sm:mb-[10px] md:mb-[20px] lg:mb-[30px] font-[500] w-[303px]">
          Tizimga kirish uchun Email va Parolingizni kiriting!
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
            <div className="relative">
              <label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Mail className="w-[16px] absolute mt-[29px] ml-[10px]" />
                      <FormControl>
                        <Input
                          className="pl-[30px]"
                          placeholder="Email kiriting"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </label>
            </div>
            <div className="-mt-[10px] relative">
              <label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parol</FormLabel>
                      <KeyRound className="w-[16px] absolute mt-[29px] ml-[10px]" />
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="pl-[30px]"
                            placeholder="Parol kiriting"
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                          />
                          <Button
                            variant={'ghost'}
                            type="button"
                            onClick={() => setShowpassword(!showPassword)}
                            className="absolute right-0 top-0"
                          >
                            {showPassword ? <Eye /> : <EyeOff />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </label>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Spinner /> : 'Kirish'}
            </Button>
          </form>
        </Form>
        <div className="w-[300px] sm:mt-[10px] md:mt-[20px]">
          <p className="text-sm leading-[140%] text-gray-600">
            Email yoki parolingiz esingizdan chiqgan bo'lsa markaz
            administratsiyasiga murojaat qilishingiz mumkin.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
