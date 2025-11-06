import { postStudentT } from '@/app/types/types';
import { toast } from 'sonner';

const PostStudent = async (data: postStudentT) => {
  try {
    const checkRes = await fetch('http://localhost:3600/users');
    const students = await checkRes.json();

    const existing = students.find(
      (student: postStudentT) =>
        student.email.toLocaleLowerCase() === data.email.toLocaleLowerCase()
    );

    if (existing) {
      toast.error('Bu email bilan foydalanuvchi allaqachon mavjud!');
      throw new Error('Dublicate email');
    }

    const newData = {
      ...data,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    const res = await fetch('http://localhost:3600/users', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Xatolik yuz berdi');
    }
  } catch (error) {
    if (error instanceof Error && error.message !== 'Dublicate email') {
      toast.error("Ustoz qo'shishda xatolik");
    }
    throw error;
  }
};

export default PostStudent;
