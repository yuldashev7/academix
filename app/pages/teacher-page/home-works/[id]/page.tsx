'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import PostHomework from '@/app/api/home-work-api/post-homework';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Calendar24 } from '@/components/ui/calendar24';
import { TimePicker } from '@/components/ui/time-picker';

const AddHomeworkPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setTeacherId(String(user.id));
      setGroupId(String(user.groupId));
    }
  }, []);

  const topicId = Array.isArray(id) ? id[0] : id;

  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');

  const handleAddHomework = async () => {
    if (!topicId || !teacherId || !groupId)
      return toast.error("Topic yoki user ma'lumotlari mavjud emas");
    if (!topicId) return toast.error('Topic ID mavjud emas');
    if (!title.trim()) return toast.error("Sarlavha bo'sh bo'lmasin");
    if (!date) return toast.error('Sanani tanlang');
    if (!time) return toast.error('Vaqtini tanlang');

    const formatedDate = date?.toISOString().split('T')[0];
    const finalDeadline = `${formatedDate}T${time}`;

    setLoading(true);
    toast.success('Uy ish berildi');
    setTitle('');
    setDeadline('');
    setDesc('');
    setTime(''), setDate(undefined);
    try {
      const homework = await PostHomework(
        teacherId!,
        groupId!,
        topicId!,
        title,
        finalDeadline
      );
      if (homework) {
        toast.success('Uy ish qo‘shildi');
        router.push(`/pages/teacher-pagete/topics/${id}`);
      }
    } catch {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-5">
      <h2 className="text-xl font-bold">Yangi Uy Ish Qo‘shish</h2>

      <div className="space-y-2">
        <Label>Sarlavha</Label>
        <input
          className="border w-full px-[10px] py-[5px] rounded-[10px]"
          placeholder="Uy ish sarlavhasi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Uy ish tafsiloti"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Deadline</Label>
        <div className="flex items-center gap-[20px] mt-[20px]">
          <Calendar24 date={date} onDateChange={setDate} />
          <TimePicker value={time} onChange={setTime} />
        </div>
      </div>

      <div className="text-right">
        <Button onClick={handleAddHomework}>
          {loading ? <Spinner /> : 'Qo‘shish'}
        </Button>
      </div>
    </div>
  );
};

export default AddHomeworkPage;
