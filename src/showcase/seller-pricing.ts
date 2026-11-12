const formatInr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const sellerFeePolicy = {
  lowerBoundary: 300000,
  upperBoundary: 500000,
  lowerFee: 10000,
  middleFee: 15000,
  percentage: 3,
} as const;

/** Calculate the assistance fee on the entire final selling price. */
export function calculateSellerAssistanceFee(finalSellingPrice: number): number {
  if (finalSellingPrice < sellerFeePolicy.lowerBoundary) return sellerFeePolicy.lowerFee;
  if (finalSellingPrice <= sellerFeePolicy.upperBoundary) return sellerFeePolicy.middleFee;
  return finalSellingPrice * sellerFeePolicy.percentage / 100;
}

export const sellerPricingHeading = 'Seller assistance fees are based on the final vehicle selling price:';
export const sellerPricingBands = [
  `Below ${formatInr(sellerFeePolicy.lowerBoundary)}: ${formatInr(sellerFeePolicy.lowerFee)}`,
  `${formatInr(sellerFeePolicy.lowerBoundary)} to ${formatInr(sellerFeePolicy.upperBoundary)} inclusive: ${formatInr(sellerFeePolicy.middleFee)}`,
  `Above ${formatInr(sellerFeePolicy.upperBoundary)}: ${sellerFeePolicy.percentage}% of the entire final selling price.`,
];
export const sellerPricingExample = `For example, a car sold for ₹6,00,000 attracts a seller assistance fee of ${formatInr(calculateSellerAssistanceFee(600000))}.`;
export const sellerPricingDisclosure = `${sellerPricingHeading} ${sellerPricingBands.join('; ')} ${sellerPricingExample}`;
export const sellerPricingSummary = 'Seller assistance fees apply based on the final vehicle selling price. Review the fee schedule before submitting an enquiry.';