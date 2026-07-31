import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ShoppingResult } from '@/utils/searchShopping';
import { StyleSheet } from 'react-native';

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function PriceChart({ shops }: { shops: ShoppingResult[] }) {
  if (shops.length === 0) return null;

  const prices = shops.map((s) => parsePrice(s.price));
  const maxPrice = Math.max(...prices);
  const cheapestIndex = prices.indexOf(Math.min(...prices.filter((p) => p > 0)));

  return (
    <ThemedView style={styles.container}>
      {shops.map((shop, i) => {
        const price = prices[i];
        const widthPercent = maxPrice > 0 ? (price / maxPrice) * 100 : 0;
        const isCheapest = i === cheapestIndex;

        return (
          <ThemedView key={i} style={styles.row}>
            <ThemedText style={styles.siteLabel} numberOfLines={1}>
              {shop.site}
            </ThemedText>
            <ThemedView style={styles.barTrack}>
              <ThemedView
                style={[
                  styles.barFill,
                  { width: `${widthPercent}%` },
                  isCheapest && styles.barFillCheapest,
                ]}
              />
            </ThemedView>
            <ThemedText style={[styles.priceLabel, isCheapest && styles.priceLabelCheapest]}>
              {shop.price}
            </ThemedText>
          </ThemedView>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, backgroundColor: 'transparent' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  siteLabel: {
    width: 80,
    fontSize: 12,
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  barFillCheapest: {
    backgroundColor: '#22c55e',
  },
  priceLabel: {
    width: 70,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  priceLabelCheapest: {
    color: '#22c55e',
    fontWeight: '700',
  },
});