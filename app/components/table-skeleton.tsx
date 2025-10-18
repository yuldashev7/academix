import { Skeleton } from '@/components/ui/skeleton';

const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/30">
        <Skeleton className="h-4 w-200" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-5 gap-4 p-4 border-b items-center"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
};
export default TableSkeleton;
