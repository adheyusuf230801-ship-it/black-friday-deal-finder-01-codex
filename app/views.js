const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const verdictClasses = { 'Real deal': 'verdict-real', 'Good deal': 'verdict-good', 'Mild deal': 'verdict-mild' };

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function dealCard(deal) {
  const card = element('article', 'deal-card');
  const titleId = `title-${deal.id}`;
  card.setAttribute('aria-labelledby', titleId);
  const top = element('div', 'card-top');
  top.append(element('span', 'category', deal.category), element('span', 'discount-badge', `${deal.discountPct}% off`));
  const title = element('h3', '', deal.product);
  title.id = titleId;
  const price = element('div', 'price-block');
  const prices = element('div', 'prices');
  const usual = element('del', 'usual-price', dollars.format(deal.usual));
  usual.setAttribute('aria-label', `Usual price ${dollars.format(deal.usual)}`);
  const sale = element('span', 'sale-price', dollars.format(deal.sale));
  sale.setAttribute('aria-label', `Sale price ${dollars.format(deal.sale)}`);
  prices.append(sale, usual);
  price.append(prices, element('p', 'savings', `Save ${dollars.format(deal.usual - deal.sale)}`));
  const link = element('a', 'store-link', `View at ${deal.store}`);
  link.href = deal.url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', `View ${deal.product} at ${deal.store} (opens in a new tab)`);
  const arrow = element('span', '', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  const provenance = element('div', 'provenance');
  provenance.append(element('p', 'source', `Source: ${deal.source}`), element('p', 'checked', deal.checked));
  card.append(top, title, element('p', 'store', deal.store), price, element('span', `verdict-badge ${verdictClasses[deal.verdict]}`, deal.verdict), link, provenance);
  return card;
}

export function renderDeals(deals) {
  const fragment = document.createDocumentFragment();
  if (deals.length) {
    deals.forEach(deal => fragment.append(dealCard(deal)));
  } else {
    const empty = element('div', 'empty-state');
    empty.append(element('h3', '', 'No finds this time.'), element('p', '', 'Try a different search, lower the minimum discount, or reset the filters.'));
    fragment.append(empty);
  }
  document.getElementById('deals').replaceChildren(fragment);
}

export function buildFilterOptions(deals) {
  for (const field of ['category', 'store']) {
    const select = document.getElementById(field);
    const options = [...new Set(deals.map(deal => deal[field]))].sort((a, b) => a.localeCompare(b));
    for (const value of options) {
      const option = element('option', '', value);
      option.value = value;
      select.append(option);
    }
  }
}
