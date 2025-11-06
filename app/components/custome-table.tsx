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
import TableSkeleton from './table-skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeleteAdmin from '../api/admin-api/delete-admin';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const CustomeTable = () => {
  const [user, setUser] = useState<usersT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

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

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await DeleteAdmin(id);
      if (res) {
        setUser((el) => el.filter((del) => del.id !== id));
        toast.success("Admin muvafaqqiyatli o'chirildi");
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      <Link href={'/super-admin/crud-pages/add-admin'}>
        <Button variant={'outline'} className="w-[120px] mb-[20px]">
          Admin Qo'shish
        </Button>
      </Link>
      <div className="block w-full  rounded-md border">
        <Table className="w-full min-w-[970px] border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-[20px]">Id</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon Raqam</TableHead>
              <TableHead>Yaratilgan sana</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="w-[80px] pl-[20px]">
                  {index + 1}
                </TableCell>
                <TableCell className="w-[80px]">{item.name}</TableCell>
                <TableCell className="w-[80px]">{item.email}</TableCell>
                <TableCell className="w-[80px]">{item.phoneNumber}</TableCell>
                <TableCell className="w-[80px]">
                  {formatData(item.createdAt)}
                </TableCell>
                <TableCell className="w-[80px]">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        router.push(
                          `/super-admin/crud-pages/edit-admin/${item.id}`
                        )
                      }
                      className="w-[70px]"
                    >
                      Tahrirlash
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      className="w-[70px]"
                      variant={'destructive'}
                    >
                      {deletingId === item.id ? <Spinner /> : "O'chirish"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default CustomeTable;
