import { toast } from 'sonner';
const PostTopic = async (
  teacherId: string,
  groupId: string,
  newTopicTitle: string
) => {
  try {
    const res = await fetch('http://localhost:3600/topics', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        teacherId,
        groupId,
        title: newTopicTitle,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      toast.error("Topic Qo'shishda xatolik");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    toast.error('Xatolik yuz berdi');
    return null;
  }
};

export default PostTopic;
