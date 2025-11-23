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
import { useEffect, useState } from 'react';
import { coureseT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import CustomeInput from '@/app/components/custome-input';
import EditTeacher from '@/app/api/teacher-api/edit-teacher';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';

const EditTeacherProfile = () => {
  const router = useRouter();
  const { id } = useParams();
  const [curses, setCourses] = useState<coureseT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = z.object({
    name: z
      .string()
      .min(4, { message: "Ism kamida 4 ta belgi bo'lishi kerak" }),

    email: z
      .string()
      .min(5, { message: 'Email kiritish shart' })
      .email({ message: 'Email formati noto‘g‘ri' })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),

    phoneNumber: z.string().regex(/^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/, {
      message: 'Telefon raqam formati noto‘g‘ri',
    }),

    password: z
      .string()
      .min(4, { message: "Parol kamida 4 ta belgi bo'lishi kerak" }),

    courseId: z.string().min(1, 'Kurs tanlang'),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      courseId: '',
    },
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3600/users/${id}`);
        const data = await res.json();

        form.reset({
          name: data.name || '',
          email: data.email || '',
          password: data.password || '',
          phoneNumber: data.phoneNumber || '',
          courseId: data.courseId || '',
        });

        const courseData = await GetCourse();
        setCourses(courseData);
      } catch (error) {
        toast.error('Ma’lumotlarni olishda xatolik');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onSubmit = async (values: FormData) => {
    try {
      await EditTeacher(id as string, values);
      toast.success('Ustoz muvaffaqiyatli yangilandi');
      router.push('/pages/teacher-page/teacher-profile');
    } catch (error) {
      toast.error('Yangilashda xatolik');
    }
  };

  return (
    <div>
      <Link href={'/pages/teacher-page/teacher-profile'}>
        <Button variant={'outline'} className="w-[120px]">
          Ortga Qaytish
        </Button>
      </Link>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[15px] shadow rounded-[10px] py-[20px] px-[20px] mt-[20px]"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomeInput
                    label="Parol"
                    placeholder="Yangi parol kiriting"
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
                    placeholder="Yangi telefon raqam kiriting"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-[120px]">
            {loading ? <Spinner /> : 'Yangilash'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default EditTeacherProfile;
