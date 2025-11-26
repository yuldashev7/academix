'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { CameraIcon } from 'lucide-react';
import GetStudent from '@/app/api/student-api/get-student';
import { contractsT, studentT } from '@/app/types/types';
import { EditModal } from './components/edit-modal';
import { PhotoModal } from './components/photo-modal';
import GetContracts from '@/app/api/contracts-api/get-contracts';
import { PasswordModal } from './components/password-modal';
import PencilIcon from '@/public/icons/pencil-icon';

export default function StudentProfile() {
  const [user, setUser] = useState<studentT | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openPhoto, setOpenPhoto] = useState<boolean>(false);
  const [contract, setContract] = useState<contractsT[]>([]);
  const [openPassword, setOpenPassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetStudent();
        const cookies = typeof document !== 'undefined' ? document.cookie : '';
        const userIdCookie = cookies
          .split(';')
          .map((c) => c.trim())
          .find((c) => c.startsWith('userId='));

        if (!userIdCookie) {
          toast.error('Foydalanuvchi topilmadi');
          setUser(null);
          return;
        }

        const userId = Number(userIdCookie.split('=')[1]);
        if (Number.isNaN(userId)) {
          toast.error("userId noto'g'i formatda");
          setUser(null);
          return;
        }

        const currentUser = Array.isArray(data)
          ? (data as any[]).find((u) => Number(u?.id) === userId) ?? null
          : null;

        if (!currentUser) {
          toast.error("Foydalanuvchi ma'lumotlari topilmadi");
        }

        setUser(currentUser);
      } catch (err) {
        console.error(err);
        toast.error('Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    if (typeof window === 'undefined') return;
    fetchData();

    const fetchContract = async () => {
      try {
        const data = await GetContracts();
        setContract(data);
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    };
    fetchContract();
  }, []);

  return (
    <div className="bg-[#EEF2F6] px-5 py-5 rounded-[5px]">
      <div className="bg-white rounded-[10px] py-4 px-6">
        <div className="flex justify-between">
          <h1 className="text-[22px] font-medium text-gray-800">
            Shaxsiy ma'lumotlar
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="transition-all duration-200 hover:text-gray-600 w-[20px]"
          >
            <PencilIcon />
          </button>
        </div>

        {loading ? (
          <p className="mt-6">Yuklanmoqda...</p>
        ) : user ? (
          <div className="flex justify-between md:flex-row mt-10 gap-[55px]">
            <div className="flex items-start gap-10">
              <div className="text-center">
                <div className="border rounded-md p-2 w-[170px] text-center">
                  <Image
                    className="mx-auto rounded"
                    width={150}
                    height={150}
                    src={'/imgs/profile.jpeg'}
                    alt={'img'}
                    priority={false}
                  />
                  <p className="text-[14px] py-1 text-gray-900">Namuna</p>
                </div>
                <p className="text-[12px] w-[160px] mt-2 text-gray-900">
                  500x500 o`lcham, JPEG, JPG, PNG format, maksimum 2MB
                </p>
              </div>

              <div className="relative">
                <Image
                  width={160}
                  height={160}
                  src={'/imgs/user-photo.jpg'}
                  alt="Foydalanuvchi fotosi"
                  className="rounded"
                />

                <button
                  onClick={() => setOpenPhoto(true)}
                  aria-label="Rasmni yangilash"
                  className="absolute right-4 bottom-[15px] bg-[#1E2735] p-2 rounded-full cursor-pointer"
                >
                  <CameraIcon color="#fff" size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-12">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-[400] mb-1">Ism</p>
                  <p className="font-[600]">{user.name ?? '-'}</p>
                </div>
                <div>
                  <p className="font-[400] mb-1">Telefon Raqam</p>
                  <p className="font-[600]">{user.phoneNumber ?? '-'}</p>
                </div>
                <div>
                  <p className="font-[400] mb-1">Email</p>
                  <p className="font-[600]">{user.email ?? '-'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-[400] mb-1">Familya</p>
                  <p className="font-[600]">{user.lastName ?? '-'}</p>
                </div>
                <div>
                  <p className="font-[400] mb-1">Guruhga qo'shilgan sana</p>
                  <p className="font-[600]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6">Foydalanuvchi ma'lumotlari mavjud emas.</p>
        )}
      </div>
      <div className="flex gap-[50px] mt-[10px]">
        <div className="bg-[#fff] w-[250px] h-[130px] mt-[20px] p-[20px] rounded-[10px]">
          <p className="font-[600] mb-[10px]">Student Id</p>
          <p className="font-[400]">{user?.id}</p>
        </div>
        <div className="bg-[#fff] w-[250px] h-[130px] mt-[20px] p-[20px] rounded-[10px] relative">
          <button
            onClick={() => setOpenPassword(true)}
            className="absolute right-5 top-[22px] transition-all duration-200 hover:text-gray-600"
          >
            <PencilIcon className="w-[16px]" />
          </button>
          <p className="font-[600] mb-[10px] text-[16px]">Parol</p>
          <p className="font-[400]">● ● ● ● ● ● ● ● </p>
        </div>
      </div>
      <div className="bg-[#fff] mt-[20px] py-[20px] px-[20px] h-[300px] rounded-[10px] overflow-auto">
        <div>
          <p className="font-[600] mb-[10px] text-[18px] text-gray-800">
            Shartnomalarim
          </p>
        </div>

        {contract.map((c) => (
          <p key={c.id} className="whitespace-pre-line">
            {c.text}
          </p>
        ))}
      </div>
      <>
        <EditModal open={open} onClose={() => setOpen(false)} />
        <PhotoModal open={openPhoto} onClose={() => setOpenPhoto(false)} />
        <PasswordModal
          open={openPassword}
          onClose={() => setOpenPassword(false)}
        />
      </>
    </div>
  );
}
