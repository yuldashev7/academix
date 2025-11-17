import React from 'react';
import { toast } from 'sonner';

const PostHomework = async (
  teacherId: string,
  groupId: string,
  selectedTopicId: string,
  newHomeworkTitle: string,
  newHomeworkDeadline: string
) => {
  try {
    const res = await fetch('http://localhost:3600/homeWorks', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        teacherId,
        groupId,
        topicId: selectedTopicId,
        title: newHomeworkTitle,
        deadline: newHomeworkDeadline,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      toast.error("Uy ishi qo'shib bo'lmadi");
    }
    const data = res.json();
  } catch (error) {
    toast.error("Uy ishi qo'shishda xatolik");
    return null;
  }
};

export default PostHomework;
