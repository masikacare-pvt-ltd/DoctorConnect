import type { UserSettings } from '../types/domain';

const DEFAULTS: UserSettings = {
  theme: 'light',
  notificationsEnabled: true,
  digestEnabled: true,
};

let cached: UserSettings = { ...DEFAULTS };

export async function loadSettings(_uid: string): Promise<UserSettings> {
  return { ...cached };
}

export async function saveSettings(_uid: string, settings: UserSettings): Promise<void> {
  cached = { ...settings };
}
