import { AppColors, AppRadius, AppSpacing } from '@/constants/appTheme';
import { setCurrentImageUri } from '@/utils/imageStore';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.permissionCenter}>
          <View style={styles.permissionIconCircle}>
            <Text style={styles.permissionIcon}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionSubtitle}>
            We use your camera to identify products and find you the best prices
          </Text>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            onPress={requestPermission}
          >
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </Pressable>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancelText}>Not now</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setCurrentImageUri(photo.uri);
      router.push('/result');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      </View>

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.frameContainer} pointerEvents="none">
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.hint}>Center the product or price tag in frame</Text>
        </View>

        <View style={styles.bottomBar}>
          <Pressable
            style={({ pressed }) => [
              styles.captureButton,
              pressed && styles.captureButtonPressed,
              capturing && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={capturing}
          >
            <View style={styles.captureButtonInner} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  camera: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: AppSpacing.lg,
    paddingTop: AppSpacing.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: AppRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  frameContainer: {
    alignItems: 'center',
    gap: AppSpacing.md,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: AppColors.accent,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  hint: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: AppRadius.full,
    overflow: 'hidden',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: AppSpacing.xl,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: AppRadius.full,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: AppRadius.full,
    backgroundColor: '#fff',
  },
  captureButtonPressed: {
    borderColor: 'rgba(255,255,255,0.7)',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  permissionCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: AppSpacing.lg,
    gap: AppSpacing.sm,
  },
  permissionIconCircle: {
    width: 72,
    height: 72,
    borderRadius: AppRadius.full,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppSpacing.sm,
  },
  permissionIcon: { fontSize: 32 },
  permissionTitle: { color: AppColors.text, fontSize: 20, fontWeight: '700' },
  permissionSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: AppSpacing.lg,
  },
  primaryButton: {
    backgroundColor: AppColors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: AppRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  buttonPressed: { opacity: 0.7 },
  cancelText: {
    color: AppColors.textMuted,
    fontSize: 14,
    marginTop: AppSpacing.sm,
  },
});