import { toast } from 'sonner';

const GetNotification = async (studentId: number) => {
  try {
    const res = await fetch(
      `http://localhost:3600/notifications?studentId=${studentId}`,
      {
        cache: 'no-store',
      }
    );
    if (!res.ok) {
      throw new Error('Fetch failed');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    toast.error('Notificationlarni olishda xatolik');
    return [];
  }
};

export default GetNotification;
