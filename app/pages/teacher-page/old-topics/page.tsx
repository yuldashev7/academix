'use client';
import {
  coureseT,
  groupT,
  homeworkT,
  teachersT,
  topicT,
} from '@/app/types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Pagination from '@/app/components/pagination';
import GetGroup from '@/app/api/group-api/get-group';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import GetOldHomeWork from '@/app/api/home-work-api/get-old-homework';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';

const itemsPerPage = 10;

const OldTopicsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [group, setGroup] = useState<groupT[]>([]);
  const [course, setCourse] = useState<coureseT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<teachersT[]>([]);
  const [oldHomeWorks, setOldHomeWorks] = useState<homeworkT[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentUserS = localStorage.getItem('currentUser');

        if (!currentUserS) {
          toast.error('Siz teacher sifatida tizimga kirmagansiz');
          router.push('/');
          return;
        }

        const currentUser = JSON.parse(currentUserS);

        const [courseData, groupData, teacherData] = await Promise.all([
          GetCourse(),
          GetGroup(),
          GetTeacher(),
        ]);

        setCourse(courseData);
        setGroup(groupData);

        const currentTeacher = teacherData.find(
          (t: teachersT) => t.id.toString() === currentUser.id.toString()
        );
        setTeacher(currentTeacher);

        if (currentUser.groupId) {
          const homeWorksData: homeworkT[] = await GetOldHomeWork(
            currentUser.groupId
          );
          const filtredHomeWork = homeWorksData.filter(
            (h) => h.teacherId.toString() === currentUser.id.toString()
          );
          setOldHomeWorks(filtredHomeWork);
        }
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = oldHomeWorks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <Button variant="outline" onClick={() => router.back()}>
        Ortga Qaytish
      </Button>

      {teacher.length > 0 && (
        <p className="p-4 rounded-md shadow text-center text-xl text-gray-800 mt-5">
          {course.find(
            (c) => c.id.toString() === teacher[0].courseId.toString()
          )?.name || 'Kurs Topilmadi'}
        </p>
      )}

      <div className="mt-5">
        <Table className="w-full border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">Id</TableHead>
              <TableHead className="w-[200px]">Vazifa</TableHead>
              <TableHead>Tavsif</TableHead>
              <TableHead className="w-[160px] text-center">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((h, index) => (
              <TableRow key={h.id} className="hover:bg-gray-50 transition">
                <TableCell className="text-center font-medium">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="font-semibold">{h.title}</TableCell>
                <TableCell className="text-gray-700">{h.description}</TableCell>
                <TableCell className="text-center text-gray-500">
                  {new Date(h.deadline).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          currentPage={page}
          totalItems={oldHomeWorks.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default OldTopicsPage;
