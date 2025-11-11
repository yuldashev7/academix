'use client';

import GetGroup from '@/app/api/group-api/get-group';
import PostGroup from '@/app/api/group-api/post-group';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import CustomeInput from '@/app/components/custome-input';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';
import { coureseT, groupT, postGroupT, teachersT } from '@/app/types/types';
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

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const AddCoursesPage = () => {
  const router = useRouter();
  const [group, setGroup] = useState<groupT[]>([]);
  const [courses, setCourses] = useState<coureseT[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<teachersT[]>([]);

  const formSchema = z.object({
    name: z.string().min(1, { message: "Guruh qo'shish shart" }),
    courseId: z.string().optional(),
    teacherId: z.string().min(1, { message: 'Ustoz tanlash shart' }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      courseId: '',
      teacherId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, teacherData, groupData] = await Promise.all([
          GetCourse(),
          GetTeacher(),
          GetGroup(),
        ]);
        setCourses(courseData),
          setGroup(groupData),
          setSelectedTeacher(teacherData);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: postGroupT = {
        name: values.name,
        courseId: Number(values.courseId),
        teacherId: Number(values.teacherId),
      };

      const res = await PostGroup(payload);
      toast.success("Guruh muvaffaqiyatli qo'shildi");
      form.reset();
      router.push('/admin/all-courses');
    } catch (error) {
      if (error instanceof Error && error.message !== 'Dublicate group') {
        toast.error("Guruh qo'shishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center h-screen items-center"
        >
          <div className="w-[400px] shadow h-[300px] flex flex-col justify-center px-[20px] py-[20px] rounded-[10px] gap-[15px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomeInput
                      label="Guruh Nomi"
                      placeholder="Guruh nomini kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <label>
              Kurslar
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[360px]">
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

            <label>
              Ustozlar
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[360px]">
                        <SelectValue placeholder="Ustoz Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Ustozlar</SelectLabel>
                          {selectedTeacher.map((item) => (
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
            <Button type="submit">Qo'shish</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddCoursesPage;
