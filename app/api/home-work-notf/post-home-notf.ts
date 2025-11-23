import { toast } from 'sonner';
import { postHomeNotfT } from '@/app/types/types';

const PostHomeNotf = async ({
  groupId,
  title,
  message,
  deadline,
}: postHomeNotfT) => {
  try {
    console.log('POST Home Notification:', {
      groupId,
      title,
      message,
      deadline,
    });
    const res = await fetch('http://localhost:3600/homeWorkNotifications', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        groupId: Number(groupId),
        title: title,
        message: message,
        deadline: deadline,
        isRead: false,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error('POST FAILED');
    }

    const json = await res.json();
    console.log('JSON-SERVER RESPONSE:', json);
    return json;
  } catch (error) {
    toast.error('Uy ishi berishda xatolik');
    return null;
  }
};

export default PostHomeNotf;
