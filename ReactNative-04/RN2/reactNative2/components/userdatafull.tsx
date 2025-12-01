import CameraReact from '@/components/camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function UserDataFull({ sendData, inputData }:{sendData: (data: FormData) => Promise<number>, inputData: FormData})
{
    const [showCamera, setShowCamera] = useState(false);
    
    const [error, setError] = useState('');
    
    const [nombre, setNombre] = useState(inputData.get('nombre') as any || '');
    const [mail, setMail] = useState(inputData.get('mail') as any || '');
    const [password, setPassword] = useState('');
    const [oldpassword, setOldpassowrd] = useState('')
    const [telefono, setTelefono] = useState(inputData.get('telefono') as any || '');
    const [direccion, setDireccion] = useState(inputData.get('direccion') as any || '');
    const [imageurl, setImageurl] = useState(inputData.get('image') as any || '');

    const register = inputData.get('nombre')==null;
    const isGoogleUser = inputData.get('isGoogleUser') == 'true';

    function validar()
    {
        setError('');
        let valido = true;
        let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        let telRegex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
        let textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
        
        // Validaciones comunes para todos
        if(!textRegex.test(nombre) || nombre.length < 3)
        {
            valido = false;
            setError('Nombre Inválido');
        }
        if(!telRegex.test(telefono))
        {
            valido = false;
            setError('Telefono Invalido');
        }
        if(direccion.length < 6)
        {
            valido = false;
            setError('Direccion Invalida (Minimo 6 caracteres)');
        }
        if(imageurl.length < 1)
        {
            valido = false;
            setError('Ingresar Foto de Perfil');
        }
        
        // Solo validar email si NO es usuario de Google
        if(!isGoogleUser && !emailRegex.test(mail))
        {
            valido = false;
            setError('Email Inválido');
        }
        
        // Solo validar contraseñas si NO es usuario de Google
        if(!isGoogleUser) {
            if(!register && (oldpassword.length < 6 || oldpassword.length > 24))
            {
                valido = false;
                setError('Contraseña debe ser de al entre 6 y 24 caracteres');
            }
            if(password && (password.length < 6 || password.length > 24))
            {
                valido = false;
                setError('Contraseña debe ser de al entre 6 y 24 caracteres');
            }
        }
        
        return valido;
    }

    async function pickimage()
    {
        if(Platform.OS !== 'web') 
        {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if(status !== 'granted') return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [4, 4], 
            quality: 1, 
            base64: true,
        });
    
        if(!result.canceled) 
        {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImageurl(base64Img);
        }
    }
    
    function savePhoto(uri: React.SetStateAction<string>)
    {
        setImageurl(uri);
        setShowCamera(false);
    }

    async function send()
    {
        if(!validar()) return;
        
        try {
            const formData = new FormData();
            formData.append('image', imageurl);
            formData.append('nombre', nombre);
            
            // IMPORTANTE: Solo agregar password si NO es usuario de Google Y si hay password
            if (!isGoogleUser && password) {
                formData.append('password', password);
            }
            
            formData.append('mail', mail);
            formData.append('telefono', telefono);
            formData.append('direccion', direccion);
            
            // IMPORTANTE: Solo agregar oldpassword si NO es usuario de Google Y NO es registro
            if(!register && !isGoogleUser && oldpassword) {
                formData.append('oldpassword', oldpassword);
            }
            
            formData.append('isGoogleUser', isGoogleUser ? 'true' : 'false');

            console.log('Enviando datos...');
            console.log('isGoogleUser:', isGoogleUser);
            console.log('password field sent:', !isGoogleUser && password ? 'YES' : 'NO');
            console.log('oldpassword field sent:', (!register && !isGoogleUser && oldpassword) ? 'YES' : 'NO');
            
            const respuesta = await sendData(formData);
            console.log('Respuesta recibida:', respuesta);
            
            if(respuesta == 0) return;
            else if(respuesta == 1) setError('Nombre de usuario ocupado');
            else if(respuesta == 2) setError('Mail ocupado');
            else if(respuesta == 3) setError('Contraseña Incorrecta');
            else if(respuesta == 5) setError('Error: Usuario de Google no debe enviar contraseña');
            else setError('Error en el Registro, intentar de nuevo');
        } catch (error) {
            console.error('Error en send:', error);
            setError('Error de conexión. Intenta nuevamente.');
        }
    }

    return(
        <View>
            {showCamera ? (
                <CameraReact onPicture={savePhoto} setShowCamera={setShowCamera}/>
            ) : (
                Platform.OS === 'web' ? (
                    <View style={styles.webContainer}>
                        <Text style={styles.titulo}>{register ? 'Registro' : 'Editar Perfil'}</Text>
                        
                        {isGoogleUser && !register && (
                            <View style={styles.googleNotice}>
                                <Text style={styles.googleNoticeText}>Usuario de Google - No se requiere contraseña</Text>
                            </View>
                        )}
                        
                        <View style={styles.columnsContainer}>
                            <View style={styles.formColumn}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Nombre" 
                                    onChangeText={setNombre} 
                                    value={nombre}
                                    placeholderTextColor="#999"
                                />
                                {!isGoogleUser ? 
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Email" 
                                        onChangeText={setMail} 
                                        value={mail}
                                        placeholderTextColor="#999"
                                    /> 
                                    : <TextInput 
                                        style={[styles.input, styles.disabledInput]} 
                                        placeholder="Email (Google)" 
                                        value={mail}
                                        placeholderTextColor="#999"
                                        editable={false}
                                    />
                                }
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Telefono" 
                                    onChangeText={setTelefono} 
                                    value={telefono}
                                    placeholderTextColor="#999"
                                />
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Direccion" 
                                    onChangeText={setDireccion} 
                                    value={direccion}
                                    placeholderTextColor="#999"
                                />
                                
                                {/* Solo mostrar campos de contraseña si NO es usuario de Google */}
                                {!isGoogleUser && !register && (
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Contraseña Antigua (opcional)" 
                                        secureTextEntry={true} 
                                        onChangeText={setOldpassowrd} 
                                        value={oldpassword}
                                        placeholderTextColor="#999"
                                    />
                                )}
                                
                                {!isGoogleUser && (
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder={register ? "Contraseña (6-24 Caracteres)" : "Nueva Contraseña (opcional)"} 
                                        secureTextEntry={true} 
                                        onChangeText={setPassword} 
                                        value={password}
                                        placeholderTextColor="#999"
                                    />
                                )}
                            </View>
                            
                            <View style={styles.imageColumn}>
                                <Text style={styles.imageTitle}>Foto de Perfil</Text>
                                <View style={styles.imageButtons}>
                                    <Pressable onPress={pickimage} style={styles.imageButton}>
                                        <Text style={styles.imageButtonText}>📁 Galería</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setShowCamera(true)} style={styles.imageButton}>
                                        <Text style={styles.imageButtonText}>📷 Camara</Text>
                                    </Pressable>
                                </View>
                                {imageurl && (
                                    <Image source={{ uri: imageurl }} style={styles.imagenPreview} />
                                )}
                            </View>
                        </View>
                        
                        {error !== '' && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.error}>{error}</Text>
                            </View>
                        )}
                        
                        <Pressable onPress={send} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>{register ? 'Registrarse' : 'Guardar Cambios'}</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.mobileContainer}>
                        <Text style={styles.titulo}>{register ? 'Registro' : 'Editar Perfil'}</Text>
                        
                        {isGoogleUser && !register && (
                            <View style={styles.googleNotice}>
                                <Text style={styles.googleNoticeText}>Usuario de Google - No se requiere contraseña</Text>
                            </View>
                        )}
                        
                        <View style={styles.formColumn}>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Nombre" 
                                onChangeText={setNombre} 
                                value={nombre}
                                placeholderTextColor="#999"
                            />
                            {!isGoogleUser ? 
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Email" 
                                    onChangeText={setMail} 
                                    value={mail}
                                    placeholderTextColor="#999"
                                /> 
                                : <TextInput 
                                    style={[styles.input, styles.disabledInput]} 
                                    placeholder="Email (Google)" 
                                    value={mail}
                                    placeholderTextColor="#999"
                                    editable={false}
                                />
                            }
                            <TextInput 
                                style={styles.input} 
                                placeholder="Telefono" 
                                onChangeText={setTelefono} 
                                value={telefono}
                                placeholderTextColor="#999"
                            />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Direccion" 
                                onChangeText={setDireccion} 
                                value={direccion}
                                placeholderTextColor="#999"
                            />
                            
                            {/* Solo mostrar campos de contraseña si NO es usuario de Google */}
                            {!isGoogleUser && !register && (
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Contraseña Antigua (opcional)" 
                                    secureTextEntry={true} 
                                    onChangeText={setOldpassowrd} 
                                    value={oldpassword}
                                    placeholderTextColor="#999"
                                />
                            )}
                            
                            {!isGoogleUser && (
                                <TextInput 
                                    style={styles.input} 
                                    placeholder={register ? "Contraseña (6-24 Caracteres)" : "Nueva Contraseña (opcional)"} 
                                    secureTextEntry={true} 
                                    onChangeText={setPassword} 
                                    value={password}
                                    placeholderTextColor="#999"
                                />
                            )}
                            
                            <Text style={styles.imageTitle}>Foto de Perfil</Text>
                            <View style={styles.imageButtons}>
                                <Pressable onPress={pickimage} style={styles.imageButton}>
                                    <Text style={styles.imageButtonText}>📁 Galería</Text>
                                </Pressable>
                                <Pressable onPress={() => setShowCamera(true)} style={styles.imageButton}>
                                    <Text style={styles.imageButtonText}>📷 Camara</Text>
                                </Pressable>
                            </View>
                            {imageurl && (
                                <Image source={{ uri: imageurl }} style={styles.imagenPreview} />
                            )}
                        </View>
                        
                        {error !== '' && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.error}>{error}</Text>
                            </View>
                        )}
                        
                        <Pressable onPress={send} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>{register ? 'Registrarse' : 'Guardar Cambios'}</Text>
                        </Pressable>
                    </View>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  webContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  mobileContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0AAFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
    textAlign: 'center',
    marginBottom: 20,
  },
  googleNotice: {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4DABF7',
    marginBottom: 20,
  },
  googleNoticeText: {
    fontSize: 14,
    color: '#1864AB',
    textAlign: 'center',
    fontWeight: '500',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
    marginBottom: 20,
  },
  formColumn: {
    flex: 1,
  },
  imageColumn: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F8F7FF',
    width: '100%',
    height: 48,
    borderColor: '#E0AAFF',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#666',
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B2CBF',
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
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
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imagenPreview: {
    borderRadius: 12,
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#9D4EDD',
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA5A5',
    marginVertical: 20,
  },
  error: {
    fontSize: 14,
    color: '#D32F2F',
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
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});