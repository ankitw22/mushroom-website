import { headers } from 'next/headers';
import HomeClient from './HomeClient';

export const runtime = 'edge';

const USER_ID_COOKIE = 'userId';

function createUserId() {
  return Math.floor(Math.random() * 1_000_000_000) + 1;
}

function parseCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split(';').find((c) => c.trim().startsWith(`${name}=`));
  return match?.split('=')[1]?.trim();
}

export default async function Home() {
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie');
  const cookieUserId = Number(parseCookie(cookieHeader, USER_ID_COOKIE));
  const hasUserId = Number.isInteger(cookieUserId) && cookieUserId > 0;
  const userId = hasUserId ? cookieUserId : createUserId();

  return <HomeClient userId={userId} shouldSetCookie={!hasUserId} />;
}
