// app/(tabs)/AddComponent.tsx - COMPLETAMENTE ACTUALIZADO CON TODOS LOS COMPONENTES
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
  FlatList
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../AuthContext';
import componentService from '../services/components';
import toast from '../utils/toast';

export default function AddComponent() {
  const { user, isAdmin } = useAuth();
  const params = useLocalSearchParams();
  const componentType = params.type as string;
  
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formOptions, setFormOptions] = useState<any>({});
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<any>(null);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // Verificar permisos de admin
  React.useEffect(() => {
    if (!isAdmin()) {
      toast.error('No tenés permisos para acceder');
      router.back();
    }
  }, []);
  
  React.useEffect(() => {
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
    }
  }, []);

  const loadFormOptions = async () => {
    try {
      const result = await componentService.getFormOptions();
      if (result.success) {
        setFormOptions(result.data);
      }
    } catch (error) {
      console.error('Error cargando opciones:', error);
    } finally {
      setOptionsLoading(false);
    }
  };

  // Función para mapear y convertir datos
  const mapFormDataToAPI = (formData: any, componentType: string) => {
    const mappedData: any = { ...formData };
    
    // Convertir strings a números donde sea necesario
    const numericFields = [
      'nucleos', 'hilos', 'tdp', 'año_lanzamiento', 'velocidad_memoria_max',
      'frecuencia_base', 'frecuencia_turbo', 'capacidad', 'velocidad_mhz',
      'velocidad_mt', 'voltaje', 'slots_memoria', 'memoria_maxima',
      'velocidad_memoria_soportada', 'slots_pcie', 'puertos_sata', 'puertos_m2',
      'memoria', 'bus_memoria', 'velocidad_memoria', 'nucleos_cuda',
      'frecuencia_base', 'frecuencia_boost', 'longitud_mm', 'altura_mm',
      'slots_ocupados', 'peso_kg', 'potencia', 'conectores_sata', 'conectores_molex',
      'longitud_max_gpu', 'altura_max_cooler', 'bahias_35', 'bahias_25', 'slots_expansion'
    ];

    numericFields.forEach(field => {
      if (mappedData[field] && typeof mappedData[field] === 'string') {
        if (field.includes('frecuencia') || field === 'voltaje') {
          mappedData[field] = parseFloat(mappedData[field]);
        } else {
          mappedData[field] = parseInt(mappedData[field]);
        }
      }
    });

    return mappedData;
  };

  const componentForms: { [key: string]: any } = {
    procesadores: {
      title: '⚡ Agregar Procesador',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'i9-13900K, Ryzen 9 7950X'
        },
        { 
          name: 'generacion', 
          label: 'Generación', 
          placeholder: 'Seleccionar generación',
          type: 'select',
          optionsKey: 'generaciones'
        },
        { 
          name: 'año_lanzamiento', 
          label: 'Año Lanzamiento', 
          placeholder: 'Seleccionar año',
          type: 'select',
          optionsKey: 'años'
        },
        { 
          name: 'socket', 
          label: 'Socket', 
          required: true, 
          placeholder: 'Seleccionar socket',
          type: 'select',
          optionsKey: 'sockets'
        },
        { 
          name: 'nucleos', 
          label: 'Núcleos', 
          type: 'number', 
          placeholder: '24'
        },
        { 
          name: 'hilos', 
          label: 'Hilos', 
          type: 'number', 
          placeholder: '32'
        },
        { 
          name: 'frecuencia_base', 
          label: 'Frecuencia Base (GHz)', 
          type: 'number', 
          placeholder: '3.5'
        },
        { 
          name: 'frecuencia_turbo', 
          label: 'Frecuencia Turbo (GHz)', 
          type: 'number', 
          placeholder: '5.8'
        },
        { 
          name: 'cache', 
          label: 'Cache', 
          placeholder: '36MB'
        },
        { 
          name: 'tdp', 
          label: 'TDP (W)', 
          type: 'number', 
          placeholder: '125'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Seleccionar tipo',
          type: 'select',
          optionsKey: 'memoryTypes'
        },
        { 
          name: 'velocidad_memoria_max', 
          label: 'Velocidad Memoria Max (MHz)', 
          type: 'number', 
          placeholder: '5600'
        },
        { 
          name: 'graficos_integrados', 
          label: 'Gráficos Integrados', 
          type: 'boolean'
        },
        { 
          name: 'modelo_graficos', 
          label: 'Modelo Gráficos', 
          placeholder: 'UHD Graphics, Radeon Graphics'
        },
        { 
          name: 'tecnologia', 
          label: 'Tecnología (nm)', 
          placeholder: 'Seleccionar tecnología',
          type: 'select',
          optionsKey: 'tecnologias'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    },
    motherboards: {
      title: '🔌 Agregar Motherboard',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'ROG STRIX Z790-E'
        },
        { 
          name: 'socket', 
          label: 'Socket', 
          required: true, 
          placeholder: 'Seleccionar socket',
          type: 'select',
          optionsKey: 'sockets'
        },
        { 
          name: 'chipset', 
          label: 'Chipset', 
          placeholder: 'Seleccionar chipset',
          type: 'select',
          optionsKey: 'chipsets'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Seleccionar formato',
          type: 'select',
          optionsKey: 'formats'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Seleccionar tipo',
          type: 'select',
          optionsKey: 'memoryTypes'
        },
        { 
          name: 'slots_memoria', 
          label: 'Slots Memoria', 
          type: 'number', 
          placeholder: '4'
        },
        { 
          name: 'memoria_maxima', 
          label: 'Memoria Máxima (GB)', 
          type: 'number', 
          placeholder: '128'
        },
        { 
          name: 'velocidad_memoria_soportada', 
          label: 'Velocidad Memoria (MHz)', 
          type: 'number', 
          placeholder: '6000'
        },
        { 
          name: 'slots_pcie', 
          label: 'Slots PCIe', 
          type: 'number', 
          placeholder: '3'
        },
        { 
          name: 'version_pcie', 
          label: 'Versión PCIe', 
          placeholder: 'Seleccionar versión',
          type: 'select',
          optionsKey: 'versionesPCIe'
        },
        { 
          name: 'puertos_sata', 
          label: 'Puertos SATA', 
          type: 'number', 
          placeholder: '6'
        },
        { 
          name: 'puertos_m2', 
          label: 'Puertos M.2', 
          type: 'number', 
          placeholder: '4'
        },
        { 
          name: 'conectividad_red', 
          label: 'Conectividad Red', 
          placeholder: '2.5G LAN, WiFi 6E'
        },
        { 
          name: 'audio', 
          label: 'Audio', 
          placeholder: 'Realtek ALC4080'
        },
        { 
          name: 'usb_puertos', 
          label: 'USB Puertos', 
          placeholder: 'USB 3.2, USB-C'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    },
    memorias_ram: {
      title: '💾 Agregar Memoria RAM',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Vengeance RGB, Trident Z5'
        },
        { 
          name: 'tipo', 
          label: 'Tipo', 
          required: true, 
          placeholder: 'Seleccionar tipo',
          type: 'select',
          optionsKey: 'tiposRAM'
        },
        { 
          name: 'capacidad', 
          label: 'Capacidad (GB)', 
          type: 'number', 
          required: true, 
          placeholder: '16'
        },
        { 
          name: 'velocidad_mhz', 
          label: 'Velocidad (MHz)', 
          type: 'number', 
          placeholder: '6000'
        },
        { 
          name: 'velocidad_mt', 
          label: 'Velocidad (MT/s)', 
          type: 'number', 
          placeholder: '12000'
        },
        { 
          name: 'latencia', 
          label: 'Latencia', 
          placeholder: 'CL30, CL16-18-18-38'
        },
        { 
          name: 'voltaje', 
          label: 'Voltaje (V)', 
          type: 'number', 
          placeholder: '1.35'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'DIMM, SODIMM'
        },
        { 
          name: 'rgb', 
          label: 'RGB', 
          type: 'boolean'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    },
    tarjetas_graficas: {
      title: '🎯 Agregar Tarjeta Gráfica',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'RTX 4090, RX 7900 XTX'
        },
        { 
          name: 'fabricante', 
          label: 'Fabricante', 
          placeholder: 'ASUS, Gigabyte, MSI'
        },
        { 
          name: 'memoria', 
          label: 'Memoria (GB)', 
          type: 'number', 
          placeholder: '24'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'GDDR6X, GDDR6',
          type: 'select',
          optionsKey: 'tiposMemoriaGPU'
        },
        { 
          name: 'bus_memoria', 
          label: 'Bus Memoria (bit)', 
          type: 'number', 
          placeholder: '384'
        },
        { 
          name: 'velocidad_memoria', 
          label: 'Velocidad Memoria (MHz)', 
          type: 'number', 
          placeholder: '21000'
        },
        { 
          name: 'nucleos_cuda', 
          label: 'Núcleos CUDA', 
          type: 'number', 
          placeholder: '16384'
        },
        { 
          name: 'frecuencia_base', 
          label: 'Frecuencia Base (MHz)', 
          type: 'number', 
          placeholder: '2235'
        },
        { 
          name: 'frecuencia_boost', 
          label: 'Frecuencia Boost (MHz)', 
          type: 'number', 
          placeholder: '2520'
        },
        { 
          name: 'tdp', 
          label: 'TDP (W)', 
          type: 'number', 
          placeholder: '450'
        },
        { 
          name: 'conectores_alimentacion', 
          label: 'Conectores Alimentación', 
          placeholder: '16-pin, 2x8-pin'
        },
        { 
          name: 'salidas_video', 
          label: 'Salidas Video', 
          placeholder: '3xDP, 1xHDMI'
        },
        { 
          name: 'longitud_mm', 
          label: 'Longitud (mm)', 
          type: 'number', 
          placeholder: '304'
        },
        { 
          name: 'altura_mm', 
          label: 'Altura (mm)', 
          type: 'number', 
          placeholder: '137'
        },
        { 
          name: 'slots_ocupados', 
          label: 'Slots Ocupados', 
          type: 'number', 
          placeholder: '3'
        },
        { 
          name: 'peso_kg', 
          label: 'Peso (kg)', 
          type: 'number', 
          placeholder: '2.2'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    },
    almacenamiento: {
      title: '💿 Agregar Almacenamiento',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: '990 Pro, SN850X'
        },
        { 
          name: 'capacidad', 
          label: 'Capacidad (GB)', 
          type: 'number', 
          required: true, 
          placeholder: '2000'
        },
        { 
          name: 'tipo', 
          label: 'Tipo', 
          required: true, 
          placeholder: 'SSD, HDD',
          type: 'select',
          optionsKey: 'tiposAlmacenamiento'
        },
        { 
          name: 'interfaz', 
          label: 'Interfaz', 
          placeholder: 'PCIe 4.0, SATA III',
          type: 'select',
          optionsKey: 'interfacesAlmacenamiento'
        },
        { 
          name: 'velocidad_lectura', 
          label: 'Velocidad Lectura (MB/s)', 
          type: 'number', 
          placeholder: '7450'
        },
        { 
          name: 'velocidad_escritura', 
          label: 'Velocidad Escritura (MB/s)', 
          type: 'number', 
          placeholder: '6900'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'M.2, 2.5", 3.5"'
        },
        { 
          name: 'rpm', 
          label: 'RPM (solo HDD)', 
          type: 'number', 
          placeholder: '7200'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    },
    fuentes_poder: {
      title: '🔋 Agregar Fuente de Poder',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'RM1000x, Prime TX-1000'
        },
        { 
          name: 'potencia', 
          label: 'Potencia (W)', 
          type: 'number', 
          required: true, 
          placeholder: '1000'
        },
        { 
          name: 'certificacion', 
          label: 'Certificación', 
          placeholder: '80 Plus Gold, Platinum',
          type: 'select',
          optionsKey: 'certificacionesFuente'
        },
        { 
          name: 'modular', 
          label: 'Modular', 
          placeholder: 'Full, Semi, No',
          type: 'select',
          optionsKey: 'tiposModular'
        },
        { 
          name: 'conectores_pcie', 
          label: 'Conectores PCIe', 
          placeholder: '6x8-pin, PCIe 5.0'
        },
        { 
          name: 'conectores_sata', 
          label: 'Conectores SATA', 
          type: 'number', 
          placeholder: '12'
        },
        { 
          name: 'conectores_molex', 
          label: 'Conectores Molex', 
          type: 'number', 
          placeholder: '4'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'ATX'
        },
        { 
          name: 'protecciones', 
          label: 'Protecciones', 
          placeholder: 'OPP, OVP, UVP'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    },
    gabinetes: {
      title: '🖥️ Agregar Gabinete',
      fields: [
        { 
          name: 'marca', 
          label: 'Marca', 
          required: true, 
          placeholder: 'Seleccionar marca',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'O11 Dynamic, North'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Mid Tower, Full Tower',
          type: 'select',
          optionsKey: 'formatosGabinete'
        },
        { 
          name: 'motherboards_soportadas', 
          label: 'Motherboards Soportadas', 
          placeholder: 'ATX, Micro-ATX, Mini-ITX'
        },
        { 
          name: 'longitud_max_gpu', 
          label: 'Longitud Máx GPU (mm)', 
          type: 'number', 
          placeholder: '455'
        },
        { 
          name: 'altura_max_cooler', 
          label: 'Altura Máx Cooler (mm)', 
          type: 'number', 
          placeholder: '185'
        },
        { 
          name: 'bahias_35', 
          label: 'Bahías 3.5"', 
          type: 'number', 
          placeholder: '2'
        },
        { 
          name: 'bahias_25', 
          label: 'Bahías 2.5"', 
          type: 'number', 
          placeholder: '4'
        },
        { 
          name: 'slots_expansion', 
          label: 'Slots Expansión', 
          type: 'number', 
          placeholder: '8'
        },
        { 
          name: 'ventiladores_incluidos', 
          label: 'Ventiladores Incluidos', 
          placeholder: '3x120mm'
        },
        { 
          name: 'ventiladores_soportados', 
          label: 'Ventiladores Soportados', 
          placeholder: '10'
        },
        { 
          name: 'radiador_soportado', 
          label: 'Radiador Soportado', 
          placeholder: '360mm'
        },
        { 
          name: 'panel_frontal', 
          label: 'Panel Frontal', 
          placeholder: 'Vidrio, Malla'
        },
        { 
          name: 'material', 
          label: 'Material', 
          placeholder: 'Acero, Vidrio'
        },
        { 
          name: 'imagen_url', 
          label: 'URL Imagen', 
          placeholder: 'https://...'
        }
      ]
    }
  };

  const currentForm = componentForms[componentType] || componentForms.procesadores;

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
    // Validar campos requeridos
    const requiredFields = currentForm.fields.filter((field: any) => field.required);
    const missingFields = requiredFields.filter((field: any) => !formData[field.name]);
    
    if (missingFields.length > 0) {
      toast.error(`Completá: ${missingFields.map((f: any) => f.label).join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const apiData = mapFormDataToAPI(formData, componentType);
      let result;
      
      switch (componentType) {
        case 'procesadores':
          result = await componentService.createProcessor(apiData);
          break;
        case 'motherboards':
          result = await componentService.createMotherboard(apiData);
          break;
        case 'memorias_ram':
          result = await componentService.createRAM(apiData);
          break;
        case 'tarjetas_graficas':
          result = await componentService.createGPU(apiData);
          break;
        case 'almacenamiento':
          result = await componentService.createStorage(apiData);
          break;
        case 'fuentes_poder':
          result = await componentService.createPSU(apiData);
          break;
        case 'gabinetes':
          result = await componentService.createCase(apiData);
          break;
        default:
          toast.error('Tipo de componente no soportado aún');
          return;
      }

      if (result.success) {
        toast.success('✅ Componente agregado exitosamente');
        setFormData({});
        router.back();
      } else {
        toast.error(result.error || 'Error al agregar componente');
      }
    } catch (error) {
      console.error('Error completo:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const renderSelectButton = (field: any) => {
    const value = formData[field.name];
    const displayValue = value || field.placeholder;

    return (
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => openModal(field)}
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
          placeholder={field.placeholder}
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

  if (optionsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando opciones...</Text>
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

      <ScrollView style={styles.form}>
        {currentForm.fields.map((field: any, index: number) => (
          <View key={index}>
            {renderField(field)}
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? '🔄 Agregando...' : '💾 Agregar Componente'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para seleccionar opciones */}
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
  submitButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#8b9cb3',
  },
  submitButtonText: {
    color: '#ffffff',
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