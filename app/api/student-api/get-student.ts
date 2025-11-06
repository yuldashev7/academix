import { toast } from 'sonner';

const GetStudent = async () => {
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

    return students;
  } catch (error) {
    toast.error('Server bilan aloqa yo‘q');
    throw error;
  }
};

export default GetStudent;
