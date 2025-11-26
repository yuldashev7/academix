'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import z from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import EditAdmin from '@/app/api/admin-api/edit-admin';
import CustomeInput from '@/app/components/custome-input';

const EditAdminPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const formSchema = z.object({
    name: z
      .string()
      .min(4, { message: "Ism kamida 4 ta belgi bo'lishi kerak" }),

    lastName: z
      .string()
      .min(4, { message: "Familya kamida 4 ta belgi bo'lishi kerak" }),

    email: z
      .string()
      .min(5, { message: 'Email kiritish shart' })
      .email({ message: 'Email formati noto‘g‘ri' })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),

    phoneNumber: z.string().regex(/^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/, {
      message: 'Telefon raqam formati noto‘g‘ri',
    }),

    role: z.literal('admin'),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'admin',
    },
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`http://localhost:3600/users/${id}`);
        const data = await res.json();
        form.reset({
          name: data.name || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          role: 'admin',
        });
      } catch (error) {
        toast.error('Admin ma’lumotlarini olishda xatolik');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await EditAdmin(id as string, values);
      toast.success('admin muvaffaqiyatli yangilandi');
      router.push('/super-admin/admin');
    } catch (error) {
      toast.error('Yangilashda xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="p-4 w-[975px] space-y-4">
        <Skeleton className="h-10 w-[120px]" />
        <div className="space-y-3 border p-4 rounded-md">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <Link href={'/super-admin/admin'}>
          <Button variant={'outline'} className="w-[110px]">
            Ortga qaytish
          </Button>
        </Link>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-[15px] w-[975px]"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomeInput
                      label="Ism"
                      placeholder="Yangi ism kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomeInput
                      label="Familya"
                      placeholder="Yangi familya kiriting"
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
                      placeholder="Yangi email kiriting"
                      {...field}
                    />
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
                      placeholder="Yangi Telefon raqam kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type="hidden" value="admin" {...form.register('role')} />
            <Button type="submit" className="w-[120px]">
              {loading ? <Spinner /> : 'Yangilash'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditAdminPage;
