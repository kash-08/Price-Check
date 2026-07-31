import { AppColors, AppRadius, AppSpacing } from '@/constants/appTheme';
import { setCurrentImageUri } from '@/utils/imageStore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCurrentImageUri(result.assets[0].uri);
        router.push('/result');
      }
    } catch (error) {
      console.log('ERROR in pickImage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI-POWERED</Text>
          </View>

          <Text style={styles.title}>Price Check</Text>
          <Text style={styles.subtitle}>
            Scan any product and instantly compare real prices across top stores
          </Text>

          <View style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/camera')}
            >
              <Text style={styles.primaryButtonText}>Scan in Store</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              onPress={pickImage}
            >
              <Text style={styles.primaryButtonText}>Upload Screenshot</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/history')}
            >
              <Text style={styles.secondaryButtonText}>View History</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: AppSpacing.lg,
  },
  badge: {
    backgroundColor: AppColors.accentMuted,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: AppRadius.full,
    alignSelf: 'flex-start',
    marginBottom: AppSpacing.md,
  },
  badgeText: {
    color: AppColors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: AppColors.text,
    fontSize: 40,
    fontWeight: '800',
    marginBottom: AppSpacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: AppColors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: AppSpacing.xxl,
  },
  buttonGroup: { gap: AppSpacing.sm },
  primaryButton: {
    backgroundColor: AppColors.accent,
    paddingVertical: 18,
    borderRadius: AppRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: AppRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    marginTop: AppSpacing.sm,
  },
  secondaryButtonText: {
    color: AppColors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});