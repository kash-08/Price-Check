import { StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { setCurrentImageUri } from '@/utils/imageStore';

export default function HomeScreen() {
  const pickImage = async () => {
    try {
      console.log('Button pressed, requesting permission...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);
      if (!permissionResult.granted) {
        console.log('Gallery permission denied');
        return;
      }
      console.log('Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      console.log('Picker result canceled:', result.canceled);
      if (!result.canceled) {
        setCurrentImageUri(result.assets[0].uri);
        router.push('/result');
      }
    } catch (error) {
      console.log('ERROR in pickImage:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Price Check
        </ThemedText>
        <ThemedText type="small" style={styles.subtitle}>
          Scan a product or upload a screenshot to check the price
        </ThemedText>
        <ThemedView style={styles.buttonGroup}>
          <Pressable style={styles.button} onPress={() => router.push('/camera')}>
            <ThemedText style={styles.buttonText}>Scan in Store</ThemedText>
          </Pressable>
          <Pressable style={styles.button} onPress={pickImage}>
            <ThemedText style={styles.buttonText}>Upload Screenshot</ThemedText>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/history')}>
            <ThemedText style={styles.secondaryButtonText}>View History</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: { marginBottom: 4 },
  subtitle: { textAlign: 'center', marginBottom: 32, opacity: 0.7 },
  buttonGroup: { width: '100%', gap: 16 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: {
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#2563eb',
},
secondaryButtonText: {
  color: '#2563eb',
  fontWeight: '600',
  fontSize: 16,
},
  
});