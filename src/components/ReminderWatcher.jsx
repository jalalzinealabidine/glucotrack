import { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext.jsx';

function ReminderWatcher() {
  const { reminders } = useData();
  const lastTriggeredRef = useRef({});

  useEffect(() => {
    function checkReminders() {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const today = now.toISOString().slice(0, 10);

      reminders
        .filter((reminder) => reminder.isActive)
        .forEach((reminder) => {
          const triggerKey = `${reminder.id}-${today}-${currentTime}`;

          if (reminder.time === currentTime && !lastTriggeredRef.current[triggerKey]) {
            new Notification(reminder.title || 'Check blood sugar', {
              body: 'Time to check and log your blood sugar level.',
              tag: reminder.id
            });
            lastTriggeredRef.current[triggerKey] = true;
          }
        });
    }

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 30 * 1000);

    return () => window.clearInterval(intervalId);
  }, [reminders]);

  return null;
}

export default ReminderWatcher;
