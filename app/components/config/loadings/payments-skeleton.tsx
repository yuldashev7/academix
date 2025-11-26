'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const PaymentsSkeleton = () => {
  return (
    <div>
      <h1 className="text-center text-gray-900 text-[20px] font-medium">
        <Skeleton className="h-6 w-[150px] mx-auto" />
      </h1>

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
          {[1, 2, 3, 4].map((i) => (
            <TableRow key={i}>
              <TableCell className="pl-[20px]">
                <Skeleton className="h-5 w-5" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-5 w-[150px]" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-5 w-[120px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsSkeleton;
