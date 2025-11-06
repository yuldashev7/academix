'use client';
import { coureseT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { GetCourse } from '../../get-course/get-course';
import { toast } from 'sonner';
import EditStudent from '@/app/api/student-api/edit-student';
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

const EditStudentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<coureseT[]>([]);
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
    role: z.string().min(1),
    courseId: z.string().min(1, 'Kurs tanlang'),
    paidAmount: z
      .string()
      .min(1, 'To‘lagan summasini kiriting')
      .refine((val) => !isNaN(Number(val.replace(/\s/g, ''))), {
        message: 'To‘lov summasi son bo‘lishi kerak',
      }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      courseId: '',
      paidAmount: '',
      role: 'student',
    },
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3600/users/${id}`);
        const data = await res.json();
        form.reset({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          courseId: data.courseId || '',
          paidAmount: data.paidAmount,
          role: 'student',
        });

        const fetchCourse = async () => {
          try {
            const courseData = await GetCourse();
            setCourse(courseData);
          } catch (error) {
            toast.error('Kurslarni olishda xatolik yuz berdi');
          }
        };
        fetchCourse();
      } catch (error) {
        toast.error("O'quvchi ma’lumotlarini olishda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const cleanedValue = {
        ...values,
        paidAmount: values.paidAmount.replace(/\s/g, ''),
      };

      const res = await EditStudent(id as string, cleanedValue);
      toast.success("O'quvchi muvaffaqiyatli yangilandi");
      router.push('/super-admin/student');
    } catch (error) {
      toast.error('Yangilashda xatolik');
    }
  };

  const formatNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div>
      <Link href={'/super-admin/student'}>
        <Button variant={'outline'} className="w-[100px]">
          Ortga Qaytish
        </Button>
      </Link>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[15px] mt-[20px] shadow px-[20px] py-[20px] rounded-[10px]"
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
                    label="telefon Raqam"
                    placeholder="Yangi telefon raqam kiriting"
                    {...field}
                  />
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
                    placeholder="Yangi kursga to'lagan narxini kiriting"
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Yangi Kurs Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Kurslar</SelectLabel>
                        {course.map((item) => (
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
export default EditStudentPage;
