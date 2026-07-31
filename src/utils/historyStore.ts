import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'scan_history';

export type ScanEntry = {
  id: string;
  product: string;
  verdict: string;
  listedPrice: string | null;
  deals: { site: string; price: string; note?: string }[];
  tips: string[];
  timestamp: number;
};

export async function saveScan(entry: Omit<ScanEntry, 'id' | 'timestamp'>) {
  const newEntry: ScanEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };

  const existing = await getHistory();
  const updated = [newEntry, ...existing]; // newest first
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function getHistory(): Promise<ScanEntry[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}