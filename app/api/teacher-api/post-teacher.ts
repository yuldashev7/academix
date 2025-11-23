import { toast } from 'sonner';
import { postTeacherT } from '@/app/types/types';

const PostTeacher = async (data: postTeacherT) => {
  try {
    const checkRes = await fetch('http://localhost:3600/users');
    const teachers = await checkRes.json();

    const existing = teachers.find(
      (teacher: postTeacherT) =>
        teacher.email.toLocaleLowerCase() === data.email.toLocaleLowerCase()
    );
    if (existing) {
      toast.error('Bu email bilan foydalanuvchi allaqachon mavjud!');
      throw new Error('Dublicate email');
    }
    const newData = {
      ...data,
      role: 'teacher',
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
      throw new Error(result.error || 'Xatolik yuz berdi');
    }
  } catch (error) {
    if (error instanceof Error && error.message !== 'Dublicate email') {
      toast.error("Ustoz qo'shishda xatolik");
    }
    throw error;
  }
};

export default PostTeacher;
