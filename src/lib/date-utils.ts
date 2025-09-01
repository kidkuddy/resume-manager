/**
 * Calculate the duration between two dates and return formatted string (1y6m format)
 */
export function calculateExperienceDuration(startDate: string, endDate?: string, current?: boolean): string {
  const start = parseMonthYear(startDate);
  const end = current ? new Date() : (endDate ? parseMonthYear(endDate) : new Date());
  
  if (!start || !end) return '0m';
  
  const diffInMs = end.getTime() - start.getTime();
  const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
  
  if (diffInMonths < 1) return '0m';
  
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  
  if (years === 0) return `${months}m`;
  if (months === 0) return `${years}y`;
  return `${years}y${months}m`;
}

/**
 * Calculate total experience duration across multiple experiences
 */
export function calculateTotalExperience(experiences: Array<{ startDate: string; endDate?: string; current?: boolean }>): string {
  let totalMonths = 0;
  
  experiences.forEach(exp => {
    const start = parseMonthYear(exp.startDate);
    const end = exp.current ? new Date() : (exp.endDate ? parseMonthYear(exp.endDate) : new Date());
    
    if (start && end) {
      const diffInMs = end.getTime() - start.getTime();
      const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
      totalMonths += Math.max(0, diffInMonths);
    }
  });
  
  if (totalMonths < 1) return '0m';
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) return `${months}m`;
  if (months === 0) return `${years}y`;
  return `${years}y${months}m`;
}

/**
 * Parse date strings in format "Jan 2023" or "2023-01" to Date object
 */
function parseMonthYear(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Handle "Jan 2023" format
  if (dateStr.includes(' ')) {
    const [monthStr, yearStr] = dateStr.split(' ');
    const year = parseInt(yearStr);
    const monthMap: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    const month = monthMap[monthStr.toLowerCase()];
    return new Date(year, month, 1);
  }
  
  // Handle "2023-01" format
  if (dateStr.includes('-')) {
    const [yearStr, monthStr] = dateStr.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // JavaScript months are 0-indexed
    return new Date(year, month, 1);
  }
  
  return null;
}
