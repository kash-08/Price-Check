const SERPAPI_KEY = process.env.EXPO_PUBLIC_SERPAPI_KEY;

export type ShoppingResult = {
  site: string;
  price: string;
  link: string;
};

export async function searchShopping(productName: string): Promise<ShoppingResult[]> {
  if (!SERPAPI_KEY) {
    throw new Error('SerpApi key is missing - check your .env file');
  }

  const query = encodeURIComponent(productName);
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${query}&gl=in&hl=en&api_key=${SERPAPI_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log('SerpApi response:', JSON.stringify(data).substring(0, 400));

  if (data.error) {
    throw new Error(data.error);
  }
  const results = data.shopping_results || [];

  const normalized: ShoppingResult[] = results.map((item: any) => ({
    site: item.source || 'Unknown store',
    price: item.price || 'N/A',
    link: item.product_link || item.link || '',
  }));

  // Keep only the first (typically cheapest, since SerpApi sorts by relevance/price) result per site
  const seenSites = new Set<string>();
  const deduped: ShoppingResult[] = [];

  for (const item of normalized) {
    if (!seenSites.has(item.site)) {
      seenSites.add(item.site);
      deduped.push(item);
    }
  }

  return deduped.slice(0, 5);
}