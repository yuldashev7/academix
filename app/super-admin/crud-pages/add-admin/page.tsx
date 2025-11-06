'use client';

import CustomeInput from '@/app/components/custome-input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PostAdmin from '@/app/api/admin-api/post-admin';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import TableSkeleton from '@/app/components/table-skeleton';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(4, { message: "Ism kamida 4 ta belgi bo'lishi kerak" }),
  email: z
    .string()
    .min(5, { message: 'Email kiritish shart' })
    .email({ message: 'Email formati noto‘g‘ri' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  phoneNumber: z.string().regex(/^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/, {
    message: 'Telefon raqam formati noto‘g‘ri',
  }),
  role: z.string().min(1),
  password: z
    .string()
    .min(4, { message: "Parol kamida 4 ta belgi bo'lishi kerak" }),
});
const AddAdmin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'admin',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await PostAdmin(values);
      toast.success("Admin muvaffaqiyatli qo'shildi");
      form.reset();
      router.push('/super-admin/admin');
    } catch (error) {
      if (error instanceof Error && error.message !== 'Duplicate email') {
        toast.error("Admin qo'shishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <>
        <div>
          <Link href={'/super-admin/admin'}>
            <Button variant={'outline'} className="w-[120px] mb-[20px]">
              Ortga Qaytish
            </Button>
          </Link>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[15px] shadow px-[20px] py-[20px] w-[960px] rounded-[10px]"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomeInput
                        label="Ism"
                        placeholder="Ism kiriting"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomeInput
                        label="Email"
                        placeholder="Email kiriting"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <CustomeInput
                          label="Parol"
                          placeholder="Parol kiriting"
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                        />
                        <Button
                          variant={'ghost'}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-6"
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomeInput
                        label="Telefon Raqam"
                        placeholder="Telefon Raqam kiriting"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomeInput
                        label="role"
                        hidden
                        defaultValue="admin"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-[100px]">
                {loading ? <Spinner /> : "Qo'shish"}
              </Button>
            </form>
          </Form>
        </div>
      </>
    </div>
  );
};
export default AddAdmin;
