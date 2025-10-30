const DeleteTeacher = async (id: string) => {
  try {
    const res = await fetch(
      `https://academix-server-1.onrender.com/teachers/${id}`,
      {
        cache: 'no-store',
        method: 'DELETE',
      }
    );
    return res.ok;
  } catch (error) {}
};

export default DeleteTeacher;
