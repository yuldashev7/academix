import React from 'react';
import { toast } from 'sonner';

const GetHomeWork = async () => {
  try {
    const res = await fetch('http://localhost:3600/homeWorks', {
      cache: 'no-store',
    });

    if (!res.ok) {
      toast.error("Uy ishilarni yuklab bo'lmadi");
      throw new Error('Home work error');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    toast.error('Uy ishilarni yuklashda xatolik yuz berdi');
    console.log('home work', error);
    throw error;
  }
};

export default GetHomeWork;
