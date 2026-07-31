import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { analyzeProduct } from '@/utils/analyzeProduct';
import { getCurrentImageUri } from '@/utils/imageStore';
import { saveScan } from '@/utils/historyStore';

export default function ResultScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const imageUri = getCurrentImageUri();
        if (!imageUri) {
          throw new Error('No image found');
        }
        const data = await analyzeProduct(imageUri);
        setResult(data);
        await saveScan(data);
      } catch (err: any) {
        console.log('Analysis error:', err);
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
        <ThemedText style={{ marginTop: 16 }}>Analyzing product...</ThemedText>
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
        <ThemedText type="title">{result.product}</ThemedText>
        <ThemedView style={styles.verdictBadge}>
          <ThemedText style={styles.verdictText}>{result.verdict}</ThemedText>
        </ThemedView>
        {result.listedPrice && (
          <ThemedText style={styles.row}>Listed price: {result.listedPrice}</ThemedText>
        )}

        <ThemedText type="title" style={styles.tipsHeader}>Estimated deals</ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
          AI-estimated prices, not live data. Please verify on the actual site.
        </ThemedText>
        {result.deals?.map((deal: any, i: number) => (
          <ThemedView key={i} style={styles.dealCard}>
            <ThemedText style={styles.dealSite}>{deal.site}</ThemedText>
            <ThemedText style={styles.dealPrice}>{deal.price}</ThemedText>
            {deal.note && <ThemedText style={styles.dealNote}>{deal.note}</ThemedText>}
          </ThemedView>
        ))}

        <ThemedText type="title" style={styles.tipsHeader}>Things to check</ThemedText>
        {result.tips?.map((tip: string, i: number) => (
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
  verdictBadge: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verdictText: { color: '#fff', fontWeight: '600' },
  row: { fontSize: 15 },
  tipsHeader: { marginTop: 16, fontSize: 18 },
  tip: { fontSize: 15, lineHeight: 22 },
  dealCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  dealSite: { fontSize: 15, fontWeight: '600' },
  dealPrice: { fontSize: 18, fontWeight: '700', color: '#2563eb' },
  dealNote: { fontSize: 13, opacity: 0.7 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});