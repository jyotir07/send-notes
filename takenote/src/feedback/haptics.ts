import * as Haptics from 'expo-haptics';

// Haptics are cosmetic: an unsupported device or disabled setting must never break a check-off.
const ignore = () => {};

export const tick = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore);
};

export const celebrate = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(ignore);
};
