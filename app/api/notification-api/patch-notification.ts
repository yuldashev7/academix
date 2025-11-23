export default async function PatchNotification(id: number) {
  await fetch(`http://localhost:3600/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isRead: true }),
  });
}
