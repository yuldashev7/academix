'use client';
import GetGroup from '@/app/api/group-api/get-group';
import GetStudent from '@/app/api/student-api/get-student';
import StudentModal from '@/app/components/student-modal';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';
import { coureseT, groupT, studentT, usersT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ViewStudents = () => {
  const [course, setCourse] = useState<coureseT | null>(null);
  const [user, setUser] = useState<studentT[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [group, setGroup] = useState<groupT[]>([]);

  console.log('user', user);
  console.log('group', group);

  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseData, studentData, groupData] = await Promise.all([
          GetCourse(),
          GetStudent(),
          GetGroup(),
        ]);

        const selected = courseData.find(
          (item: coureseT) => item.id.toString() === courseId
        );
        if (!selected) {
          toast.error('Kurs topilmadi');
          return;
        }
        setUser(studentData), setGroup(groupData), setCourse(selected);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const courseGroups = group.filter((g) => g.courseId.toString() === courseId);

  const filtredStudents = user.filter((u) =>
    courseGroups.some((g) => g.id.toString() === u.groupId.toString())
  );

  const formatPrice = (price: string | number) => {
    const num = Number(price);
    if (isNaN(num)) return '0';
    return num.toLocaleString('uz-UZ').replace(/,/g, ' ');
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-[20px] px-[20px]">
        <Button variant="outline" onClick={() => router.back()}>
          Ortga Qaytish
        </Button>
        <h1 className="text-center font-medium text-[18px] text-gray-700 flex-1">
          {course?.name || 'Kurs topilmadi'}
        </h1>
      </div>
      <div className="px-[20px]">
        <div className="block w-full  rounded-md border mt-[20px]">
          <Table className="w-full min-w-[970px] border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-[20px]">No</TableHead>
                <TableHead>Ismi</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon Raqam</TableHead>
                <TableHead>To‘lagan</TableHead>
                <TableHead>Umumiy narx</TableHead>
                <TableHead>Guruhi</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-4 text-gray-500"
                  >
                    Bu kursda o‘quvchilar mavjud emas
                  </TableCell>
                </TableRow>
              ) : (
                filtredStudents.map((s, index) => {
                  const studendGroup =
                    courseGroups.find(
                      (g) => g.id.toString() === s.groupId.toString()
                    )?.name || '-';
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.phoneNumber}</TableCell>
                      <TableCell>{formatPrice(s.paidAmount)}</TableCell>
                      <TableCell>
                        {course?.price
                          ? `${Number(course.price).toLocaleString()} UZS`
                          : '-'}
                      </TableCell>
                      <TableCell>{studendGroup}</TableCell>
                      <TableCell>
                        <Button
                          variant={'outline'}
                          onClick={() => setOpenModal(true)}
                        >
                          Ko'rish
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <StudentModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};
export default ViewStudents;
