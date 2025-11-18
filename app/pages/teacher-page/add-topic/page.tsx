'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomeInput from '@/app/components/custome-input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PostTopic from '@/app/api/home-work-api/post-topic';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

const teacherId = '6';
const groupId = '1';

const AddTopicPage = () => {
  const router = useRouter();
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) return toast.error("Mavzu bo'sh bo'lmasin");

    setLoading(true);
    try {
      const topic = await PostTopic(teacherId, groupId, newTopicTitle);
      if (topic) {
        toast.success('Mavzu qo‘shildi');
        setNewTopicTitle('');
        router.push(`/pages/teacher-page/home-works/${topic.id}`);
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-5">
      <div className="flex items-center justify-between ">
        <h2 className="text-xl font-bold">Yangi Mavzu Qo‘shish</h2>
        <Link
          href={'/pages/teacher-page/old-topics'}
          className="text-xl font-bold underline hover:text-gray-700 transition"
        >
          Eski mavzularni ko'rish
        </Link>
      </div>
      <CustomeInput
        name=""
        label=""
        placeholder="Mavzu nomini kiriting"
        value={newTopicTitle}
        onChange={(e) => setNewTopicTitle(e.target.value)}
      />
      <div className="text-right">
        <Button onClick={handleAddTopic}>
          {loading ? <Spinner /> : 'Qo‘shish'}
        </Button>
      </div>
    </div>
  );
};

export default AddTopicPage;
