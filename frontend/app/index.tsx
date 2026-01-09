import { Redirect } from 'expo-router';

import { useAuth } from '@/context/auth';

export default function Index() {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Redirect href={'/(auth)/login' as any} />;
  }

  if (isAdmin) {
    return <Redirect href={'/(admin)' as any} />;
  }

  return <Redirect href={'/(app)' as any} />;
}
