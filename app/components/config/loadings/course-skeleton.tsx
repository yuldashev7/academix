'use client';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseSkeletonProps {
  count?: number;
}

const CourseSkeleton = ({ count = 5 }: CourseSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border-b last:border-b-0 px-[20px] py-[15px] flex flex-col gap-2"
        >
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </>
  );
};

export default CourseSkeleton;
