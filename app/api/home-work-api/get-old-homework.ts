import { toast } from 'sonner';
import { homeworkT } from '@/app/types/types';

const GetOldHomeWork = async (groupId: string | number) => {
  try {
    const res = await fetch(
      `http://localhost:3600/homeWorks?groupId=${groupId}`,
      {
        cache: 'no-store',
      }
    );
    const data = await res.json();
    const oldhomeWork = data.filter(
      (h: homeworkT) => new Date(h.createdAt) < new Date()
    );
    return oldhomeWork;
  } catch (error) {
    toast.error('Vazifa olishda xatolik');
  }
};

export default GetOldHomeWork;
