import { router } from 'expo-router';

import { ActivityForm } from '@/components/ActivityForm';
import { useMutate } from '@/hooks/useMutate';
import { insertActivity } from '@/repositories/activities';

export default function NewActivity() {
  const mutate = useMutate();

  return (
    <ActivityForm
      submitLabel="Create activity"
      onSubmit={async (values) => {
        let id: string | undefined;
        await mutate(async (db) => {
          id = (await insertActivity(db, values)).id;
        });
        if (id) router.replace({ pathname: '/activity/[id]', params: { id } });
      }}
    />
  );
}
