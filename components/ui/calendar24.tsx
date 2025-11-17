'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

export function Calendar24({
  date,
  onDateChange,
}: {
  date: Date | undefined;
  onDateChange: (d: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => {
                onDateChange(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
