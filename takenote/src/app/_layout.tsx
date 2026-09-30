import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DbProvider } from '@/db/DbProvider';
import { useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  const t = useTheme();

  return (
    <>
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: t.background }}>
            <ActivityIndicator color={t.accent} />
          </View>
        }
      >
        <DbProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: t.background },
              headerTintColor: t.accent,
              headerTitleStyle: { color: t.text },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: t.background },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'TakeNote' }} />
            <Stack.Screen name="activity/new" options={{ title: 'New activity' }} />
            <Stack.Screen name="activity/[id]/index" options={{ title: '' }} />
            <Stack.Screen name="activity/[id]/edit" options={{ title: 'Edit activity' }} />
            <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
            <Stack.Screen name="capture" options={{ title: 'Quick capture', presentation: 'modal' }} />
          </Stack>
        </DbProvider>
      </Suspense>
      <StatusBar style="auto" />
    </>
  );
}
