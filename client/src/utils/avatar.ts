const DEFAULT_AVATAR = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#2563eb"/><circle cx="50" cy="38" r="18" fill="#fff"/><ellipse cx="50" cy="82" rx="30" ry="22" fill="#fff"/></svg>');

export function getAvatarUrl(profile?: { avatarUrl?: string; avatarData?: string }): string {
  return profile?.avatarUrl || profile?.avatarData || DEFAULT_AVATAR;
}
