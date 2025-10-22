import React from 'react';

const DeleteAdmin = async (id: string) => {
  try {
    const res = await fetch(
      `https://academix-server-1.onrender.com/admins/${id}`,
      {
        cache: 'no-store',
        method: 'DELETE',
      }
    );
    return res.ok;
  } catch (error) {}
  return;
};

export default DeleteAdmin;
