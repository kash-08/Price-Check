import { PriceChart } from '@/components/price-chart';
import { AppColors, AppRadius, AppSpacing } from '@/constants/appTheme';
import { analyzeProduct } from '@/utils/analyzeProduct';
import { saveScan } from '@/utils/historyStore';
import { getCurrentImageUri } from '@/utils/imageStore';
import { searchShopping, ShoppingResult } from '@/utils/searchShopping';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [shops, setShops] = useState<ShoppingResult[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = async () => {
      try {
        const imageUri = getCurrentImageUri();
        if (!imageUri) throw new Error('No image found');

        const identified = await analyzeProduct(imageUri);
        setProduct(identified);

        const shoppingResults = await searchShopping(identified.product);
        setShops(shoppingResults);

        await saveScan({ ...identified, shops: shoppingResults });
      } catch (err: any) {
        console.log('Error:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={AppColors.accent} />
        <Text style={styles.loadingText}>Finding real prices...</Text>
        <Text style={styles.loadingSubtext}>Identifying product and searching stores</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.productTitle}>{product.product}</Text>
            {product.listedPrice && (
              <Text style={styles.listedPrice}>Listed price: {product.listedPrice}</Text>
            )}

            <Text style={styles.sectionHeader}>Real prices found</Text>

            {shops.length === 0 && (
              <Text style={styles.mutedText}>No live listings found for this product.</Text>
            )}

            <View style={{ gap: AppSpacing.sm }}>
              {shops.map((shop, i) => (
                <Pressable
                  key={i}
                  style={[styles.dealCard, i === 0 && styles.bestDealCard]}
                  onPress={() =>
                    router.push({
                      pathname: '/webview',
                      params: { url: shop.link, title: shop.site },
                    })
                  }
                >
                  {i === 0 && (
                    <View style={styles.bestBadge}>
                      <Text style={styles.bestBadgeText}>BEST PRICE</Text>
                    </View>
                  )}
                  <View style={styles.dealRow}>
                    <View>
                      <Text style={styles.dealSite}>{shop.site}</Text>
                      <Text style={[styles.dealPrice, i === 0 && styles.dealPriceCheapest]}>
                        {shop.price}
                      </Text>
                    </View>
                    <Text style={styles.dealArrow}>→</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {shops.length > 1 && (
              <>
                <Text style={styles.sectionHeader}>Price comparison</Text>
                <View style={styles.chartCard}>
                  <PriceChart shops={shops} />
                </View>
              </>
            )}

            <Text style={styles.sectionHeader}>Things to check</Text>
            <View style={{ gap: AppSpacing.xs }}>
              {product.tips?.map((tip: string, i: number) => (
                <Text key={i} style={styles.tip}>• {tip}</Text>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={() => router.push('/')}>
              <Text style={styles.primaryButtonText}>Scan Another</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { padding: AppSpacing.lg, paddingBottom: AppSpacing.xxl },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppSpacing.lg,
    backgroundColor: AppColors.background,
    gap: AppSpacing.xs,
  },
  loadingText: { color: AppColors.text, fontSize: 16, fontWeight: '600', marginTop: AppSpacing.md },
  loadingSubtext: { color: AppColors.textMuted, fontSize: 13 },
  errorText: { color: AppColors.text, textAlign: 'center', marginBottom: AppSpacing.md, fontSize: 15 },
  productTitle: {
    color: AppColors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: AppSpacing.xs,
  },
  listedPrice: { color: AppColors.textSecondary, fontSize: 14, marginBottom: AppSpacing.md },
  sectionHeader: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: AppSpacing.xl,
    marginBottom: AppSpacing.sm,
    opacity: 0.6,
  },
  mutedText: { color: AppColors.textMuted, fontSize: 14 },
  dealCard: {
    backgroundColor: AppColors.surface,
    padding: AppSpacing.md,
    borderRadius: AppRadius.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  bestDealCard: {
    borderColor: AppColors.success,
    backgroundColor: AppColors.successMuted,
  },
  bestBadge: {
    backgroundColor: AppColors.success,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: AppRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: AppSpacing.sm,
  },
  bestBadgeText: { color: '#052e12', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  dealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dealSite: { color: AppColors.text, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  dealPrice: { color: AppColors.textSecondary, fontSize: 20, fontWeight: '700' },
  dealPriceCheapest: { color: AppColors.success },
  dealArrow: { color: AppColors.textMuted, fontSize: 20 },
  chartCard: {
    backgroundColor: AppColors.surface,
    borderRadius: AppRadius.md,
    padding: AppSpacing.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tip: { color: AppColors.textSecondary, fontSize: 14, lineHeight: 21 },
  primaryButton: {
    backgroundColor: AppColors.accent,
    paddingVertical: 18,
    borderRadius: AppRadius.md,
    alignItems: 'center',
    marginTop: AppSpacing.xl,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});