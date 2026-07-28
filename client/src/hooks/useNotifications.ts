import { useEffect, useState, useCallback } from 'react';
import { fetchNotifications, markNotificationRead, deleteNotificationDoc } from '../services/notification.service';
import type { AppNotification } from '../types/domain';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const ns = await fetchNotifications();
      setNotifications(ns);
      setUnreadCount(ns.filter((x) => !x.read).length);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = useCallback(async (id: string) => {
    await markNotificationRead(id);
    load();
  }, [load]);

  const remove = useCallback(async (id: string) => {
    await deleteNotificationDoc(id);
    load();
  }, [load]);

  return { notifications, unreadCount, markRead, remove, refresh: load };
}
