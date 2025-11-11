import { toast } from 'sonner';

const GetGroup = async () => {
  try {
    const res = await fetch('http://localhost:3600/groups', {
      cache: 'no-store',
    });
    if (!res.ok) {
      toast.error("Gruhlarni yuklab bo'lmadi");
      throw new Error('Fetch error');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    toast.error('Server bilan aloqa yo‘q');
    throw error;
  }
};

export default GetGroup;
