import { toast } from 'sonner';

const GetHomeWorkNotf = async (groupId: string) => {
  try {
    const res = await fetch(
      `http://localhost:3600/homeWorkNotifications?groupId=${Number(groupId)}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error('Fetch failed');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    toast.error('Uy ishini olishda xatolik');
    return [];
  }
};

export default GetHomeWorkNotf;
