import { AppColors, AppRadius, AppSpacing } from '@/constants/appTheme';
import { clearHistory, getHistory, ScanEntry } from '@/utils/historyStore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setHistory);
    }, [])
  );

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.emptyText}>No scans yet</Text>
          <Text style={styles.emptySubtext}>Go check a product's price</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/')}>
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
          <Pressable onPress={handleClear}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.product}>{item.product}</Text>
              {item.shops?.[0] && (
                <Text style={styles.bestPrice}>
                  {item.shops[0].site} · {item.shops[0].price}
                </Text>
              )}
              <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: AppSpacing.lg, gap: 6 },
  emptyText: { color: AppColors.text, fontSize: 18, fontWeight: '700' },
  emptySubtext: { color: AppColors.textMuted, fontSize: 14, marginBottom: AppSpacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppSpacing.lg,
    paddingTop: AppSpacing.sm,
    paddingBottom: AppSpacing.sm,
  },
  headerTitle: { color: AppColors.text, fontSize: 24, fontWeight: '800' },
  clearText: { color: AppColors.error, fontSize: 14, fontWeight: '600' },
  list: { padding: AppSpacing.lg, gap: AppSpacing.sm },
  card: {
    backgroundColor: AppColors.surface,
    padding: AppSpacing.md,
    borderRadius: AppRadius.md,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 4,
  },
  product: { color: AppColors.text, fontSize: 15, fontWeight: '600' },
  bestPrice: { color: AppColors.success, fontSize: 14, fontWeight: '600' },
  date: { color: AppColors.textMuted, fontSize: 12 },
  primaryButton: {
    backgroundColor: AppColors.accent,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: AppRadius.md,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});