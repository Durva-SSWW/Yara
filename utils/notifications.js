import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior for persistent notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    console.log('🔔 Step 1: Requesting notification permissions...');
    
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('🔔 Permission status:', status);
    
    if (status !== 'granted') {
      alert('Failed to get notification permissions!');
      return false;
    }

    if (Platform.OS === 'android') {
      console.log('🔔 Step 2: Configuring Android channel...');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        showBadge: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    console.log('✅ Notification permissions granted');
    return true;
  } catch (error) {
    console.log('❌ Error setting up notifications:', error);
    return false;
  }
}

export async function scheduleNotification(title, body, minutesFromNow, repeats = false) {
  try {
    const seconds = minutesFromNow * 60;
    console.log(`🔔 Scheduling notification for ${minutesFromNow} minutes from now...`);
    
    const exactSeconds = Math.round(seconds);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { 
          screen: 'chat',
          type: 'reminder'
        },
        sound: true,
        priority: 'high',
        autoDismiss: false, // CHANGED: Not auto-dismissed
        sticky: false, // CHANGED: Not sticky, but persistent
      },
      trigger: {
        seconds: exactSeconds,
        repeats: repeats,
      },
    });
    
    console.log(`✅ Notification scheduled: "${title}" in ${minutesFromNow} minutes`);
    return true;
  } catch (error) {
    console.error('❌ Error scheduling notification:', error);
    return false;
  }
}

export async function scheduleTestNotification() {
  console.log('🔔 Scheduling test notification...');
  
  return await scheduleNotification(
    "Hi Buddy, Yara is missing you!",
    "Come back and chat with me! 💜",
    0.16, // 10 seconds
    false
  );
}

export async function cancelAllScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('🔔 Cancelling scheduled notifications. Current count:', scheduled.length);
  
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('✅ All scheduled notifications cancelled');
}

export function setNotificationHandler(navigation) {
  console.log('🔔 Setting up notification handler...');
  
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('🎉 NOTIFICATION RECEIVED AND WILL PERSIST:', notification.request.content.title);
    // Notification will stay in notification bar until user clears it
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 NOTIFICATION TAPPED:', response.notification.request.content.title);
    
    // CHANGED: Don't auto-dismiss when tapped - let user manually clear
    // The notification will stay in the bar until user swipes it away
    
    if (navigation) {
      navigation.navigate('chat');
    }
  });

  return {
    remove: () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    }
  };
}

export async function getScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('📅 Scheduled notifications:', scheduled.length);
  return scheduled;
}

// NEW: Schedule a proper reminder notification that persists
export async function scheduleReminderNotification() {
  console.log('🔔 Scheduling persistent reminder notification...');
  
  return await scheduleNotification(
    "Hi Buddy, Yara is missing you!",
    "It's been a while! Come chat with me 💜",
    0.16, // 10 seconds for testing
    false
  );
}