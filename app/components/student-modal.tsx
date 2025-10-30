import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { progressT, StudentModalT } from '../types/types';
import GetStudent from '../api/student-api/get-student';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const randomprogress = () => {
  const lessons = ['Dars 1', 'Dars 2', 'Dars 3', 'Dars 4', 'Dars 5'];
  return lessons.map((item) => ({
    lesson: item,
    progress: Math.floor(Math.random() * 100),
  }));
};

const StudentModal = ({ open, onClose, student }: StudentModalT) => {
  const [user, setUser] = useState<progressT[]>([]);

  useEffect(() => {
    if (open) {
      setUser(randomprogress());
    }
  }, [open]);

  const fetchProgress = async () => {
    try {
      const res = await GetStudent();
      const data = await res.json();
      setUser(data);
    } catch (error) {
      toast.error('Progress Error');
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>Dars Progressi</DialogTitle>
            <DialogDescription>
              O‘quvchining darslarga oid o‘zlashtirish darajasi.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-[300px] p-4 bg-white rounded-xl shadow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lesson" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default StudentModal;
