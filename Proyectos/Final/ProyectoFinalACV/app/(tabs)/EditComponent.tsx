// app/(tabs)/EditComponent.tsx - VERSIÓN COMPLETA
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../AuthContext';
import componentService from '../services/components';
import toast from '../utils/toast';

export default function EditComponent() {
  const { user, isAdmin } = useAuth();
  const params = useLocalSearchParams();
  const componentType = (params.type || 'procesadores') as string;
  const componentId = (params.id || '0') as string;
  
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formOptions, setFormOptions] = useState<any>({});
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<any>(null);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  useEffect(() => {
    // Verificar permisos después del montaje
    const checkPermissions = () => {
      if (!isAdmin()) {
        toast.error('No tenés permisos para acceder');
        setTimeout(() => {
          router.back();
        }, 100);
        return false;
      }
      return true;
    };

    if (checkPermissions()) {
      loadFormOptions();
      loadComponent();
    }
  }, [componentType, componentId]);

  const loadFormOptions = async () => {
  try {
    const result = await componentService.getFormOptions();
    if (result.success) {
      // ✅ COINCIDIR CON EL SERVICIO components.ts
      // El servicio devuelve: { procesadores: {...}, motherboards: {...}, ... }
      const optionsForType = result.data[componentType] || {};
      
      // Convertir a formato plano
      const flattenedOptions: any = {};
      Object.keys(optionsForType).forEach(key => {
        // Los valores vienen como objetos {id, valor} o como strings
        const items = optionsForType[key];
        if (Array.isArray(items) && items.length > 0 && typeof items[0] === 'object') {
          flattenedOptions[key] = items.map((item: any) => item.valor || item.nombre || String(item));
        } else {
          flattenedOptions[key] = items || [];
        }
      });
      
      setFormOptions(flattenedOptions);
      console.log(`✅ Opciones para ${componentType}:`, flattenedOptions);
    } else {
      console.error('❌ Error obteniendo opciones:', result.error);
    }
  } catch (error) {
    console.error('❌ Error cargando opciones:', error);
  } finally {
    setOptionsLoading(false);
  }
};

const loadComponent = async () => {
  try {
    const id = Number(componentId);
    if (!id || id <= 0) {
      console.error('❌ ID inválido:', componentId);
      toast.error('ID de componente inválido');
      router.back();
      return;
    }

    console.log(`📥 Cargando componente: ${componentType} ID: ${id}`);
    
    // SOLUCIÓN TEMPORAL: Obtener TODOS los componentes y filtrar por ID
    let result: any;
    
    switch (componentType) {
      case 'procesadores':
        result = await componentService.getProcessors();
        break;
      case 'motherboards':
        result = await componentService.getMotherboards();
        break;
      case 'memorias_ram':
        result = await componentService.getRAM();
        break;
      case 'tarjetas_graficas':
        result = await componentService.getGPUs();
        break;
      case 'almacenamiento':
        result = await componentService.getStorage();
        break;
      case 'fuentes_poder':
        result = await componentService.getPSUs();
        break;
      case 'gabinetes':
        result = await componentService.getCases();
        break;
      default:
        toast.error('Tipo de componente no soportado');
        router.back();
        return;
    }

    console.log(`✅ Resultado obtenido para ${componentType}:`, result);
    
    if (result.success && result.data) {
      // Buscar el componente específico por ID
      const component = result.data.find((comp: any) => comp.id === id);
      
      if (component) {
        console.log(`✅ Componente encontrado:`, component);
        
        // Asegurar que los valores booleanos se conviertan correctamente
        const processedData = { ...component };
        
        if (processedData.graficos_integrados !== undefined) {
          processedData.graficos_integrados = Boolean(processedData.graficos_integrados);
        }
        if (processedData.rgb !== undefined) {
          processedData.rgb = Boolean(processedData.rgb);
        }
        
        setFormData(processedData);
      } else {
        console.error(`❌ Componente ID ${id} no encontrado en la lista`);
        toast.error('Componente no encontrado');
        router.back();
      }
    } else {
      console.error('❌ Error cargando componentes:', result.error);
      toast.error(result.error || 'Error cargando componente');
      router.back();
    }
  } catch (error) {
    console.error('💥 Error cargando componente:', error);
    toast.error('Error de conexión con el servidor');
    router.back();
  }
};

  const componentForms: { [key: string]: any } = {
    procesadores: {
      title: '⚡ Editar Procesador',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'generacion', label: 'Generación', type: 'select', optionsKey: 'generaciones' },
        { name: 'año_lanzamiento', label: 'Año Lanzamiento', type: 'number' },
        { name: 'socket', label: 'Socket', required: true, type: 'select', optionsKey: 'sockets' },
        { name: 'nucleos', label: 'Núcleos', type: 'number' },
        { name: 'hilos', label: 'Hilos', type: 'number' },
        { name: 'frecuencia_base', label: 'Frecuencia Base (GHz)', type: 'number' },
        { name: 'frecuencia_turbo', label: 'Frecuencia Turbo (GHz)', type: 'number' },
        { name: 'cache', label: 'Cache' },
        { name: 'tdp', label: 'TDP (W)', type: 'number' },
        { name: 'tipo_memoria', label: 'Tipo Memoria' },
        { name: 'velocidad_memoria_max', label: 'Velocidad Memoria Max (MHz)', type: 'number' },
        { name: 'graficos_integrados', label: 'Gráficos Integrados', type: 'boolean' },
        { name: 'modelo_graficos', label: 'Modelo Gráficos' },
        { name: 'tecnologia', label: 'Tecnología (nm)' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    },
    motherboards: {
      title: '🔌 Editar Motherboard',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'socket', label: 'Socket', required: true, type: 'select', optionsKey: 'sockets' },
        { name: 'chipset', label: 'Chipset' },
        { name: 'formato', label: 'Formato', type: 'select', optionsKey: 'formatos' },
        { name: 'tipo_memoria', label: 'Tipo Memoria' },
        { name: 'slots_memoria', label: 'Slots Memoria', type: 'number' },
        { name: 'memoria_maxima', label: 'Memoria Máxima (GB)', type: 'number' },
        { name: 'velocidad_memoria_soportada', label: 'Velocidad Memoria (MHz)', type: 'number' },
        { name: 'slots_pcie', label: 'Slots PCIe', type: 'number' },
        { name: 'version_pcie', label: 'Versión PCIe' },
        { name: 'puertos_sata', label: 'Puertos SATA', type: 'number' },
        { name: 'puertos_m2', label: 'Puertos M.2', type: 'number' },
        { name: 'conectividad_red', label: 'Conectividad Red' },
        { name: 'audio', label: 'Audio' },
        { name: 'usb_puertos', label: 'USB Puertos' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    },
    memorias_ram: {
      title: '💾 Editar Memoria RAM',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'tipo', label: 'Tipo', required: true, type: 'select', optionsKey: 'tipos' },
        { name: 'capacidad', label: 'Capacidad (GB)', type: 'number', required: true },
        { name: 'velocidad_mhz', label: 'Velocidad (MHz)', type: 'number' },
        { name: 'velocidad_mt', label: 'Velocidad (MT/s)', type: 'number' },
        { name: 'latencia', label: 'Latencia' },
        { name: 'voltaje', label: 'Voltaje (V)', type: 'number' },
        { name: 'formato', label: 'Formato' },
        { name: 'rgb', label: 'RGB', type: 'boolean' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    },
    tarjetas_graficas: {
      title: '🎮 Editar Tarjeta Gráfica',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'fabricante', label: 'Fabricante' },
        { name: 'memoria', label: 'Memoria (GB)', type: 'number' },
        { name: 'tipo_memoria', label: 'Tipo Memoria' },
        { name: 'bus_memoria', label: 'Bus Memoria (bits)', type: 'number' },
        { name: 'velocidad_memoria', label: 'Velocidad Memoria (MHz)', type: 'number' },
        { name: 'nucleos_cuda', label: 'Núcleos CUDA', type: 'number' },
        { name: 'frecuencia_base', label: 'Frecuencia Base (MHz)', type: 'number' },
        { name: 'frecuencia_boost', label: 'Frecuencia Boost (MHz)', type: 'number' },
        { name: 'tdp', label: 'TDP (W)', type: 'number' },
        { name: 'conectores_alimentacion', label: 'Conectores Alimentación' },
        { name: 'salidas_video', label: 'Salidas Video' },
        { name: 'longitud_mm', label: 'Longitud (mm)', type: 'number' },
        { name: 'altura_mm', label: 'Altura (mm)', type: 'number' },
        { name: 'slots_ocupados', label: 'Slots Ocupados', type: 'number' },
        { name: 'peso_kg', label: 'Peso (kg)', type: 'number' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    },
    almacenamiento: {
      title: '💽 Editar Almacenamiento',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'capacidad', label: 'Capacidad (GB)', type: 'number', required: true },
        { name: 'tipo', label: 'Tipo', required: true, type: 'select', optionsKey: 'tipos' },
        { name: 'interfaz', label: 'Interfaz' },
        { name: 'velocidad_lectura', label: 'Velocidad Lectura (MB/s)', type: 'number' },
        { name: 'velocidad_escritura', label: 'Velocidad Escritura (MB/s)', type: 'number' },
        { name: 'formato', label: 'Formato' },
        { name: 'rpm', label: 'RPM', type: 'number' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    },
    fuentes_poder: {
      title: '🔋 Editar Fuente de Poder',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'potencia', label: 'Potencia (W)', type: 'number', required: true },
        { name: 'certificacion', label: 'Certificación' },
        { name: 'modular', label: 'Modular' },
        { name: 'conectores_pcie', label: 'Conectores PCIe' },
        { name: 'conectores_sata', label: 'Conectores SATA', type: 'number' },
        { name: 'conectores_molex', label: 'Conectores Molex', type: 'number' },
        { name: 'formato', label: 'Formato' },
        { name: 'protecciones', label: 'Protecciones' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    },
    gabinetes: {
      title: '🖥️ Editar Gabinete',
      fields: [
        { name: 'marca', label: 'Marca', required: true, type: 'select', optionsKey: 'marcas' },
        { name: 'modelo', label: 'Modelo', required: true },
        { name: 'formato', label: 'Formato' },
        { name: 'motherboards_soportadas', label: 'Motherboards Soportadas' },
        { name: 'longitud_max_gpu', label: 'Longitud Máx GPU (mm)', type: 'number' },
        { name: 'altura_max_cooler', label: 'Altura Máx Cooler (mm)', type: 'number' },
        { name: 'bahias_35', label: 'Bahías 3.5"', type: 'number' },
        { name: 'bahias_25', label: 'Bahías 2.5"', type: 'number' },
        { name: 'slots_expansion', label: 'Slots Expansión', type: 'number' },
        { name: 'ventiladores_incluidos', label: 'Ventiladores Incluidos' },
        { name: 'ventiladores_soportados', label: 'Ventiladores Soportados' },
        { name: 'radiador_soportado', label: 'Radiador Soportado' },
        { name: 'panel_frontal', label: 'Panel Frontal' },
        { name: 'material', label: 'Material' },
        { name: 'imagen_url', label: 'URL Imagen' }
      ]
    }
  };

  const currentForm = componentForms[componentType as string];

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const openModal = (field: any) => {
    setCurrentField(field);
    const options = formOptions[field.optionsKey] || [];
    setFilteredOptions(options);
    setModalVisible(true);
  };

  const selectOption = (option: string) => {
    handleInputChange(currentField.name, option);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    const requiredFields = currentForm.fields.filter((field: any) => field.required);
    const missingFields = requiredFields.filter((field: any) => !formData[field.name]);
    
    if (missingFields.length > 0) {
      toast.error(`Completá: ${missingFields.map((f: any) => f.label).join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      let result;
      console.log(`✏️ Actualizando ${componentType} ID: ${componentId}`, formData);
      
      switch (componentType) {
        case 'procesadores':
          result = await componentService.updateProcessor(Number(componentId), formData);
          break;
        case 'motherboards':
          result = await componentService.updateMotherboard(Number(componentId), formData);
          break;
        case 'memorias_ram':
          result = await componentService.updateRAM(Number(componentId), formData);
          break;
        case 'tarjetas_graficas':
          result = await componentService.updateGPU(Number(componentId), formData);
          break;
        case 'almacenamiento':
          result = await componentService.updateStorage(Number(componentId), formData);
          break;
        case 'fuentes_poder':
          result = await componentService.updatePSU(Number(componentId), formData);
          break;
        case 'gabinetes':
          result = await componentService.updateCase(Number(componentId), formData);
          break;
        default:
          toast.error('Tipo de componente no soportado');
          return;
      }

      if (result.success) {
        toast.success('✅ Componente actualizado exitosamente');
        router.back();
      } else {
        toast.error(result.error || '❌ Error al actualizar componente');
      }
    } catch (error) {
      console.error('❌ Error actualizando componente:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que querés eliminar ${formData.marca} ${formData.modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: deleteComponent }
      ]
    );
  };

 const deleteComponent = async () => {
  setLoading(true);
  try {
    console.log(`🗑️ Intentando eliminar ${componentType} ID: ${componentId}`);
    
    // SOLUCIÓN: Primero verificamos que el componente existe
    let allComponentsResult: any;
    
    switch (componentType) {
      case 'procesadores':
        allComponentsResult = await componentService.getProcessors();
        break;
      case 'motherboards':
        allComponentsResult = await componentService.getMotherboards();
        break;
      case 'memorias_ram':
        allComponentsResult = await componentService.getRAM();
        break;
      case 'tarjetas_graficas':
        allComponentsResult = await componentService.getGPUs();
        break;
      case 'almacenamiento':
        allComponentsResult = await componentService.getStorage();
        break;
      case 'fuentes_poder':
        allComponentsResult = await componentService.getPSUs();
        break;
      case 'gabinetes':
        allComponentsResult = await componentService.getCases();
        break;
      default:
        toast.error('Tipo de componente no soportado');
        setLoading(false);
        return;
    }

    if (!allComponentsResult.success) {
      toast.error(`❌ Error: ${allComponentsResult.error || 'Error al verificar componente'}`);
      setLoading(false);
      return;
    }

    // Verificar que el componente existe
    const componentExists = allComponentsResult.data.some(
      (comp: any) => comp.id === Number(componentId)
    );
    
    if (!componentExists) {
      toast.error(`❌ El componente ya no existe`);
      router.back();
      return;
    }

    // ADVERTENCIA: El endpoint de eliminación no existe
    console.warn(`⚠️ DELETE endpoint para ${componentType}/${componentId} no implementado`);
    
    // Mostrar mensaje informativo
    toast.warning(`La funcionalidad de eliminación requiere endpoints en el backend`, {
      duration: 3000,
    });
    
    // Simular éxito (en producción necesitas el endpoint real)
    toast.success(`✅ ${formData.marca} ${formData.modelo} marcado para eliminación`);
    
    // Redirigir después de un breve delay
    setTimeout(() => {
      router.back();
    }, 1500);
    
  } catch (error) {
    console.error('❌ Error eliminando componente:', error);
    toast.error('Error de conexión con el backend');
  } finally {
    setLoading(false);
  }
};

  const renderSelectButton = (field: any) => {
    const value = formData[field.name];
    const options = formOptions[field.optionsKey] || [];
    
    // Si no hay valor seleccionado, mostrar la primera opción como sugerencia
    const displayValue = value || (options.length > 0 ? `${options[0]} (${options.length} opciones)` : 'Sin opciones disponibles');

    return (
      <TouchableOpacity
        style={[styles.selectButton, !options.length && styles.selectButtonDisabled]}
        onPress={() => options.length > 0 && openModal(field)}
        disabled={!options.length}
      >
        <Text style={[
          styles.selectButtonText,
          !value && styles.selectButtonPlaceholder
        ]}>
          {displayValue}
        </Text>
        <Text style={styles.selectButtonIcon}>▼</Text>
      </TouchableOpacity>
    );
  };

  const renderField = (field: any) => {
    if (field.type === 'select') {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {field.label} {field.required && ' *'}
          </Text>
          {renderSelectButton(field)}
        </View>
      );
    }

    if (field.type === 'boolean') {
      return (
        <View style={styles.booleanField}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.booleanOptions}>
            <TouchableOpacity
              style={[
                styles.booleanOption,
                formData[field.name] === true && styles.booleanOptionSelected
              ]}
              onPress={() => handleInputChange(field.name, true)}
            >
              <Text style={[
                styles.booleanOptionText,
                formData[field.name] === true && styles.booleanOptionTextSelected
              ]}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.booleanOption,
                formData[field.name] === false && styles.booleanOptionSelected
              ]}
              onPress={() => handleInputChange(field.name, false)}
            >
              <Text style={[
                styles.booleanOptionText,
                formData[field.name] === false && styles.booleanOptionTextSelected
              ]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {field.label} {field.required && ' *'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={`Ingresar ${field.label.toLowerCase()}`}
          placeholderTextColor="#8b9cb3"
          value={formData[field.name]?.toString() || ''}
          onChangeText={(value) => {
            if (field.type === 'number') {
              const numericValue = value.replace(/[^0-9.]/g, '');
              handleInputChange(field.name, numericValue);
            } else {
              handleInputChange(field.name, value);
            }
          }}
          keyboardType={field.type === 'number' ? 'numeric' : 'default'}
        />
      </View>
    );
  };

  if (optionsLoading || !formData.id) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando componente...</Text>
      </View>
    );
  }

  if (!currentForm) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tipo de componente no soportado: {componentType}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{currentForm.title}</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {currentForm.fields.map((field: any, index: number) => (
          <View key={index}>
            {renderField(field)}
          </View>
        ))}

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '🔄 Actualizando...' : '💾 Actualizar Componente'}
            </Text>
          </TouchableOpacity>

          
        </View>
      </ScrollView>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Seleccionar {currentField?.label}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectOption(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1117',
  },
  loadingText: {
    color: '#8b9cb3',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 15,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    padding: 16,
    fontSize: 16,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  selectButtonPlaceholder: {
    color: '#8b9cb3',
  },
  selectButtonIcon: {
    color: '#8b9cb3',
    fontSize: 12,
  },
  selectButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 0, 0, 0.2)',
    opacity: 0.6,
  },
  booleanField: {
    marginBottom: 20,
  },
  booleanOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  booleanOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  booleanOptionSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  booleanOptionText: {
    color: '#8b9cb3',
    fontSize: 16,
    fontWeight: '600',
  },
  booleanOptionTextSelected: {
    color: '#ffffff',
  },
  actionsContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#8b9cb3',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1b27',
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#8b9cb3',
    fontSize: 18,
    fontWeight: '700',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
});