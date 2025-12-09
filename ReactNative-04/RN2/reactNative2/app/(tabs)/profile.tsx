import HeaderReact from "@/components/header";
import UserDataFull from "@/components/userdatafull";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Profile() {
    const [oldmail, setOldMail] = useState('');
    const [mail, setMail] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [imageurl, setImageurl] = useState('');
    const [isGoogleUser, setGoogle] = useState(false);
    const [formDatausu, setFormDatausu] = useState<FormData | null>(null);
    const [doc1, setDoc1] = useState('');
    const [doc2, setDoc2] = useState('');
    const [tipo, setTipo] = useState(true);
    const router = useRouter();

    useEffect(() => {
      (async () => {
        let savedMail;
        if(Platform.OS === 'web') savedMail = localStorage.getItem('oldmail');
        else savedMail = await SecureStore.getItemAsync('oldmail');
        if (!savedMail) 
        {
          router.replace('/');
          return;
        }
        setOldMail(savedMail);

        // Obtener datos del usuario
        fetch('http://192.168.1.38:3031/getData',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mail: savedMail })
        }).then(response => response.json()).then(async data => {
          setNombre(data[0].nombre);
          setTelefono(data[0].telefono);
          setDireccion(data[0].direccion);
          setImageurl(data[0].foto);
          setMail(data[0].mail);
          setGoogle(!!data[0].isGoogleUser);

          const fullImageUrl = 'http://192.168.1.38:3031/' + data[0].foto.replace('./', '');

          try 
          {
            const response = await fetch(fullImageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = () => {
              if(reader.result && typeof reader.result === 'string') 
              {
                const base64data = reader.result.split(',')[1];
                const newForm = new FormData();
                newForm.append('image', `data:image/jpeg;base64,${base64data}`);
                newForm.append('nombre', data[0].nombre);
                newForm.append('mail', data[0].mail);
                newForm.append('telefono', data[0].telefono);
                newForm.append('direccion', data[0].direccion);
                newForm.append('isGoogleUser', !!data[0].isGoogleUser + '');
                console.log('Imagen convertida correctamente a base64');
                setFormDatausu(newForm);
              }
            };
            reader.readAsDataURL(blob);
            } catch (error) {
              console.error('Error convirtiendo imagen a base64:', error);
            }
        });

        // Obtener documentos del usuario
        fetch('http://192.168.1.38:3031/getDocuments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mail: savedMail })
        }).then(response => response.json()).then(docs => {
          if (docs) {
            setDoc1(docs.documento1 || '');
            setDoc2(docs.documento2 || '');
          }
        });
      })();
    }, []);

    async function editProfile(formData : FormData) : Promise<number>
    {
      formData.append('oldmail', oldmail as string);
      formData.append('isGoogleUser', isGoogleUser + '');
      const response = await fetch('http://192.168.1.38:3031/editUsuario',{
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if(data == 0)
      {
        router.push({
        pathname: "/profile",
          params: { oldmail: formData.get('mail') as any},
        });
      }
      return data as number;
    }

    return (
        <View style={styles.screen}> 
          <HeaderReact />
          <View style={styles.container}>
            {tipo ? (
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <Image
                    style={styles.imagen}
                    source={{ uri: 'http://192.168.1.38:3031/' + imageurl.replace('./', '') }}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.nombre}>{nombre || 'Nombre'}</Text>
                    <Text style={styles.email}>{mail || 'Mail'}</Text>
                    {isGoogleUser && (
                      <View style={styles.googleBadge}>
                        <Text style={styles.googleBadgeText}>Google</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{telefono || 'Telefono'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Dirección:</Text>
                    <Text style={styles.infoValue}>{direccion || 'Direccion'}</Text>
                  </View>
                </View>

                {/* Mostrar documentos si existen */}
                {(doc1 || doc2) && (
                  <View style={styles.documentsSection}>
                    <Text style={styles.documentsTitle}>Documentos:</Text>
                    <View style={styles.documentsContainer}>
                      {doc1 && (
                        <Image
                          style={styles.documentImage}
                          source={{ uri: 'http://192.168.1.38:3031/' + doc1.replace('./', '') }}
                        />
                      )}
                      {doc2 && (
                        <Image
                          style={styles.documentImage}
                          source={{ uri: 'http://192.168.1.38:3031/' + doc2.replace('./', '') }}
                        />
                      )}
                    </View>
                  </View>
                )}

                <Pressable onPress={() => {setTipo(false)}} style={styles.editButton}>
                  <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formCard}>
                <UserDataFull sendData={editProfile} inputData={formDatausu as FormData}/>
                <Pressable onPress={() => {setTipo(true)}} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>← Volver al Perfil</Text>
                </Pressable>
              </View>
            )}
          </View>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagen: {
    borderRadius: 12,
    width: 80,
    height: 80,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#9D4EDD',
  },
  profileInfo: {
    flex: 1,
  },
  nombre: {
    color: '#4A4A4A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#7B2CBF',
    fontSize: 14,
    marginBottom: 8,
  },
  googleBadge: {
    backgroundColor: '#E0AAFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  googleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7B2CBF',
  },
  infoSection: {
    backgroundColor: '#F8F7FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    color: '#4A4A4A',
    fontSize: 14,
    flex: 1,
  },
  documentsSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0AAFF',
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B2CBF',
    marginBottom: 10,
    textAlign: 'center',
  },
  documentsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  documentImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9D4EDD',
  },
  editButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#9D4EDD',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});