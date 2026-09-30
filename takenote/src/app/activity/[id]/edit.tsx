import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import { ActivityForm } from '@/components/ActivityForm';
import type { Db } from '@/db/db';
import { useMutate } from '@/hooks/useMutate';
import { useQuery } from '@/hooks/useQuery';
import { getActivity, updateActivity } from '@/repositories/activities';

export default function EditActivity() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: activity } = useQuery(useCallback((db: Db) => getActivity(db, id), [id]));
  const mutate = useMutate();

  if (!activity) return null;

  return (
    <ActivityForm
      initial={activity}
      submitLabel="Save changes"
      onSubmit={async (values) => {
        if (await mutate((db) => updateActivity(db, id, values))) router.back();
      }}
    />
  );
}
