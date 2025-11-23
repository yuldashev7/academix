import { toast } from 'sonner';

const GetTopics = async () => {
  try {
    const res = await fetch('http://localhost:3600/topics', {
      cache: 'no-store',
    });

    if (!res.ok) {
      toast.error("Vazifalarni yuklab bo'lmadi");
      throw new Error('Topics error');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    toast.error('Vazifalarni yuklashda xatolik');
    console.log('topics', error);
    throw error;
  }
};

export default GetTopics;
