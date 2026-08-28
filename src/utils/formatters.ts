import { AchievementDirection } from '../types/dashboard.ts';

/**
 * Format Indonesian Rupiah
 * e.g., 44110887897 -> "Rp 44,110,887,897" or "Rp 44.11 B"
 */
export function formatRupiah(amount: number | null | undefined, compact = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (absAmount >= 1_000_000_000_000) {
      const val = (absAmount / 1_000_000_000_000).toFixed(2);
      return `${isNegative ? '-' : ''}Rp ${val} T`;
    }
    if (absAmount >= 1_000_000_000) {
      const val = (absAmount / 1_000_000_000).toFixed(2);
      return `${isNegative ? '-' : ''}Rp ${val} B`;
    }
    if (absAmount >= 1_000_000) {
      const val = (absAmount / 1_000_000).toFixed(2);
      return `${isNegative ? '-' : ''}Rp ${val} M`;
    }
    if (absAmount >= 1_000) {
      const val = (absAmount / 1_000).toFixed(1);
      return `${isNegative ? '-' : ''}Rp ${val} K`;
    }
    return `${isNegative ? '-' : ''}Rp ${absAmount.toLocaleString('en-US')}`;
  }

  return `${isNegative ? '-' : ''}Rp ${Math.round(absAmount).toLocaleString('en-US')}`;
}

/**
 * Format Percentage
 * e.g., 106.173 -> "106.17%"
 */
export function formatPercentage(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format Variance in Rupiah with +/- sign
 */
export function formatVariance(variance: number, compact = true): string {
  const sign = variance > 0 ? '+' : variance < 0 ? '-' : '';
  const absFormatted = formatRupiah(Math.abs(variance), compact);
  return `${sign}${absFormatted}`;
}

/**
 * Evaluate achievement status based on direction rule
 */
export function evaluateAchievement(
  achievement: number,
  direction: AchievementDirection = 'higher_is_better'
): {
  isFavorable: boolean;
  statusText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  arrow: 'up' | 'down' | 'neutral';
} {
  const isHigher = direction === 'higher_is_better';
  const isFavorable = isHigher ? achievement >= 100 : achievement <= 100;
  const isAbove100 = achievement >= 100;

  if (achievement === 100) {
    return {
      isFavorable: true,
      statusText: 'On Target',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      arrow: 'neutral',
    };
  }

  if (isFavorable) {
    return {
      isFavorable: true,
      statusText: isHigher ? 'Above Target' : 'Under Budget',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      arrow: isAbove100 ? 'up' : 'down',
    };
  }

  return {
    isFavorable: false,
    statusText: isHigher ? 'Below Target' : 'Over Budget',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    arrow: isAbove100 ? 'up' : 'down',
  };
}

/**
 * Export table matrix data to CSV
 */
export function exportMatrixToCSV(sections: any[], year: number) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let csv = `Category,Subcategory,Metric,Full Year Actual,Full Year Budget,Full Year Ach %`;
  for (const m of monthNames) {
    csv += `,${m}-${year} Actual,${m}-${year} Budget,${m}-${year} Ach %`;
  }
  csv += `\n`;

  for (const sec of sections) {
    for (const row of sec.rows) {
      let line = `"${sec.title}","${row.subcategory}","${row.metric}",${row.fullYear.actual},${row.fullYear.budget},${row.fullYear.achievement}%`;
      for (let m = 1; m <= 12; m++) {
        const mData = row.months[m];
        line += `,${mData?.actual || 0},${mData?.budget || 0},${mData?.achievement || 0}%`;
      }
      csv += line + `\n`;
    }
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Financial_Performance_Breakdown_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
