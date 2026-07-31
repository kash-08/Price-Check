import { AppColors } from '@/constants/appTheme';
import { ShoppingResult } from '@/utils/searchShopping';
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={{ gap: 14 }}>
      {shops.map((shop, i) => {
        const price = prices[i];
        const widthPercent = maxPrice > 0 ? (price / maxPrice) * 100 : 0;
        const isCheapest = i === cheapestIndex;

        return (
          <View key={i} style={styles.row}>
            <Text style={styles.siteLabel} numberOfLines={1}>{shop.site}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${widthPercent}%` },
                  isCheapest && styles.barFillCheapest,
                ]}
              />
            </View>
            <Text style={[styles.priceLabel, isCheapest && styles.priceLabelCheapest]}>
              {shop.price}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  siteLabel: { width: 75, fontSize: 12, color: AppColors.textSecondary },
  barTrack: {
    flex: 1,
    height: 18,
    backgroundColor: AppColors.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: AppColors.accent, borderRadius: 6 },
  barFillCheapest: { backgroundColor: AppColors.success },
  priceLabel: {
    width: 65,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    color: AppColors.textSecondary,
  },
  priceLabelCheapest: { color: AppColors.success },
});