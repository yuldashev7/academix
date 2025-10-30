import React from 'react';

const EditStudent = async (
  id: string,
  editable: {
    name: string;
    email: string;
    phoneNumber: string;
    courseId: string;
    paidAmount: string;
  }
) => {
  try {
    const res = await fetch(
      `https://academix-server-1.onrender.com/teachers/${id}`,
      {
        cache: 'no-store',
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(editable),
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {}
  return;
};

export default EditStudent;
