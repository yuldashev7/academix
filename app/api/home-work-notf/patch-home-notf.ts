const PatchHomeNotf = async (id: number) => {
  try {
    const res = await fetch(
      `http://localhost:3600/homeWorkNotifications/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      }
    );

    if (!res.ok) throw new Error('PATCH FAILED');
    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};
export default PatchHomeNotf;
