import { toast } from 'sonner';

const PostNotification = async (studentId: any) => {
  try {
    const res = await fetch('http://localhost:3600/notifications', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        studentId: studentId,
        title: 'Davomat Saqlandi',
        message: 'Siz bugungi darsga qatnashdingiz',
        isRead: false,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error('POST FAILED');
    }

    return await res.json();
  } catch (error) {
    toast.error("Xabar jo'natishda xatolik");
    return null;
  }
};

export default PostNotification;
