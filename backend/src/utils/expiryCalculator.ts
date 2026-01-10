import dayjs from 'dayjs';

/**
 * Calculates the actual expiry date based on PAO and Expiry Date.
 */
export const calculateFinalExpiry = (
  expiryDate: Date,
  openingDate?: Date | null,
  paoMonths?: number | null
): Date => {
  const absoluteExpiry = dayjs(expiryDate);

  if (!openingDate || !paoMonths) {
    return absoluteExpiry.toDate();
  }

  const paoExpiry = dayjs(openingDate).add(paoMonths, 'month');

  // Return the earlier date
  return paoExpiry.isBefore(absoluteExpiry) 
    ? paoExpiry.toDate() 
    : absoluteExpiry.toDate();
};