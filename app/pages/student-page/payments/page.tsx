'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { coureseT, studentT } from '@/app/types/types';
import GetStudent from '@/app/api/student-api/get-student';
import { FormatNumber } from '@/hooks/use-number-formetter';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';
import PaymentsSkeleton from '@/app/components/config/loadings/payments-skeleton';
import MobilePayments from './components/mobile-payment';

const Payments = () => {
  const [course, setCourse] = useState<coureseT[]>([]);
  const [student, setStudent] = useState<studentT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [courseData, studentData] = await Promise.all([
          GetCourse(),
          GetStudent(),
        ]);

        const userId = Number(
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))
            ?.split('=')[1]
        );

        const filtredStudent = studentData.filter((s: any) => s.id === userId);

        setCourse(courseData), setStudent(filtredStudent);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center text-gray-900 text-[20px] font-medium">
        To'lovlarim
      </h1>

      {loading ? (
        <PaymentsSkeleton />
      ) : (
        <>
          <MobilePayments student={student} course={course} />
          <div className="hidden lg:block ">
            <Table className="w-full min-w-[970px] border rounded-md mt-[20px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-[20px]">#</TableHead>
                  <TableHead>Kurs nomi</TableHead>
                  <TableHead>To'langan</TableHead>
                  <TableHead>Har Oy</TableHead>
                  <TableHead>To'liq Narx</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.map((s, index) => {
                  const courseFullPrice = course.find(
                    (c) => Number(c.id) === Number(s.courseId)
                  );
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="w-[80px] pl-[20px]">
                        {index + 1}
                      </TableCell>
                      <TableCell className="w-[80px]">
                        {courseFullPrice?.name || 'Kurs topilmadi'}
                      </TableCell>
                      <TableCell className="w-[80px]">
                        {FormatNumber(s.paidAmount)} UZS
                      </TableCell>
                      <TableCell className="w-[80px]">
                        {FormatNumber(courseFullPrice?.price ?? 0)} UZS
                      </TableCell>
                      <TableCell className="w-[80px]">
                        {FormatNumber(courseFullPrice?.fullPrice ?? 0)} UZS
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
export default Payments;
