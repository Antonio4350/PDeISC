import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CameraReact({ onPicture, setShowCamera }: {
  onPicture: (uri: string) => void;
  setShowCamera: (value: boolean) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [camType, setCameraType] = useState<'front' | 'back'>('front');
  const cameraRef = useRef<CameraView>(null);

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPicture(photo.uri);
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Solicitando permiso...</Text>
      </View>
    );
  }

  return (
    permission.granted ? (
      <View style={Platform.OS !== 'web' ? styles.cameraContainerMobile : styles.cameraContainer}>
        <View style={styles.cameraHeader}>
          <Text style={styles.cameraTitle}>Tomar Foto</Text>
          <Text style={styles.cameraSubtitle}>Sonríe para la cámara 📸</Text>
        </View>

        <CameraView
          style={styles.camera}
          ref={cameraRef}
          ratio="1:1"
          facing={camType}
        />

        <View style={styles.cameraControls}>
          <Pressable
            style={styles.controlButton}
            onPress={() => setCameraType(camType === 'front' ? 'back' : 'front')}
          >
            <Text style={styles.controlButtonText}>🔄 Cambiar</Text>
          </Pressable>

          <Pressable style={styles.shutterButton} onPress={takePicture}>
            <View style={styles.shutterInner} />
          </Pressable>

          <Pressable style={styles.controlButton} onPress={() => setShowCamera(false)}>
            <Text style={styles.controlButtonText}>✖ Cancelar</Text>
          </Pressable>
        </View>
      </View>
    ) : (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Permiso de Cámara</Text>
        <Text style={styles.permissionText}>
          Necesitamos acceso a tu cámara para tomar fotos de perfil
        </Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
        </Pressable>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraContainerMobile: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cameraHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cameraSubtitle: {
    fontSize: 14,
    color: '#E0AAFF',
    textAlign: 'center',
  },
  camera: {
    width: Platform.OS === 'web' ? 400 : '90%',
    aspectRatio: 1,
    borderRadius: Platform.OS === 'web' ? 20 : 0,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#7B2CBF',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0AAFF',
    minWidth: 100,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#7B2CBF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7B2CBF',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F8F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B2CBF',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0AAFF',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});