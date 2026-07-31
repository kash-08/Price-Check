import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { analyzeProduct } from '@/utils/analyzeProduct';
import { saveScan } from '@/utils/historyStore';
import { getCurrentImageUri } from '@/utils/imageStore';
import { searchShopping, ShoppingResult } from '@/utils/searchShopping';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [shops, setShops] = useState<ShoppingResult[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const imageUri = getCurrentImageUri();
        if (!imageUri) {
          throw new Error('No image found');
        }

        // Step 1: identify the product
        const identified = await analyzeProduct(imageUri);
        setProduct(identified);

        // Step 2: search for real prices
        const shoppingResults = await searchShopping(identified.product);
        setShops(shoppingResults);

        // Step 3: save to history
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

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 16 }}>Finding real prices...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
          Error: {error}
        </ThemedText>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">{product.product}</ThemedText>
        {product.listedPrice && (
          <ThemedText style={styles.row}>Listed price: {product.listedPrice}</ThemedText>
        )}

        <ThemedText type="title" style={styles.tipsHeader}>Real prices found</ThemedText>

        {shops.length === 0 && (
          <ThemedText style={{ opacity: 0.6 }}>No live listings found for this product.</ThemedText>
        )}

        {shops.map((shop, i) => (
          <Pressable
            key={i}
            style={styles.dealCard}
            onPress={() =>
              router.push({
                pathname: '/webview',
                params: { url: shop.link, title: shop.site },
              })
            }
          >
            <ThemedView style={styles.dealRow}>
              <ThemedView>
                <ThemedText style={styles.dealSite}>{shop.site}</ThemedText>
                <ThemedText style={styles.dealPrice}>{shop.price}</ThemedText>
              </ThemedView>
              <ThemedText style={styles.dealArrow}>→</ThemedText>
            </ThemedView>
          </Pressable>
        ))}

        <ThemedText type="title" style={styles.tipsHeader}>Things to check</ThemedText>
        {product.tips?.map((tip: string, i: number) => (
          <ThemedText key={i} style={styles.tip}>- {tip}</ThemedText>
        ))}

        <Pressable style={styles.button} onPress={() => router.push('/')}>
          <ThemedText style={styles.buttonText}>Scan Another</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  row: { fontSize: 15 },
  tipsHeader: { marginTop: 16, fontSize: 18 },
  tip: { fontSize: 15, lineHeight: 22 },
  dealCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  dealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dealSite: { fontSize: 15, fontWeight: '600' },
  dealPrice: { fontSize: 18, fontWeight: '700', color: '#2563eb' },
  dealArrow: { fontSize: 20, opacity: 0.4 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});