import CameraReact from '@/components/camera';
import HeaderReact from '@/components/header';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;

export default function Documents() {
  const [showCamera, setShowCamera] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<'doc1' | 'doc2' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [doc1, setDoc1] = useState('');
  const [doc2, setDoc2] = useState('');
  
  const router = useRouter();

  async function pickimage(docType: 'doc1' | 'doc2') {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (docType === 'doc1') {
        setDoc1(base64Img);
      } else {
        setDoc2(base64Img);
      }
    }
  }

  function takePhoto(docType: 'doc1' | 'doc2') {
    setCurrentDoc(docType);
    setShowCamera(true);
  }

  function savePhoto(uri: string) {
    if (currentDoc === 'doc1') {
      setDoc1(uri);
    } else if (currentDoc === 'doc2') {
      setDoc2(uri);
    }
    setShowCamera(false);
    setCurrentDoc(null);
  }

  async function saveDocuments() {
    setError('');
    setSuccess('');
    
    if (!doc1 || !doc2) {
      setError('Debes seleccionar ambas imágenes');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('doc1', doc1);
      formData.append('doc2', doc2);
      
      let savedMail;
      if (Platform.OS === 'web') savedMail = localStorage.getItem('oldmail');
      else savedMail = await SecureStore.getItemAsync('oldmail');
      
      if (!savedMail) {
        setError('No hay usuario logueado');
        setLoading(false);
        return;
      }
      
      formData.append('mail', savedMail);

      console.log('Guardando documentos...');
      const response = await fetch('http://192.168.1.38:3031/saveDocuments', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.success) {
        setSuccess('Documentos guardados correctamente');
        setDoc1('');
        setDoc2('');
      } else {
        setError('Error al guardar documentos: ' + data.message);
      }
    } catch (error) {
      console.error('Error al guardar documentos:', error);
      setError('❌ Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <HeaderReact />
      
      {showCamera ? (
        <CameraReact onPicture={savePhoto} setShowCamera={setShowCamera} />
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerSection}>
              <Text style={styles.welcomeTitle}>Documentos</Text>
              <Text style={styles.subtitle}>Sube las imágenes de tus documentos</Text>
            </View>

            {/* Documento 1 - ARRIBA */}
            <View style={styles.documentSection}>
              <Text style={styles.documentTitle}>📄 Documento 1</Text>
              
              {doc1 ? (
                <Image source={{ uri: doc1 }} style={styles.documentImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Selecciona una imagen para el Documento 1</Text>
                </View>
              )}
              
              <View style={styles.buttonGroup}>
                <Pressable 
                  onPress={() => pickimage('doc1')} 
                  style={({ pressed }) => [
                    styles.imageButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text style={styles.buttonText}>📁 Galería</Text>
                </Pressable>
                <Pressable 
                  onPress={() => takePhoto('doc1')} 
                  style={({ pressed }) => [
                    styles.imageButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text style={styles.buttonText}>📷 Tomar Foto</Text>
                </Pressable>
              </View>
            </View>

            {/* Documento 2 - ABAJO */}
            <View style={[styles.documentSection, styles.secondDocument]}>
              <Text style={styles.documentTitle}>📄 Documento 2</Text>
              
              {doc2 ? (
                <Image source={{ uri: doc2 }} style={styles.documentImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Selecciona una imagen para el Documento 2</Text>
                </View>
              )}
              
              <View style={styles.buttonGroup}>
                <Pressable 
                  onPress={() => pickimage('doc2')} 
                  style={({ pressed }) => [
                    styles.imageButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text style={styles.buttonText}>📁 Galería</Text>
                </Pressable>
                <Pressable 
                  onPress={() => takePhoto('doc2')} 
                  style={({ pressed }) => [
                    styles.imageButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Text style={styles.buttonText}>📷 Tomar Foto</Text>
                </Pressable>
              </View>
            </View>

            {/* Mensajes de error/success */}
            {error !== '' && (
              <View style={styles.errorContainer}>
                <Text style={styles.error}>⚠️ {error}</Text>
              </View>
            )}

            {success !== '' && (
              <View style={styles.successContainer}>
                <Text style={styles.success}>✅ {success}</Text>
              </View>
            )}

            {/* Botón de Guardar - ABAJO DEL TODO */}
            <Pressable 
              onPress={saveDocuments} 
              style={({ pressed }) => [
                styles.submitButton, 
                loading && styles.disabledButton,
                pressed && styles.submitButtonPressed
              ]}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? '⏳ Guardando...' : '💾 Guardar Documentos'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: isWeb ? 20 : isMediumScreen ? 16 : 12,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: height,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  welcomeTitle: {
    fontSize: isWeb ? 26 : isMediumScreen ? 22 : 20,
    fontWeight: '700',
    color: '#7B2CBF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isWeb ? 16 : 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  documentSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: isWeb ? 24 : 20,
    alignItems: 'center',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0AAFF',
    marginBottom: 25,
    width: '100%',
  },
  secondDocument: {
    marginBottom: 30,
  },
  documentTitle: {
    fontSize: isWeb ? 20 : 18,
    fontWeight: '600',
    color: '#7B2CBF',
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
  documentImage: {
    width: '100%',
    maxWidth: 320,
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9D4EDD',
    marginBottom: 20,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    maxWidth: 320,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#F8F7FF',
    borderWidth: 2,
    borderColor: '#E0AAFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  placeholderText: {
    fontSize: isWeb ? 15 : 14,
    color: '#9D4EDD',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
    width: '100%',
    flexWrap: 'wrap',
  },
  imageButton: {
    backgroundColor: '#9D4EDD',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0AAFF',
    flex: 1,
    maxWidth: 200,
  },
  buttonPressed: {
    backgroundColor: '#7B2CBF',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: isWeb ? 15 : 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFA5A5',
    marginBottom: 20,
    width: '100%',
  },
  error: {
    fontSize: isWeb ? 15 : 14,
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A5D6A7',
    marginBottom: 20,
    width: '100%',
  },
  success: {
    fontSize: isWeb ? 15 : 14,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 'auto', // Esto empuja el botón hacia abajo
    marginBottom: 30,
    width: '100%',
    borderWidth: 2,
    borderColor: '#9D4EDD',
  },
  submitButtonPressed: {
    backgroundColor: '#6A1B9A',
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    backgroundColor: '#9D4EDD',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});