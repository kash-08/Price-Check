import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={styles.closeText}>Close</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>{title}</ThemedText>
        <ThemedView style={{ width: 50 }} />
      </ThemedView>
      <WebView source={{ uri: url }} style={styles.webview} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeText: { color: '#2563eb', fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 15, fontWeight: '600', flex: 1, textAlign: 'center' },
  webview: { flex: 1 },
});