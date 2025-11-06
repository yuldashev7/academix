const DeleteStudent = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3600/users/${id}`, {
      cache: 'no-store',
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {}
};

export default DeleteStudent;
