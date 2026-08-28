import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { AchievementDirection } from '../types/dashboard.ts';
import { evaluateAchievement, formatPercentage } from '../utils/formatters.ts';

interface AchievementBadgeProps {
  achievement: number;
  direction?: AchievementDirection;
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  direction = 'higher_is_better',
  size = 'md',
  showArrow = true,
  className = '',
}) => {
  const safeDirection: AchievementDirection = direction === 'lower_is_better' ? 'lower_is_better' : 'higher_is_better';
  const { isFavorable, badgeBg, badgeText, badgeBorder, arrow } = evaluateAchievement(achievement, safeDirection);

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-1.5 font-bold',
  }[size];

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span
      id={`achievement-badge-${Math.round(achievement)}`}
      className={`inline-flex items-center rounded-md border transition-colors whitespace-nowrap ${badgeBg} ${badgeText} ${badgeBorder} ${sizeClasses} ${className}`}
      title={`${achievement.toFixed(2)}% (${direction === 'higher_is_better' ? 'Higher is better' : 'Lower is better'} - ${isFavorable ? 'Favorable' : 'Unfavorable'})`}
    >
      {showArrow && (
        <>
          {arrow === 'up' ? (
            <ArrowUpRight size={iconSize} className="shrink-0 stroke-[2.5]" />
          ) : arrow === 'down' ? (
            <ArrowDownRight size={iconSize} className="shrink-0 stroke-[2.5]" />
          ) : (
            <Minus size={iconSize} className="shrink-0 stroke-[2.5]" />
          )}
        </>
      )}
      <span>{formatPercentage(achievement)}</span>
    </span>
  );
};
