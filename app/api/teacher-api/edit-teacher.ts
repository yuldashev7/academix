const EditTeacher = async (
  id: string,
  editable: {
    name: string;
    email: string;
    phoneNumber: string;
    courseId: string;
  }
) => {
  try {
    const res = await fetch(`http://localhost:3600/users/${id}`, {
      cache: 'no-store',
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ ...editable, role: 'teacher' }),
    });
    const data = await res.json();
    return data;
  } catch (error) {}
  return;
};

export default EditTeacher;
