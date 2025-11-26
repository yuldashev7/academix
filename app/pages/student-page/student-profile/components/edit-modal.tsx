import GetStudent from '@/app/api/student-api/get-student';
import { studentT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExclamationIcon from '@/public/icons/exclamation-icon';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function EditModal({ open, onClose }: any) {
  const [user, setUser] = useState<studentT | null>(null);

  useEffect(() => {
    if (!open) {
      setUser(null);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await GetStudent();

        const cookies = typeof document !== 'undefined' ? document.cookie : '';

        const userIdcookie = cookies
          .split(';')
          .find((row) => row.trim().startsWith('userId='));

        if (!userIdcookie) {
          toast.error('Foydalanuvchi topilmadi');
          setUser(null);
          return;
        }

        const userId = Number(userIdcookie.split('=')[1]);

        const currentUser = Array.isArray(data)
          ? data.find((u: any) => Number(u.id) === userId)
          : null;

        setUser(currentUser);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    };

    fetchData();
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Shaxsiy ma'lumotlar</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between">
            <div className="flex flex-col gap-[40px]">
              <ul>
                <li className="font-[400]">Ism</li>
                <li className="font-[600]">{user?.name}</li>
              </ul>
              <ul>
                <li className="font-[400]">Telefon Raqam</li>
                <li className="font-[600]">{user?.phoneNumber}</li>
              </ul>
            </div>
            <div className="flex flex-col justify-between">
              <ul>
                <li className="font-[400]">Familya</li>
                <li className="font-[600]">{user?.lastName}</li>
              </ul>
              <ul>
                <li className="font-[400]">Email</li>
                <li className="font-[600]">{user?.email}</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-[10px] bg-[#FFEEEA] px-[10px] py-[5px] rounded-[10px] mt-[20px]">
            <div>
              <ExclamationIcon />
            </div>
            <p className="text-[12px] text-[#662414]">
              Ism-familiya, email va telefon raqamni o’zgartirish uchun markaz
              administratsiyasiga murojaat qilishingiz mumkin.
            </p>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
