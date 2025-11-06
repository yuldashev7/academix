'use server';

export const GetCourse = async () => {
  const res = await fetch('http://localhost:3600/courses');
  if (!res.ok) {
    throw new Error('Kurslarni olishda xatolik');
  }
  return res.json();
};
