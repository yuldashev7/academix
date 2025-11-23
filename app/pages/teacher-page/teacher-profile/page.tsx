'use client';
import z from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomeInput from '@/app/components/custome-input';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const TeacherProfile = () => {
  const [teacherId, setTeacherId] = useState<string>('');
  const [showPassword, SetShowPassword] = useState<boolean>(false);
  const formSchema = z.object({
    name: z
      .string()
      .min(4, { message: "Ism kamida 4 ta belgi bo'lishi kerak" }),

    email: z
      .string()
      .min(5, { message: 'Email kiritish shart' })
      .email({ message: 'Email formati noto‘g‘ri' })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),

    password: z
      .string()
      .min(4, { message: "Parol Kamida 4 ta belgi bo'lishi kerak" }),

    phoneNumber: z.string().regex(/^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/, {
      message: 'Telefon raqam formati noto‘g‘ri',
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const data = await GetTeacher();
        if (data && data[0]) {
          form.reset({
            name: data[0]?.name || '',
            email: data[0]?.email || '',
            password: data[0]?.password || '',
            phoneNumber: data[0]?.phoneNumber || '',
          });
          setTeacherId(data[0]?.id);
        }
      } catch (error) {
        toast.error('Ustoz ma’lumotlarini olishda xatolik');
      }
    };

    fetchTeacher();
  }, [form]);

  return (
    <div>
      {teacherId && (
        <Link
          href={`/pages/teacher-page/crud-pages/edit-teacher-profile/${teacherId}`}
        >
          <Button variant={'outline'}>Profilni tahrirlash</Button>
        </Link>
      )}
      <Form {...form}>
        <form className="flex flex-col gap-[20px] shadow px-[20px] py-[20px] rounded-[10px] mt-[20px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomeInput
                    label="Ism"
                    placeholder="Ism"
                    {...field}
                    readOnly
                  />
                </FormControl>
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
                    placeholder="Email"
                    {...field}
                    readOnly
                  />
                </FormControl>
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
                      label="Password"
                      placeholder="Password"
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      readOnly
                    />
                    <Button
                      variant={'ghost'}
                      type="button"
                      onClick={() => SetShowPassword(!showPassword)}
                      className="absolute right-0 top-6"
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </FormControl>
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
                    placeholder="Telefon Raqam"
                    {...field}
                    readOnly
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
export default TeacherProfile;
