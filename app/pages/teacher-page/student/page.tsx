'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import UseGetCookie from '@/hooks/use-get-cookie';
import React, { useEffect, useState } from 'react';
import { coureseT, studentT } from '@/app/types/types';
import StudentModal from '@/app/components/student-modal';
import GetStudent from '@/app/api/student-api/get-student';
import TableSkeleton from '@/app/components/table-skeleton';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';

export default function Student() {
  const [user, setUser] = useState<studentT[]>([]);
  const [course, setCourse] = useState<coureseT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentData, courseData] = await Promise.all([
          GetStudent(),
          GetCourse(),
        ]);

        const teacherId = UseGetCookie('userId');

        const filtredStudent = studentData
          .filter((s: any) => String(s.teacherId) === String(teacherId))
          .map((s: any) => ({
            ...s,
            courseId: Number(s.courseId),
          }));

        setUser(filtredStudent);
        setCourse(courseData);
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

  const getCourseName = (id: number) => {
    const courses = course.find((el) => Number(el.id) === Number(id));
    return courses ? courses.name : 'Kurs topilmadi';
  };

  const getCoursePrice = (id: number) => {
    const found = course.find((c) => Number(c.id) === Number(id));
    return found ? `${Number(found.price).toLocaleString()} UZS` : 'Topilmadi';
  };

  const formatPrice = (price: string | number) => {
    const num = Number(price);
    if (isNaN(num)) return '0';
    return num.toLocaleString('uz-UZ').replace(/,/g, ' ');
  };

  return (
    <div>
      <h1 className="text-center font-medium text-[20px] text-gray-800">
        O'quvchilar
      </h1>

      <div className="w-full overflow-x-auto mt-5">
        <div className="border rounded-md">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[50px]">ID</TableHead>
                <TableHead className="text-center">Ism</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Telefon</TableHead>
                <TableHead className="text-center">Sana</TableHead>
                <TableHead className="text-center">O‘qiyotgan kurs</TableHead>
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
                      {/* <Button
                        onClick={() =>
                          router.push(
                            `/pages/teacher-page/crud-pages/edit-student/${item.id}`
                          )
                        }
                        className="w-[70px]"
                      >
                        Tahrirlash
                      </Button> */}
                      {/* <Button
                        onClick={() => handleDelete(item.id)}
                        className="w-[70px]"
                        variant={'destructive'}
                      >
                        {deletingId === item.id ? <Spinner /> : "O'chirish"}
                      </Button> */}
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
