'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usersT } from '../types/types';
import { getAdmins } from '@/lib/get-admins';
import { Skeleton } from '@/components/ui/skeleton';
import TableSkeleton from './table-skeleton';

const CustomeTable = () => {
  const [user, setUser] = useState<usersT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdmins();
        setUser(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <TableSkeleton />;
  }

  if (user.length === 0) {
    return (
      <p className="text-sm text-muted-foreground p-4">Foydalanuvchilar yo‘q</p>
    );
  }

  const formatData = (dataString: string) => {
    const date = new Date(dataString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="block w-full  rounded-md border">
        <Table className="w-full min-w-[970px] border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Rasm</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon Raqam</TableHead>
              <TableHead>Yaratilgan sana</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.img ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={item.img}
                      alt="img"
                    />
                  ) : (
                    <p className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-gray-500">
                      N/A
                    </p>
                  )}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                <TableCell>{formatData(item.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default CustomeTable;
