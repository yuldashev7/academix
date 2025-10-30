import React from 'react';
import { toast } from 'sonner';

const GetTeacher = async () => {
  try {
    const res = await fetch('https://academix-server-1.onrender.com/teachers', {
      cache: 'no-store',
    });

    if (!res.ok) {
      toast.error("Foydalanuvchilarni yuklab bo'lmadi");
      throw new Error('Fetch error');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    toast.error('Server bilan aloqa yo‘q');
    throw error;
  }
};

export default GetTeacher;
