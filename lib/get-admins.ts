import { toast } from 'sonner';

export const getAdmins = async () => {
  try {
    const res = await fetch('http://localhost:3600/users', {
      cache: 'no-store',
    });

    if (!res.ok) {
      toast.error("Foydalanuvchilarni yuklab bo'lmadi");
      throw new Error('Fetch error');
    }

    const users = await res.json();
    const admins = users.filter((user: any) => user.role === 'admin');
    return admins;
  } catch (error) {
    toast.error('Server bilan aloqa yo‘q');
    throw error;
  }
};
