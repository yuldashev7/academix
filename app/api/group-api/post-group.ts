import { groupT, postGroupT } from '@/app/types/types';
import React from 'react';
import { toast } from 'sonner';

const PostGroup = async (data: postGroupT) => {
  try {
    const checkedGroups = await fetch('http://localhost:3600/groups');
    const groups = await checkedGroups.json();

    const existing = groups.find(
      (group: groupT) => group.name.toLowerCase() === data.name.toLowerCase()
    );

    if (existing) {
      toast.error('Bunday guruh allaqachon mavjud!');
      throw new Error('Dublicate group');
    }

    const newData = { ...data };
    const res = await fetch('http://localhost:3600/groups', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newData),
    });
  } catch (error) {
    toast.error('Group tahrirlashda xatolik');
  }
  return;
};

export default PostGroup;
