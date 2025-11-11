import { toast } from 'sonner';

const GetStudent = async (teacherId?: string) => {
  try {
    const res = await fetch('http://localhost:3600/users', {
      cache: 'no-store',
    });
    if (!res.ok) {
      toast.error("Foydalanuvchilarni yuklab bo'lmadi");
      throw new Error('Fetch error');
    }
    const data = await res.json();

    const students = data.filter((user: any) => user.role === 'student');

    if (teacherId) {
      return students.filter((t: any) => String(t.teacherId) === teacherId);
    }

    return students;
  } catch (error) {
    toast.error('Server bilan aloqa yo‘q');
    throw error;
  }
};

export default GetStudent;
