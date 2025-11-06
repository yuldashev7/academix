'use client';
import { coureseT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { toast } from 'sonner';
import PostStudent from '@/app/api/student-api/post-student';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import CustomeInput from '@/app/components/custome-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';
import { Eye, EyeOff } from 'lucide-react';

const AddStudent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourse] = useState<coureseT[]>([]);
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<coureseT | null>(null);
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
    password: z
      .string()
      .min(4, { message: "Parol kamida 4 ta belgi bo'lishi kerak" }),
    courseId: z.string().min(1, 'Kurs tanlang'),
    paidAmount: z
      .string()
      .min(1, 'To‘lagan summasini kiriting')
      .refine((val) => !isNaN(Number(val.replace(/\s/g, ''))), {
        message: 'To‘lov summasi son bo‘lishi kerak',
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      courseId: '',
      paidAmount: '',
      role: 'student',
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await GetCourse();
        setCourse(courseData);
      } catch (error) {
        toast.error('Kurslarni olishda xatolik yuz berdi');
      }
    };
    fetchCourse();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        paidAmount: Number(values.paidAmount.replace(/\s/g, '')),
      };
      const res = await PostStudent(payload);
      toast.success("O'quvchi muvaffaqiyatli qo'shildi");
      router.push('/admin/student');
      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message !== 'Dublicate email') {
        toast.error("o'quvchi qo'shishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <div>
        <Link href={'/admin/student'}>
          <Button variant={'outline'}>Ortga Qaytish</Button>
        </Link>
      </div>

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
                      onClick={() => setShowpassword(!showPassword)}
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
            name="paidAmount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomeInput
                    label="Kursga To'lagan Narxi"
                    placeholder="Kursga To'lagan Narxini kiriting"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatNumber(e.target.value);
                      field.onChange(formatted);
                    }}
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      const foundCourse = courses.find(
                        (c) => String(c.id) === value
                      );
                      setSelectedCourse(foundCourse || null);
                    }}
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
          <input type="hidden" value="student" {...form.register('role')} />
          <Button type="submit" className="w-[100px]">
            {loading ? <Spinner /> : "Qo'shish"}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default AddStudent;
