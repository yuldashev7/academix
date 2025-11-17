'use client';
import GetTopics from '@/app/api/home-work-api/get-topics';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ToppicsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [topicTitle, setTopicTitle] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const topics = await GetTopics();
        const topic = await topics.find((t: any) => String(t.id) === id);

        if (topic) setTopicTitle(topic.title);
      } catch (error) {
        toast.error('Topic topilmadi');
      }
    };
    fetchTopic();
  }, [id]);
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-5">
      <h2 className="text-xl font-bold">Mavzu: {topicTitle}</h2>
      <div className="text-right">
        <Button
          onClick={() =>
            router.push(`/pages/teacher-page/topics/${id}/home-work/${id}`)
          }
        >
          Uy ish qo‘shish
        </Button>
      </div>
    </div>
  );
};
export default ToppicsPage;
