import { Alert, Button, Text, View } from 'react-native';
import {
    cancelAllScheduledNotifications,
    getScheduledNotifications,
    scheduleNotification,
    scheduleReminderNotification
} from '../utils/notifications';

export default function NotificationTester() {
  const testPersistentNotification = async () => {
    try {
      await scheduleReminderNotification();
      Alert.alert(
        'Notification Scheduled', 
        'You will get a notification in 10 seconds that will STAY in your notification bar until you manually clear it by swiping.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const testMultipleNotifications = async () => {
    try {
      // Schedule multiple notifications to test persistence
      await scheduleNotification(
        "First Reminder",
        "This is your first reminder from Yara! 💜",
        0.16, // 10 seconds
        false
      );
      
      await scheduleNotification(
        "Second Reminder", 
        "Yara is waiting for you! 💜",
        0.33, // 20 seconds
        false
      );
      
      Alert.alert(
        'Multiple Notifications Scheduled',
        'Two notifications scheduled:\n• First in 10 seconds\n• Second in 20 seconds\n\nBoth will persist in notification bar until you swipe them away.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notifications');
    }
  };

  const checkScheduled = async () => {
    const scheduled = await getScheduledNotifications();
    Alert.alert('Scheduled Notifications', `Count: ${scheduled.length}`);
  };

  const cancelScheduled = async () => {
    await cancelAllScheduledNotifications();
    Alert.alert('Cancelled', 'Future scheduled notifications cancelled');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
        Notification Tester
      </Text>
      
      <Text style={{ textAlign: 'center', marginBottom: 20, color: '#666', fontStyle: 'italic' }}>
        Notifications will persist in notification bar until manually cleared
      </Text>
      
      <Button 
        title="Test Persistent Notification (10 sec)" 
        onPress={testPersistentNotification} 
      />
      <View style={{ marginTop: 10 }} />
      
      <Button 
        title="Test Multiple Notifications" 
        onPress={testMultipleNotifications} 
        color="green"
      />
      <View style={{ marginTop: 10 }} />
      
      <Button 
        title="Check Scheduled" 
        onPress={checkScheduled} 
        color="blue" 
      />
      <View style={{ marginTop: 10 }} />
      
      <Button 
        title="Cancel Future Notifications" 
        onPress={cancelScheduled} 
        color="red" 
      />
    </View>
  );
}