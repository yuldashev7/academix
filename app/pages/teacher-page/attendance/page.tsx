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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import UseGetCookie from '@/hooks/use-get-cookie';
import GetStudent from '@/app/api/student-api/get-student';
import GetTeacher from '@/app/api/teacher-api/get-teacher';
import { coureseT, studentT, teachersT } from '@/app/types/types';
import AttendanceSkeleton from '@/app/components/attedance-skeleton';
import PostNotification from '@/app/api/notification-api/post-notification';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';

const Attendance = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<coureseT[]>([]);
  const [student, setStudent] = useState<studentT[]>([]);
  const [teacher, setTeacher] = useState<teachersT | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let teacherId = null;
        if (typeof window !== 'undefined') {
          teacherId = UseGetCookie('teacherId');
        }

        const t = await GetTeacher();
        const c = await GetCourse();
        const s = await GetStudent();

        const filtredStudent = s.filter(
          (st: any) => String(st.teacherId) === String(teacherId)
        );

        setTeacher(
          t.find((t: teachersT) => String(t.id) === String(teacherId) || null)
        );
        setCourses(c);
        setStudent(filtredStudent);

        let savedAttendance = null;
        if (typeof window !== 'undefined') {
          savedAttendance = localStorage.getItem('attendance');
        }
        if (savedAttendance) {
          setAttendance(JSON.parse(savedAttendance));
        }
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSwitch = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('attendance', JSON.stringify(attendance));

      const presentStudents = student.filter((s) => attendance[s.id]);

      await Promise.all(presentStudents.map((s) => PostNotification(s.id)));

      toast.success('Davomat saqlandi!');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  return (
    <div>
      {teacher && (
        <p className="p-4 rounded-md shadow text-center text-xl text-gray-800">
          {courses.find((c) => c.id.toString() === teacher.courseId.toString())
            ?.name || 'Kurs topilmadi'}
        </p>
      )}

      <Table className="w-full border rounded-md mt-6">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left px-4">Id</TableHead>
            <TableHead className="text-left px-2">Ism</TableHead>
            <TableHead className="px-2">Familya</TableHead>
            <TableHead className="text-right px-4 pr-[40px]">
              Yo'qlama
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {student.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2">{index + 1}</TableCell>
              <TableCell className="px-2 py-2">{item.name}</TableCell>
              <TableCell className="px-2 py-2">{item.lastName}</TableCell>
              <TableCell className="px-4 py-2 pr-[50px] text-right">
                <Switch
                  checked={!!attendance[item.id]}
                  onCheckedChange={() => handleSwitch(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button className="w-[100px] mt-[20px]" onClick={handleSave}>
          {loading ? <Spinner /> : 'Saqlash'}
        </Button>
      </div>
    </div>
  );
};

export default Attendance;
