import CameraReact from '@/components/camera';
import HeaderReact from '@/components/header';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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
      
      // Obtener el email del usuario logueado
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
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <Text style={styles.welcomeTitle}>Documentos</Text>
            <Text style={styles.subtitle}>Sube las imágenes de tus documentos</Text>
          </View>

          <View style={styles.documentsContainer}>
            <View style={styles.documentSection}>
              <Text style={styles.documentTitle}>Documento 1</Text>
              
              {doc1 ? (
                <Image source={{ uri: doc1 }} style={styles.documentImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Seleccionar imagen</Text>
                </View>
              )}
              
              <View style={styles.buttonGroup}>
                <Pressable onPress={() => pickimage('doc1')} style={styles.imageButton}>
                  <Text style={styles.buttonText}>📁 Galería</Text>
                </Pressable>
                <Pressable onPress={() => takePhoto('doc1')} style={styles.imageButton}>
                  <Text style={styles.buttonText}>📷 Cámara</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.documentSection}>
              <Text style={styles.documentTitle}>Documento 2</Text>
              
              {doc2 ? (
                <Image source={{ uri: doc2 }} style={styles.documentImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Seleccionar imagen</Text>
                </View>
              )}
              
              <View style={styles.buttonGroup}>
                <Pressable onPress={() => pickimage('doc2')} style={styles.imageButton}>
                  <Text style={styles.buttonText}>📁 Galería</Text>
                </Pressable>
                <Pressable onPress={() => takePhoto('doc2')} style={styles.imageButton}>
                  <Text style={styles.buttonText}>📷 Cámara</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {error !== '' && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          {success !== '' && (
            <View style={styles.successContainer}>
              <Text style={styles.success}>{success}</Text>
            </View>
          )}

          <Pressable 
            onPress={saveDocuments} 
            style={[styles.submitButton, loading && styles.disabledButton]}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Guardando...' : '📥 Guardar Documentos'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  headerSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  documentsContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 30,
  },
  documentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B2CBF',
    marginBottom: 15,
    textAlign: 'center',
  },
  documentImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9D4EDD',
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F8F7FF',
    borderWidth: 2,
    borderColor: '#E0AAFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9D4EDD',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  imageButton: {
    backgroundColor: '#9D4EDD',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA5A5',
    marginBottom: 20,
  },
  error: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A5D6A7',
    marginBottom: 20,
  },
  success: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#9D4EDD',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});