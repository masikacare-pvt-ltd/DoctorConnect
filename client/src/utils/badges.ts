export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function getBadgesForCounts(casesCount: number, commentsCount: number): Badge[] {
  const badges: Badge[] = [];

  if (casesCount >= 5) {
    badges.push({
      id: 'expert-diagnostician',
      name: 'Expert Diagnostician',
      description: 'Shared 5 or more clinical cases',
      icon: '🧠',
      color: 'text-indigo-700 dark:text-indigo-300',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200 dark:border-indigo-900/30',
    });
  } else if (casesCount >= 3) {
    badges.push({
      id: 'senior-diagnostician',
      name: 'Senior Diagnostician',
      description: 'Shared 3 or more clinical cases',
      icon: '🔎',
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/30',
    });
  } else if (casesCount >= 1) {
    badges.push({
      id: 'clinical-explorer',
      name: 'Clinical Explorer',
      description: 'Shared a clinical case',
      icon: '🌱',
      color: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-900/30',
    });
  }

  if (commentsCount >= 5) {
    badges.push({
      id: 'top-contributor',
      name: 'Top Contributor',
      description: 'Provided 5 or more peer reviews',
      icon: '🏆',
      color: 'text-amber-700 dark:text-amber-300',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-900/30',
    });
  } else if (commentsCount >= 3) {
    badges.push({
      id: 'expert-reviewer',
      name: 'Expert Reviewer',
      description: 'Provided 3 or more peer reviews',
      icon: '💬',
      color: 'text-cyan-700 dark:text-cyan-300',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
      borderColor: 'border-cyan-200 dark:border-cyan-900/30',
    });
  } else if (commentsCount >= 1) {
    badges.push({
      id: 'active-contributor',
      name: 'Active Contributor',
      description: 'Provided a peer review',
      icon: '✨',
      color: 'text-rose-700 dark:text-rose-300',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-900/30',
    });
  }

  return badges;
}
