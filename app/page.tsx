import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export default async function Home() {
  const allCookies: ReadonlyRequestCookies = await cookies();
  const token = allCookies.get('token')?.value;

  if (!token) {
    redirect('/auth');
  }

  return <div></div>;
}
