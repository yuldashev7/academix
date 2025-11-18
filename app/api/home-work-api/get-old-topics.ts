import { topicT } from '@/app/types/types';
import { toast } from 'sonner';

const GetOldTopics = async (groupId: string | number) => {
  try {
    const res = await fetch(`http://localhost:3600/topics?groupId=${groupId}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    const oldTopics = data.filter(
      (t: topicT) => new Date(t.createdAt) < new Date()
    );
    return oldTopics;
  } catch (error) {
    toast.error('Vazifa olishda xatolik');
  }
};

export default GetOldTopics;
