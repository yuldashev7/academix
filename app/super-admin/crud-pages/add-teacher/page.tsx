'use client';
import PostTeacher from '@/app/api/teacher-api/post-teacher';
import CustomeInput from '@/app/components/custome-input';
import TableSkeleton from '@/app/components/table-skeleton';
import { coureseT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { GetCourse } from '../get-course/get-course';
import { Spinner } from '@/components/ui/spinner';
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
  courseId: z.string().min(1, 'Kurs tanlang'),
});

const AddTeacher = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<coureseT[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      courseId: '',
      role: 'teacher',
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await GetCourse();
        setCourses(courseData);
      } catch (error) {
        toast.error('Kurslarni olishda xatolik yuz berdi');
      }
    };
    fetchCourses();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await PostTeacher(values);
      toast.success("Ustoz muvaffaqiyatli qo'shildi");
      form.reset();
      router.push('/super-admin/teacher');
    } catch (error) {
      if (error instanceof Error && error.message !== 'Dublicate email') {
        toast.error("Ustoz qo'shishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <>
        <div>
          <Link href={'/super-admin/teacher'}>
            <Button variant={'outline'}>Ortga Qaytish</Button>
          </Link>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[15px] shadow w-[960px] px-[20px] py-[20px] rounded-[10px] mt-[20px]"
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
                        placeholder="Email Kiriting"
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
                        placeholder="Telefon raqam kiriting"
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Kurs Tanlang" />
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
              <input type="hidden" value="teacher" {...form.register('role')} />
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
export default AddTeacher;
