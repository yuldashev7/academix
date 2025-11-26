'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import UseGetCookie from '@/hooks/use-get-cookie';
import React, { useEffect, useState } from 'react';
import GetGroup from '@/app/api/group-api/get-group';
import StudentModal from '@/app/components/student-modal';
import GetStudent from '@/app/api/student-api/get-student';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import TableSkeleton from '@/app/components/table-skeleton';
import DeleteStudent from '@/app/api/student-api/delete-student';
import { coureseT, groupT, studentT, teachersT } from '@/app/types/types';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';

export default function Student() {
  const router = useRouter();
  const [user, setUser] = useState<studentT[]>([]);
  const [course, setCourse] = useState<coureseT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [getTeacher, setGetTeacher] = useState<teachersT[]>([]);
  const [selectedGroup, setSelectedGropu] = useState<groupT[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const teacherId = UseGetCookie('userId') ?? undefined;
        console.log('teacherId', teacherId);
        const students = await GetStudent();
        console.log('Fetched students:', students);
        setUser(
          students.map((s: any) => ({
            ...s,
            courseId: Number(s.courseId),
            groupId: Number(s.groupId),
            teacherId: s.teacherId ? Number(s.teacherId) : null,
          }))
        );

        const courses = await GetCourse();
        setCourse(courses);

        const teachers = await GetTeacher();
        setGetTeacher(teachers);
        console.log('Teachers:', teachers);

        const groups = await GetGroup();
        setSelectedGropu(groups);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <TableSkeleton />;

  if (user.length === 0)
    return (
      <p className="text-sm text-muted-foreground p-4">Foydalanuvchilar yo‘q</p>
    );

  const formatData = (dataString: string) => {
    const date = new Date(dataString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGroupName = (id: number) => {
    const group = selectedGroup.find((g) => g.id === id);
    return group ? group.name : 'Guruh topilmadi';
  };

  const getTeacherName = (id: number | string | null | undefined) => {
    const teacher = getTeacher.find((t) => String(t.id) === String(id));
    return teacher ? teacher.name : 'Ustoz topilmadi';
  };

  const getCourseName = (id: number) => {
    const courses = course.find((el) => Number(el.id) === Number(id));
    return courses ? courses.name : 'Kurs topilmadi';
  };

  const getCoursePrice = (id: number) => {
    const found = course.find((c) => Number(c.id) === Number(id));
    return found ? `${Number(found.price).toLocaleString()} UZS` : 'Topilmadi';
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await DeleteStudent(id);
      if (res) {
        setUser((el) => el.filter((del) => del.id !== id));
        toast.success("O'quvchi muvafaqqiyatli o'chirildi");
      }
    } catch (error) {
      toast.error('Xatoli yuz berdi');
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: string | number) => {
    const num = Number(price);
    if (isNaN(num)) return '0';
    return num.toLocaleString('uz-UZ').replace(/,/g, ' ');
  };

  return (
    <div>
      <Link href={'/super-admin/crud-pages/add-student'}>
        <Button variant={'outline'} className="w-[140px]">
          O‘quvchi qo‘shish
        </Button>
      </Link>
      <h1 className="mb-[20px] mt-[10px] text-center font-medium text-[20px] text-gray-800">
        O'quvchilar
      </h1>
      <div className="w-full overflow-x-auto mt-5">
        <div className="border rounded-md">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[50px]">Id</TableHead>
                <TableHead className="text-center">Ism</TableHead>
                <TableHead className="text-center">Familya</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Telefon</TableHead>
                <TableHead className="text-center">Sana</TableHead>
                <TableHead className="text-center">O‘qiyotgan kurs</TableHead>
                <TableHead className="text-center">O‘qiyotgan guruhi</TableHead>
                <TableHead className="text-center">O‘qituvchisi</TableHead>
                <TableHead className="text-center">To‘lagan</TableHead>
                <TableHead className="text-center">Umumiy narx</TableHead>
                <TableHead className="text-center w-[160px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {user.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{item.lastName}</TableCell>
                  <TableCell className="text-center">{item.email}</TableCell>
                  <TableCell className="text-center">
                    {item.phoneNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatData(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getCourseName(item.courseId)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getGroupName(item.groupId)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getTeacherName(item.teacherId)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatPrice(item.paidAmount)} UZS
                  </TableCell>
                  <TableCell className="text-center">
                    {getCoursePrice(item.courseId)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        className="w-[70px]"
                        variant={'outline'}
                        onClick={() => setOpenModal(true)}
                      >
                        Ko‘rish
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(
                            `/super-admin/crud-pages/edit-student/${item.id}`
                          )
                        }
                        className="w-[70px]"
                      >
                        Tahrirlash
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        className="w-[70px]"
                        variant={'destructive'}
                      >
                        {deletingId === item.id ? <Spinner /> : "O'chirish"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <StudentModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
