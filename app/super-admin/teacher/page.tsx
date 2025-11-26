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
import React, { useEffect, useState } from 'react';
import { teachersT, coureseT } from '@/app/types/types';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import TableSkeleton from '@/app/components/table-skeleton';
import { GetCourse } from '../crud-pages/get-course/get-course';
import DeleteTeacher from '@/app/api/teacher-api/delete-teacher';

const Teacher = () => {
  const router = useRouter();
  const [user, setUser] = useState<teachersT[]>([]);
  const [courses, setCourse] = useState<coureseT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherData, courseData] = await Promise.all([
          GetTeacher(),
          GetCourse(),
        ]);
        setUser(teacherData);
        setCourse(courseData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <TableSkeleton />;
  }

  if (user.length === 0) {
    return (
      <p className="text-sm text-muted-foreground p-4">Foydalanuvchilar yo‘q</p>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await DeleteTeacher(id);
      if (res) {
        setUser((el) => el.filter((del) => del.id !== id));
        toast.success("Ustoz muvafaqqiyatli o'chirildi");
      }
    } catch (error) {
      toast.error('Xatoli yuz berdi');
    } finally {
      setDeletingId(null);
    }
  };

  const formatData = (dataString: string) => {
    const date = new Date(dataString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCourseName = (id?: string) => {
    const course = courses.find((el) => String(el.id) === id);
    return course ? course.name : 'Kurs Topilmadi';
  };

  return (
    <div className="w-full">
      <Link href={'/super-admin/crud-pages/add-teacher'}>
        <Button variant={'outline'} className="w-[120px] mb-[20px]">
          Ustoz Qo'shish
        </Button>
      </Link>
      <div className="block w-full  rounded-md border">
        <Table className="w-full min-w-[970px] border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Familya</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon Raqam</TableHead>
              <TableHead>Yaratilgan sana</TableHead>
              <TableHead>Dars beradigan kurs</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                <TableCell>{formatData(item.createdAt)}</TableCell>
                <TableCell>{getCourseName(item.courseId)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        router.push(
                          `/super-admin/crud-pages/edit-teacher/${item.id}`
                        )
                      }
                      className="w-[70px]"
                    >
                      Tahrirlash
                    </Button>
                    <Button
                      className="w-[70px]"
                      variant={'destructive'}
                      onClick={() => handleDelete(item.id)}
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
  );
};
export default Teacher;
