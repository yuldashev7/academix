'use server';

export const GetCourse = async () => {
  const res = await fetch('https://academix-server-1.onrender.com/courses');
  if (!res.ok) {
    throw new Error('Kurslarni olishda xatolik');
  }
  return res.json();
};
