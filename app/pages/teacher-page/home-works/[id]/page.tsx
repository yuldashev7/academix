'use client';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { homeworkT } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useRouter } from 'next/navigation';
import { Calendar24 } from '@/components/ui/calendar24';
import { TimePicker } from '@/components/ui/time-picker';
import PostHomework from '@/app/api/home-work-api/post-homework';
import PostHomeNotf from '@/app/api/home-work-notf/post-home-notf';

const AddHomeworkPage = () => {
  const { id } = useParams();

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

  const [desc, setDesc] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleAddHomework = async () => {
    if (!topicId || !teacherId || !groupId)
      return toast.error("Topic yoki user ma'lumotlari mavjud emas");
    if (!title.trim()) return toast.error("Sarlavha bo'sh bo'lmasin");
    if (!date) return toast.error('Sanani tanlang');
    if (!time) return toast.error('Vaqtini tanlang');

    const formatedDate = date?.toISOString().split('T')[0];
    const finalDeadline = `${formatedDate}T${time}`;

    setLoading(true);

    try {
      const homework = await PostHomework(
        teacherId!,
        groupId!,
        topicId!,
        title,
        finalDeadline
      );
      console.log('Homework POST response:', homework);

      if (homework) {
        const notf = await PostHomeNotf({
          groupId: Number(groupId),
          title: 'Yangi Uy Ishi',
          message: `${title} mavzusi bo'yicha uy ishi berildi`,
          deadline: finalDeadline,
        });

        toast.success('Uy ish qo‘shildi');

        setTitle('');
        setDesc('');
        setTime('');
        setDate(undefined);
      }
    } catch (error) {
      console.error('Xatolik:', error);
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
