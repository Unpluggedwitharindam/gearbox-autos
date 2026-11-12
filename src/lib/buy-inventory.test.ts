import { describe, expect, it } from 'vitest';
import { buyOptions, emptyBuyFilters, filterBuyCars, type BuyCar, type BuyFilters } from './buy-inventory';
const car = (id: string, make: string | null, model: string | null, price: number, year: number, km: string, date: string): BuyCar => ({
  id, slug: id, name: `${make ?? 'Uncategorised'} ${model ?? 'Legacy car'}`, make, model, price_inr: price, price: String(price), year, km, created_at: date,
  fuel: id === 'brezza' ? 'Diesel' : 'Petrol', transmission: 'Manual', rto: 'JH05', location: 'Jamshedpur', image: '', images: [],
});
const cars = [car('wagonr','MARUTI SUZUKI','WAGONR',495000,2024,'11,000','2026-10-14'),car('brezza','Maruti Suzuki','Vitara Brezza',675000,2019,'1,02,000','2026-10-30'),car('hector','MG','HECTOR',785000,2020,'50,000','2026-11-06'),car('legacy',null,null,449000,2019,'20,000','2026-08-17')];
const run = (filters: Partial<BuyFilters> = {}) => filterBuyCars(cars, { ...emptyBuyFilters, ...filters });
const ids = (filters: Partial<BuyFilters>) => run(filters).cars.map(car => car.id);
describe('buy inventory filters', () => {
  it('make uses case-normalized stored values', () => expect(ids({make:'maruti suzuki'})).toEqual(['brezza','wagonr']));
  it('model uses actual stored model', () => expect(ids({model:'wagonr'})).toEqual(['wagonr']));
  it('keyword matches stored brand and model words', () => expect(ids({q:'maruti WAGONR'})).toEqual(['wagonr']));
  it('name-only legacy records remain searchable', () => expect(ids({q:'Legacy car'})).toEqual(['legacy']));
  it('minimum price includes its boundary', () => expect(ids({min:'675000'})).toEqual(['hector','brezza']));
  it('maximum price includes its boundary', () => expect(ids({max:'495000'})).toEqual(['wagonr','legacy']));
  it('combines make model keyword and both prices', () => expect(ids({make:'maruti suzuki',model:'wagonr',q:'wagon',min:'495000',max:'495000'})).toEqual(['wagonr']));
  it('combines fuel and transmission', () => expect(ids({fuel:'diesel',transmission:'manual'})).toEqual(['brezza']));
  it('restricts dependent model options without inventing legacy mappings', () => expect(buyOptions(cars,'model','maruti suzuki').map(([key])=>key)).toEqual(['vitara brezza','wagonr']));
  it('merges casing variations of the same make', () => expect(buyOptions(cars,'make').map(([key])=>key)).toEqual(['maruti suzuki','mg']));
  it('rejects reversed price bounds', () => { expect(run({min:'800000',max:'495000'}).error).toBeTruthy(); expect(ids({min:'800000',max:'495000'})).toEqual([]); });
  it.each(['-1','NaN','Infinity'])('rejects invalid price %s', value => expect(run({min:value}).error).toBeTruthy());
  it('returns an honest empty result', () => expect(ids({q:'not-in-inventory'})).toEqual([]));
  it('sorts filtered price ascending', () => expect(ids({make:'maruti suzuki',sort:'price-low'})).toEqual(['wagonr','brezza']));
  it('sorts price descending', () => expect(ids({sort:'price-high'})).toEqual(['hector','brezza','wagonr','legacy']));
  it('sorts year newest first', () => expect(ids({sort:'year-new'})).toEqual(['wagonr','hector','brezza','legacy']));
  it('sorts numeric kilometres rather than formatted strings', () => expect(ids({sort:'km-low'})).toEqual(['wagonr','legacy','hector','brezza']));
  it('reset restores original latest order without mutating inventory', () => { run({q:'wagon',sort:'price-low'}); expect(ids(emptyBuyFilters)).toEqual(['hector','brezza','wagonr','legacy']); expect(cars[0]?.id).toBe('wagonr'); });
});