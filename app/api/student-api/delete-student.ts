const DeleteStudent = async (id: string) => {
  try {
    const res = await fetch(
      `https://academix-server-1.onrender.com/students/${id}`,
      {
        cache: 'no-store',
        method: 'DELETE',
      }
    );
    return res.ok;
  } catch (error) {}
};

export default DeleteStudent;
