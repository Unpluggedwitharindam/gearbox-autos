import { describe, expect, it } from 'vitest';
import { calculateSellerAssistanceFee } from '../showcase/seller-pricing';

describe('owner-confirmed seller assistance fees', () => {
  it('charges ₹10,000 below ₹3,00,000', () => expect(calculateSellerAssistanceFee(299999)).toBe(10000));
  it('charges ₹15,000 at ₹3,00,000', () => expect(calculateSellerAssistanceFee(300000)).toBe(15000));
  it('charges ₹15,000 at ₹5,00,000', () => expect(calculateSellerAssistanceFee(500000)).toBe(15000));
  it('charges 3% of the entire ₹5,00,100, not the excess', () => expect(calculateSellerAssistanceFee(500100)).toBe(15003));
  it('charges ₹18,000 for a ₹6,00,000 sale', () => expect(calculateSellerAssistanceFee(600000)).toBe(18000));
});