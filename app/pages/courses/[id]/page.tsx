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
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import GetGroup from '@/app/api/group-api/get-group';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import { FormatNumber } from '@/hooks/use-number-formetter';
import { coureseT, groupT, teachersT } from '@/app/types/types';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';
import { ArrowBigLeft, BackpackIcon, ChevronLeft } from 'lucide-react';

const AllPage = () => {
  const params = useParams();
  const courseId = params.id;
  const [groups, setGroups] = useState<groupT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [teachers, setTeacher] = useState<teachersT[]>([]);
  const [course, setCourse] = useState<coureseT | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [courseData, groupData, teachersData] = await Promise.all([
          GetCourse(),
          GetGroup(),
          GetTeacher(),
        ]);

        setCourse(courseData), setGroups(groupData), setTeacher(teachersData);
        const selected = courseData.find(
          (item: coureseT) => item.id.toString() === courseId
        );
        if (!selected) {
          throw new Error('Kurs topilmadi');
        }
        setCourse(selected);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <p className="flex justify-center items-center h-[200px] text-gray-500">
        Yuklanmoqda...
      </p>
    );
  }

  if (!course) {
    return (
      <p className="flex justify-center items-center h-[200px] text-gray-500">
        Kurs Topilmadi
      </p>
    );
  }

  return (
    <>
      <div className="w-full max-w-[600px] mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col gap-[5px]">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Kurs Haqida
            </h1>
            <p className="text-gray-700">
              <span className="font-medium">Nomi:</span> {course?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Davomiyligi:</span>{' '}
              {course?.duration}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Kategoriya:</span>{' '}
              {course?.category}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Oyiga:</span>{' '}
              {FormatNumber(course?.price ?? 0)} so'm
            </p>
            <p className="text-gray-700">
              <span className="font-medium">To'liq Kurs Narxi:</span>{' '}
              {FormatNumber(course?.fullPrice ?? 0)} so'm
            </p>
          </div>
          <Link
            href={`/pages/courses/add-courses/${courseId}`}
            className="text-gray-700 font-medium"
          >
            Guruh Qo'shish
          </Link>
        </div>
        <Link
          href={'/admin/all-courses'}
          className="text-gray-700 font-medium flex items-center justify-center gap-[2px]"
        >
          <ChevronLeft className="mt-[2px]" />
          Ortga Qaytish
        </Link>
      </div>
      <div>
        <h1 className="text-center mt-[20px] font-medium text-[18px] text-gray-700">
          Barcha Guruhlar
        </h1>
        <div className="px-[20px]">
          <div className="block w-full  rounded-md border mt-[20px]">
            <Table className="w-full min-w-[970px] border rounded-md">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-[20px]">No</TableHead>
                  <TableHead>Guruh Nomi</TableHead>
                  <TableHead>Ustozi</TableHead>
                  <TableHead>O'quvchilar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.filter((g) => g.courseId.toString() === courseId)
                  .length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-gray-500 font-medium"
                    >
                      Bu kursda guruh mavjud emas!
                    </TableCell>
                  </TableRow>
                ) : (
                  groups
                    .filter((g) => g.courseId.toString() === courseId)
                    .map((el, index) => (
                      <TableRow key={el.id}>
                        <TableCell className="w-[80px] pl-[20px]">
                          {index + 1}
                        </TableCell>
                        <TableCell className="w-[80px]">{el.name}</TableCell>
                        <TableCell className="w-[80px]">
                          {teachers.find((t) => Number(t.id) === el.teacherId)
                            ?.name || 'Ustoz topilmadi'}
                        </TableCell>
                        <TableCell className="w-[80px]">
                          <Link
                            href={`/pages/view-students/${courseId}`}
                            className="underline"
                          >
                            O'quvchilarni ko'rish
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
export default AllPage;
