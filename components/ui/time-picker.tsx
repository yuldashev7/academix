'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()].filter((m) => m % 5 === 0);

  const [hour = '00', minute = '00'] = value.split(':');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-32 justify-between font-normal">
          {value || 'Select time'}
          <Clock className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-52 p-3 grid grid-cols-2 gap-3">
        {/* HOUR */}
        <div>
          <p className="text-sm mb-1 font-medium">Hour</p>
          <ScrollArea className="h-40 border rounded-md">
            {hours.map((h) => (
              <div
                key={h}
                className={`p-2 cursor-pointer text-sm text-center hover:bg-accent rounded ${
                  Number(hour) === h ? 'bg-accent font-bold' : ''
                }`}
                onClick={() =>
                  onChange(`${String(h).padStart(2, '0')}:${minute}`)
                }
              >
                {String(h).padStart(2, '0')}
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* MINUTE */}
        <div>
          <p className="text-sm mb-1 font-medium">Minute</p>
          <ScrollArea className="h-40 border rounded-md">
            {minutes.map((m) => (
              <div
                key={m}
                className={`p-2 cursor-pointer text-sm text-center hover:bg-accent rounded ${
                  Number(minute) === m ? 'bg-accent font-bold' : ''
                }`}
                onClick={() =>
                  onChange(`${hour}:${String(m).padStart(2, '0')}`)
                }
              >
                {String(m).padStart(2, '0')}
              </div>
            ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
