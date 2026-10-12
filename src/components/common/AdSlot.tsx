import React from 'react';

export interface AdSlotProps {
  variant: 'leaderboard' | 'inArticle' | 'sidebar' | 'inFeed';
  slotId?: string;
  className?: string;
}

// Advertising is not configured for this frontend. Keep the component contract
// so a future, real integration can be added without rendering simulated ads.
export const AdSlot: React.FC<AdSlotProps> = () => null;
