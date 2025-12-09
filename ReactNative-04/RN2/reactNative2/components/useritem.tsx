import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';

export default function UserItem({ userData }: { userData: FormData }) {
  const hasDocuments = userData.get('documento1') || userData.get('documento2');
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  return (
    <View style={[styles.card, isMobile && styles.cardMobile]}>
      <Image
        style={[styles.imagen, isMobile && styles.imagenMobile]}
        source={{ uri: 'http://192.168.1.38:3031/' + userData.get('foto') }}
      />
      
      <Text style={[styles.nombre, isMobile && styles.nombreMobile]}>{userData.get('nombre') as any}</Text>
      <Text style={[styles.posicion, isMobile && styles.posicionMobile]}>{userData.get('mail') as any}</Text>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.equipoInfo, isMobile && styles.equipoInfoMobile]}>📱 {userData.get('telefono') as any}</Text>
        <Text style={[styles.equipoInfo, isMobile && styles.equipoInfoMobile]}>📍 {userData.get('direccion') as any}</Text>
      </View>
      
      {/* Sección de documentos */}
      {hasDocuments && (
        <View style={[styles.documentsSection, isMobile && styles.documentsSectionMobile]}>
          <Text style={[styles.documentsTitle, isMobile && styles.documentsTitleMobile]}>Documentos:</Text>
          <View style={[styles.documentsContainer, isMobile && styles.documentsContainerMobile]}>
            {userData.get('documento1') && (
              <Image
                style={[styles.documentImage, isMobile && styles.documentImageMobile]}
                source={{ uri: 'http://192.168.1.38:3031/' + userData.get('documento1') }}
              />
            )}
            {userData.get('documento2') && (
              <Image
                style={[styles.documentImage, isMobile && styles.documentImageMobile]}
                source={{ uri: 'http://192.168.1.38:3031/' + userData.get('documento2') }}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 18 : 16,
    padding: Platform.OS === 'web' ? 22 : 18,
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 16 : 14,
    width: Platform.OS === 'web' ? '46%' : '100%',
    maxWidth: Platform.OS === 'web' ? 300 : 400,
    minHeight: Platform.OS === 'web' ? 260 : 220,
    shadowColor: '#7B2CBF',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: Platform.OS === 'web' ? 5 : 3 },
    shadowRadius: Platform.OS === 'web' ? 10 : 8,
    elevation: Platform.OS === 'web' ? 8 : 6,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  cardMobile: {
    width: '100%',
    minHeight: 220,
    padding: 18,
  },
  imagen: {
    borderRadius: Platform.OS === 'web' ? 14 : 12,
    width: Platform.OS === 'web' ? 85 : 70,
    height: Platform.OS === 'web' ? 85 : 70,
    marginBottom: Platform.OS === 'web' ? 12 : 10,
    borderWidth: 2,
    borderColor: '#9D4EDD',
  },
  imagenMobile: {
    width: 70,
    height: 70,
  },
  nombre: {
    color: '#4A4A4A',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
  },
  nombreMobile: {
    fontSize: 14,
  },
  posicion: {
    color: '#7B2CBF',
    fontSize: Platform.OS === 'web' ? 13 : 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 10 : 8,
  },
  posicionMobile: {
    fontSize: 11,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 12 : 10,
  },
  equipoInfo: {
    color: '#9D4EDD',
    fontSize: Platform.OS === 'web' ? 12 : 10,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  equipoInfoMobile: {
    fontSize: 10,
  },
  documentsSection: {
    width: '100%',
    marginTop: Platform.OS === 'web' ? 12 : 10,
    paddingTop: Platform.OS === 'web' ? 12 : 10,
    borderTopWidth: 1,
    borderTopColor: '#E0AAFF',
  },
  documentsSectionMobile: {
    marginTop: 10,
    paddingTop: 10,
  },
  documentsTitle: {
    fontSize: Platform.OS === 'web' ? 12 : 10,
    fontWeight: 'bold',
    color: '#7B2CBF',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 8 : 6,
  },
  documentsTitleMobile: {
    fontSize: 10,
  },
  documentsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Platform.OS === 'web' ? 12 : 8,
  },
  documentsContainerMobile: {
    gap: 8,
  },
  documentImage: {
    width: Platform.OS === 'web' ? 60 : 50,
    height: Platform.OS === 'web' ? 50 : 40,
    borderRadius: Platform.OS === 'web' ? 8 : 6,
    borderWidth: 1,
    borderColor: '#9D4EDD',
  },
  documentImageMobile: {
    width: 50,
    height: 40,
    borderRadius: 6,
  },
});