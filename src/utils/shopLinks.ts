export function getShopSearchUrl(site: string, product: string): string {
  const query = encodeURIComponent(product);
  const normalizedSite = site.toLowerCase();

  if (normalizedSite.includes('amazon')) {
    return `https://www.amazon.in/s?k=${query}`;
  }
  if (normalizedSite.includes('flipkart')) {
    return `https://www.flipkart.com/search?q=${query}`;
  }
  if (normalizedSite.includes('myntra')) {
    return `https://www.myntra.com/${query}`;
  }
  if (normalizedSite.includes('ajio')) {
    return `https://www.ajio.com/search/?text=${query}`;
  }
  if (normalizedSite.includes('croma')) {
    return `https://www.croma.com/searchB?q=${query}`;
  }
  if (normalizedSite.includes('reliance')) {
    return `https://www.reliancedigital.in/search?q=${query}`;
  }

  // fallback: generic Google Shopping search for the product + site name
  return `https://www.google.com/search?tbm=shop&q=${query}+${encodeURIComponent(site)}`;
}