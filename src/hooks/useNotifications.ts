import { useEffect, useCallback } from "react";
import { Todo } from "@/types/todo";

export const useNotifications = (todos: Todo[]) => {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }, []);

  useEffect(() => {
    // Check for due tasks every minute
    const interval = setInterval(() => {
      const now = new Date();

      todos.forEach((todo) => {
        if (!todo.completed && todo.notify_enabled && todo.due_date) {
          const dueDate = new Date(todo.due_date);
          const timeDiff = dueDate.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));

          // Notify if we're within the notification window
          if (minutesDiff > 0 && minutesDiff <= todo.notify_frequency) {
            const hours = Math.floor(minutesDiff / 60);
            const minutes = minutesDiff % 60;

            let timeString = "";
            if (hours > 0) {
              timeString = `${hours}h ${minutes}m`;
            } else {
              timeString = `${minutes}m`;
            }

            showNotification(
              `Task Due Soon: ${todo.title}`,
              `This task is due in ${timeString}`,
            );
          } else if (minutesDiff <= 0 && minutesDiff > -5) {
            // Task is overdue but within 5 minutes
            showNotification(
              `Task Overdue: ${todo.title}`,
              "This task is now overdue!",
            );
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [todos, showNotification]);

  return { requestPermission, showNotification };
};
