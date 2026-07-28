const MALE_AVATAR = 'data:image/svg+xml;base64,' + Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="50" fill="#2563eb"/>
  <circle cx="50" cy="38" r="18" fill="#fff"/>
  <ellipse cx="50" cy="82" rx="30" ry="22" fill="#fff"/>
</svg>`).toString('base64');

const FEMALE_AVATAR = 'data:image/svg+xml;base64,' + Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="50" fill="#ec4899"/>
  <circle cx="50" cy="38" r="18" fill="#fff"/>
  <ellipse cx="50" cy="82" rx="30" ry="22" fill="#fff"/>
</svg>`).toString('base64');

export function getDefaultAvatar(gender?: string): string {
  return gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR;
}
