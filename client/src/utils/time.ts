export function formatRelativeTime(createdAtString?: string): string {
  if (!createdAtString) return 'Just now';
  try {
    const createdDate = new Date(createdAtString);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    if (diffMs < 0) return 'Just now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return createdDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Just now';
  }
}
