import React from 'react';
import { postAdminT } from '../../types/types';
import { toast } from 'sonner';

const PostAdmin = async (data: postAdminT) => {
  try {
    const checkRes = await fetch(
      'https://academix-server-1.onrender.com/admins'
    );
    const admins = await checkRes.json();

    const existing = admins.find(
      (admin: postAdminT) =>
        admin.email.toLocaleLowerCase() === data.email.toLocaleLowerCase()
    );

    if (existing) {
      toast.error('Bu email bilan foydalanuvchi allaqachon mavjud!');
      throw new Error('Duplicate email');
    }

    const newData = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch('https://academix-server-1.onrender.com/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Xatolik yuz berdi');
    }
    return result;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Duplicate email') {
      toast.error("Admin qo'shishda xatolik");
    }
    throw error;
  }
};

export default PostAdmin;
