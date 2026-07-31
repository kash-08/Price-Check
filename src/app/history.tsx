import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { clearHistory, getHistory, ScanEntry } from '@/utils/historyStore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanEntry[]>([]);

  // Reload history every time this screen comes into focus (not just on first mount)
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
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.center}>
          <ThemedText style={{ textAlign: 'center', opacity: 0.6 }}>
            No scans yet. Go check a product!
          </ThemedText>
          <Pressable style={styles.button} onPress={() => router.push('/')}>
            <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">History</ThemedText>
        <Pressable onPress={handleClear}>
          <ThemedText style={styles.clearText}>Clear all</ThemedText>
        </Pressable>
      </ThemedView>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.product}>{item.product}</ThemedText>
            {item.shops?.[0] && (
              <ThemedText style={styles.cheapest}>
                {item.shops[0].site}: {item.shops[0].price}
              </ThemedText>
            )}
            <ThemedText style={styles.date}>
              {new Date(item.timestamp).toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  clearText: { color: '#ef4444', fontSize: 14 },
  list: { padding: 20, gap: 12 },
  card: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 6,
  },
  product: { fontSize: 16, fontWeight: '600' },
  cheapest: { fontSize: 14, opacity: 0.8 },
  date: { fontSize: 12, opacity: 0.5 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});