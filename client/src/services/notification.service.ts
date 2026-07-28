import { apiGet, apiPatch } from '../lib/api';
import type { AppNotification } from '../types/domain';

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data } = await apiGet('/api/notifications');
  return (data || []).map((n: AppNotification) => ({
    id: n.id,
    userId: n.userId,
    type: n.type || 'system',
    caseId: n.caseId || null,
    fromUid: n.fromUid || null,
    fromName: n.fromName || null,
    text: n.text || '',
    read: n.read || false,
    createdAt: n.createdAt,
  }));
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiPatch(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiPatch('/api/notifications/read-all');
}

export async function deleteNotificationDoc(id: string): Promise<void> {
  await apiPatch(`/api/notifications/read/${id}`);
}
