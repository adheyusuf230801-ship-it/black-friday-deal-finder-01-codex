import { DEALS } from './data.js';
import { renderDeals, buildFilterOptions } from './views.js';

const search = document.getElementById('search');
const category = document.getElementById('category');
const store = document.getElementById('store');
const discount = document.getElementById('discount');
const sort = document.getElementById('sort');
const count = document.getElementById('count');
const sorters = {
  discount: (a, b) => b.discountPct - a.discountPct || a.sale - b.sale,
  price: (a, b) => a.sale - b.sale || b.discountPct - a.discountPct,
  savings: (a, b) => (b.usual - b.sale) - (a.usual - a.sale) || b.discountPct - a.discountPct,
};

function updateDeals() {
  const query = search.value.trim().toLocaleLowerCase('en-US');
  const matches = DEALS.filter(deal => {
    const searchable = `${deal.product} ${deal.store} ${deal.category}`.toLocaleLowerCase('en-US');
    return searchable.includes(query)
      && (!category.value || deal.category === category.value)
      && (!store.value || deal.store === store.value)
      && deal.discountPct >= Number(discount.value);
  });
  matches.sort(sorters[sort.value]);
  renderDeals(matches);
  count.textContent = `Showing ${matches.length} of ${DEALS.length} deals`;
}

buildFilterOptions(DEALS);
const params = new URLSearchParams(window.location.search);
if (params.has('q')) search.value = params.get('q');
for (const [name, control] of [['category', category], ['store', store], ['discount', discount], ['sort', sort]]) {
  const value = params.get(name);
  if (value !== null && [...control.options].some(option => option.value === value)) control.value = value;
}
search.addEventListener('input', updateDeals);
for (const control of [category, store, discount, sort]) control.addEventListener('change', updateDeals);
const filters = document.getElementById('filters');
filters.addEventListener('submit', event => event.preventDefault());
filters.addEventListener('reset', () => {
  queueMicrotask(() => {
    sort.value = 'discount';
    updateDeals();
  });
});
updateDeals();
if (typeof window !== 'undefined') window.__shotReady = true;
