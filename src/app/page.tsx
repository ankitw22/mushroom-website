import { cookies } from 'next/headers';
import HomeClient from './HomeClient';

const USER_ID_COOKIE = 'userId';

function createUserId() {
  return Math.floor(Math.random() * 1_000_000_000) + 1;
}

export default async function Home() {
  const cookieStore = await cookies();
  const cookieUserId = Number(cookieStore.get(USER_ID_COOKIE)?.value);
  const hasUserId = Number.isInteger(cookieUserId) && cookieUserId > 0;
  const userId = hasUserId ? cookieUserId : createUserId();

  return <HomeClient userId={userId} shouldSetCookie={!hasUserId} />;
}
