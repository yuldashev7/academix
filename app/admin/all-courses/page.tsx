'use client';
import CourseSkeleton from '@/app/components/config/loadings/course-skeleton';
import { GetCourse } from '@/app/super-admin/crud-pages/get-course/get-course';
import { coureseT } from '@/app/types/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AllCourses = () => {
  const [courses, setCourses] = useState<coureseT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchCourse = async () => {
      try {
        const data = await GetCourse();
        setCourses(data);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  if (loading) {
    <CourseSkeleton count={5} />;
  }

  return (
    <>
      <h1 className="mb-[20px] text-center font-medium text-[20px] text-gray-800">
        Barcha Kurslar
      </h1>
      <div className="w-full max-w-[1030px] mx-auto shadow rounded-[10px] bg-white flex flex-col gap-[10px] overflow-hidden">
        {courses.map((item) => (
          <Link
            key={item.id}
            href={`/pages/courses/${item.id}`}
            className="border-b last:border-b-0 hover:bg-blue-50 transition-colors duration-200"
          >
            <div className="flex justify-between items-center px-[20px] py-[15px] cursor-pointer">
              <div className="text-[15px] font-medium text-gray-800">
                {item.name}
              </div>
              <div className="text-sm text-gray-500">{item.category}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AllCourses;
