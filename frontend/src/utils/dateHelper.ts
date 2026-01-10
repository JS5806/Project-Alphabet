import dayjs from 'dayjs';

export type ExpiryStatus = 'SAFE' | 'WARNING' | 'EXPIRED';

export const getExpiryStatus = (finalDate: string | Date): { status: ExpiryStatus; daysLeft: number } => {
  const today = dayjs();
  const expiry = dayjs(finalDate);
  const daysLeft = expiry.diff(today, 'day');

  if (daysLeft <= 0) return { status: 'EXPIRED', daysLeft };
  if (daysLeft <= 30) return { status: 'WARNING', daysLeft };
  return { status: 'SAFE', daysLeft };
};

export const getStatusColor = (status: ExpiryStatus) => {
  switch (status) {
    case 'EXPIRED': return 'bg-red-500';
    case 'WARNING': return 'bg-yellow-500';
    case 'SAFE': return 'bg-green-500';
    default: return 'bg-gray-200';
  }
};