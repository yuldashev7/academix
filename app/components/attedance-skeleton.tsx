'use client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AttendanceSkeleton = () => {
  const rows = Array.from({ length: 5 });

  return (
    <div className="animate-pulse">
      <div className="p-4 rounded-md shadow text-center mb-6">
        <Skeleton className="h-6 w-1/3 mx-auto" />
      </div>

      <Table className="w-full border rounded-md">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[80px] text-left px-4">Id</TableHead>
            <TableHead className="w-[300px] text-left px-4">Ism</TableHead>
            <TableHead className="text-right px-4 pr-[40px]">
              Yo'qlama
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2">
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell className="px-4 py-2">
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell className="px-4 py-2 pr-[50px] text-right">
                <Skeleton className="h-5 w-12 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-6">
        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceSkeleton;
