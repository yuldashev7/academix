'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const EditTeacherPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<coureseT[]>([]);

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

    role: z.string().min(1),

    courseId: z.string().min(1, 'Kurs tanlang'),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      courseId: '',
      role: 'teacher',
    },
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3600/users/${id}`);
        const data = await res.json();

        form.reset({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          courseId: data.courseId || '',
          role: 'teacher',
        });

        const fetchCourses = async () => {
          try {
            const coursesData = await GetCourse();
            setCourses(coursesData);
          } catch (error) {
            toast.error('Kurslarni olishda xatolik yuz berdi');
          }
        };

        fetchCourses();
      } catch (error) {
        toast.error('Ustoz ma’lumotlarini olishda xatolik');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await EditTeacher(id as string, values);
      toast.success('Ustoz muvaffaqiyatli yangilandi');
      router.push('/admin/teacher');
    } catch (error) {
      toast.error('Yangilashda xatolik');
    }
  };

  return (
    <div>
      <Link href={'/admin/teacher'}>
        <Button variant={'outline'} className="w-[120px]">
          Ortga Qaytish
        </Button>
      </Link>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[15px] shadow px-[20px] py-[20px] w-[960px] rounded-[10px] mt-[20px]"
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
          <label>
            Kurs
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Yangi Kurs Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Kurslar</SelectLabel>
                        {courses.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </label>
          <Button type="submit" className="w-[100px]">
            {loading ? <Spinner /> : 'Yangilash'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default EditTeacherPage;
