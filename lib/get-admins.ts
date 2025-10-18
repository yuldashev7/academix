import { toast } from 'sonner';

export const getAdmins = async () => {
  try {
    const res = await fetch('https://academix-server-1.onrender.com/admins', {
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
