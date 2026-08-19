/**
 * "Kaveritarjous": for every 3 tickets of the same type, the customer pays for 2.
 */
export function calculateFriendOfferTotal<T extends { ticketID: string; quantity: number }>(
  tickets: T[],
  getPrice: (ticketID: string) => number
): { total: number; originalTotal: number; savings: number } {
  let originalTotal = 0;
  let discountedTotal = 0;

  for (const t of tickets) {
    const price = getPrice(t.ticketID);
    const qty = t.quantity;
    const freeQty = Math.floor(qty / 3);
    originalTotal += price * qty;
    discountedTotal += price * (qty - freeQty);
  }

  return {
    total: discountedTotal,
    originalTotal,
    savings: originalTotal - discountedTotal,
  };
}
