'use client';

import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/formatting';
import type { MetalPriceStatus } from '@/types/zakah';

interface LiveDataBadgeProps {
  lastUpdated?: string;
  isCached?: boolean;
  status?: MetalPriceStatus;
}

export function LiveDataBadge({ lastUpdated, isCached, status }: LiveDataBadgeProps) {
  if (!lastUpdated) {
    return <Badge variant="warning">Loading prices...</Badge>;
  }

  const resolvedStatus = status ?? (isCached ? 'cached' : 'live');

  switch (resolvedStatus) {
    case 'live':
      return (
        <Badge variant="success">
          Live data &middot; Updated {formatDate(lastUpdated)}
        </Badge>
      );
    case 'cached':
      return (
        <Badge variant="warning">
          Cached data &middot; {formatDate(lastUpdated)}
        </Badge>
      );
    case 'fallback':
      return (
        <Badge variant="warning">
          Estimated values &middot; {formatDate(lastUpdated)}
        </Badge>
      );
    case 'unavailable':
      return (
        <Badge variant="warning">
          Prices temporarily unavailable
        </Badge>
      );
    default:
      return (
        <Badge variant="warning">
          {isCached ? 'Cached data' : 'Live data'} &middot; {lastUpdated ? formatDate(lastUpdated) : 'unknown'}
        </Badge>
      );
  }
}
