const EditAdmin = async (
  id: string,
  editable: { name?: string; email?: string; phoneNumber?: string }
) => {
  const res = await fetch(`http://localhost:3600/users/${id}`, {
    cache: 'no-store',
    method: 'PATCH',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(editable),
  });
  const data = await res.json();
  return data;
};

export default EditAdmin;
