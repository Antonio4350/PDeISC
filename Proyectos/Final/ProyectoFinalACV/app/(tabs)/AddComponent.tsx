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
  FlatList,
  useWindowDimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../AuthContext';
import componentService from '../services/components';
import toast from '../utils/toast';

export default function AddComponent() {
  const { user, isAdmin } = useAuth();
  const params = useLocalSearchParams();
  const componentType = params.type as string;
  const { width } = useWindowDimensions();
  const isMobile = width < 400;
  
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
        // La estructura viene como:
        // { procesadores: { marcas: [...], sockets: [...] }, ... }
        // Necesitamos extraer solo las propiedades del tipo de componente actual
        const componentTypeMap: any = {
          'procesadores': 'procesadores',
          'motherboards': 'motherboards',
          'memorias_ram': 'memorias_ram',
          'tarjetas_graficas': 'tarjetas_graficas',
          'almacenamiento': 'almacenamiento',
          'fuentes_poder': 'fuentes_poder',
          'gabinetes': 'gabinetes'
        };
        
        const typeKey = componentTypeMap[componentType] || 'procesadores';
        const optionsForType = result.data[typeKey] || {};
        
        // Convertir de { marcas: [{id: 1, valor: 'AMD'}, ...] } 
        // a { marcas: ['AMD', 'Intel', ...] }
        const flattenedOptions: any = {};
        Object.keys(optionsForType).forEach(key => {
          flattenedOptions[key] = optionsForType[key].map((item: any) => item.valor);
        });
        
        setFormOptions(flattenedOptions);
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
          placeholder: 'Ej: AMD, Intel',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: i9-13900K, Ryzen 9 7950X'
        },
        { 
          name: 'generacion', 
          label: 'Generación', 
          placeholder: 'Ej: 13th, Zen 4',
          type: 'select',
          optionsKey: 'generaciones'
        },
        { 
          name: 'año_lanzamiento', 
          label: 'Año Lanzamiento', 
          placeholder: 'Ej: 2023, 2024',
          type: 'select',
          optionsKey: 'años'
        },
        { 
          name: 'socket', 
          label: 'Socket', 
          required: true, 
          placeholder: 'Ej: AM5, LGA1700',
          type: 'select',
          optionsKey: 'sockets'
        },
        { 
          name: 'nucleos', 
          label: 'Núcleos', 
          type: 'number', 
          placeholder: 'Ej: 24'
        },
        { 
          name: 'hilos', 
          label: 'Hilos', 
          type: 'number', 
          placeholder: 'Ej: 32'
        },
        { 
          name: 'frecuencia_base', 
          label: 'Frecuencia Base (GHz)', 
          type: 'number', 
          placeholder: 'Ej: 3.5'
        },
        { 
          name: 'frecuencia_turbo', 
          label: 'Frecuencia Turbo (GHz)', 
          type: 'number', 
          placeholder: 'Ej: 5.8'
        },
        { 
          name: 'cache', 
          label: 'Cache', 
          placeholder: 'Ej: 36MB'
        },
        { 
          name: 'tdp', 
          label: 'TDP (W)', 
          type: 'number', 
          placeholder: 'Ej: 125'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Ej: DDR5, DDR4',
          type: 'select',
          optionsKey: 'memoryTypes'
        },
        { 
          name: 'velocidad_memoria_max', 
          label: 'Velocidad Memoria Max (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 5600'
        },
        { 
          name: 'graficos_integrados', 
          label: 'Gráficos Integrados', 
          type: 'boolean'
        },
        { 
          name: 'modelo_graficos', 
          label: 'Modelo Gráficos', 
          placeholder: 'Ej: UHD Graphics, Radeon'
        },
        { 
          name: 'tecnologia', 
          label: 'Tecnología (nm)', 
          placeholder: 'Ej: 5nm, 7nm',
          type: 'select',
          optionsKey: 'tecnologias',
          required: true
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
          placeholder: 'Ej: ASUS, MSI, Gigabyte',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: ROG STRIX Z790-E'
        },
        { 
          name: 'socket', 
          label: 'Socket', 
          required: true, 
          placeholder: 'Ej: AM5, LGA1700',
          type: 'select',
          optionsKey: 'sockets'
        },
        { 
          name: 'chipset', 
          label: 'Chipset', 
          placeholder: 'Ej: Z790, X870',
          type: 'select',
          optionsKey: 'chipsets'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: ATX, Micro-ATX',
          type: 'select',
          optionsKey: 'formats'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Ej: DDR5, DDR4',
          type: 'select',
          optionsKey: 'memoryTypes'
        },
        { 
          name: 'slots_memoria', 
          label: 'Slots Memoria', 
          type: 'number', 
          placeholder: 'Ej: 4'
        },
        { 
          name: 'memoria_maxima', 
          label: 'Memoria Máxima (GB)', 
          type: 'number', 
          placeholder: 'Ej: 128'
        },
        { 
          name: 'velocidad_memoria_soportada', 
          label: 'Velocidad Memoria (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 6000'
        },
        { 
          name: 'slots_pcie', 
          label: 'Slots PCIe', 
          type: 'number', 
          placeholder: 'Ej: 3'
        },
        { 
          name: 'version_pcie', 
          label: 'Versión PCIe', 
          placeholder: 'Ej: 5.0, 4.0',
          type: 'select',
          optionsKey: 'versionesPCIe'
        },
        { 
          name: 'puertos_sata', 
          label: 'Puertos SATA', 
          type: 'number', 
          placeholder: 'Ej: 6'
        },
        { 
          name: 'puertos_m2', 
          label: 'Puertos M.2', 
          type: 'number', 
          placeholder: 'Ej: 4'
        },
        { 
          name: 'conectividad_red', 
          label: 'Conectividad Red', 
          placeholder: 'Ej: 2.5G LAN, WiFi 6E'
        },
        { 
          name: 'audio', 
          label: 'Audio', 
          placeholder: 'Ej: Realtek ALC4080'
        },
        { 
          name: 'usb_puertos', 
          label: 'USB Puertos', 
          placeholder: 'Ej: USB 3.2, USB-C',
          required: true
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
          placeholder: 'Ej: Corsair, G.SKILL',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: Vengeance RGB, Trident Z5'
        },
        { 
          name: 'tipo', 
          label: 'Tipo', 
          required: true, 
          placeholder: 'Ej: DDR5, DDR4',
          type: 'select',
          optionsKey: 'tiposRAM'
        },
        { 
          name: 'capacidad', 
          label: 'Capacidad (GB)', 
          type: 'number', 
          required: true, 
          placeholder: 'Ej: 16'
        },
        { 
          name: 'velocidad_mhz', 
          label: 'Velocidad (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 6000'
        },
        { 
          name: 'velocidad_mt', 
          label: 'Velocidad (MT/s)', 
          type: 'number', 
          placeholder: 'Ej: 12000'
        },
        { 
          name: 'latencia', 
          label: 'Latencia', 
          placeholder: 'Ej: CL30, CL16-18-18-38'
        },
        { 
          name: 'voltaje', 
          label: 'Voltaje (V)', 
          type: 'number', 
          placeholder: 'Ej: 1.35'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: DIMM, SODIMM'
        },
        { 
          name: 'rgb', 
          label: 'RGB', 
          type: 'boolean'
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
          placeholder: 'Ej: NVIDIA, AMD',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: RTX 4090, RX 7900 XTX'
        },
        { 
          name: 'fabricante', 
          label: 'Fabricante', 
          placeholder: 'Ej: ASUS, Gigabyte, MSI'
        },
        { 
          name: 'memoria', 
          label: 'Memoria (GB)', 
          type: 'number', 
          placeholder: 'Ej: 24'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Ej: GDDR6X, GDDR6',
          type: 'select',
          optionsKey: 'tiposMemoriaGPU'
        },
        { 
          name: 'bus_memoria', 
          label: 'Bus Memoria (bit)', 
          type: 'number', 
          placeholder: 'Ej: 384'
        },
        { 
          name: 'velocidad_memoria', 
          label: 'Velocidad Memoria (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 21000'
        },
        { 
          name: 'nucleos_cuda', 
          label: 'Núcleos CUDA', 
          type: 'number', 
          placeholder: 'Ej: 16384'
        },
        { 
          name: 'frecuencia_base', 
          label: 'Frecuencia Base (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 2235'
        },
        { 
          name: 'frecuencia_boost', 
          label: 'Frecuencia Boost (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 2520'
        },
        { 
          name: 'tdp', 
          label: 'TDP (W)', 
          type: 'number', 
          placeholder: 'Ej: 450'
        },
        { 
          name: 'conectores_alimentacion', 
          label: 'Conectores Alimentación', 
          placeholder: 'Ej: 16-pin, 2x8-pin'
        },
        { 
          name: 'salidas_video', 
          label: 'Salidas Video', 
          placeholder: 'Ej: 3xDP, 1xHDMI'
        },
        { 
          name: 'longitud_mm', 
          label: 'Longitud (mm)', 
          type: 'number', 
          placeholder: 'Ej: 304'
        },
        { 
          name: 'altura_mm', 
          label: 'Altura (mm)', 
          type: 'number', 
          placeholder: 'Ej: 137'
        },
        { 
          name: 'slots_ocupados', 
          label: 'Slots Ocupados', 
          type: 'number', 
          placeholder: 'Ej: 3'
        },
        { 
          name: 'peso_kg', 
          label: 'Peso (kg)', 
          type: 'number', 
          placeholder: 'Ej: 2.2',
          required: true
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
          placeholder: 'Ej: Samsung, WD, Crucial',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: 990 Pro, SN850X'
        },
        { 
          name: 'capacidad', 
          label: 'Capacidad (GB)', 
          type: 'number', 
          required: true, 
          placeholder: 'Ej: 2000'
        },
        { 
          name: 'tipo', 
          label: 'Tipo', 
          required: true, 
          placeholder: 'Ej: SSD, HDD',
          type: 'select',
          optionsKey: 'tiposAlmacenamiento'
        },
        { 
          name: 'interfaz', 
          label: 'Interfaz', 
          placeholder: 'Ej: PCIe 4.0, SATA III',
          type: 'select',
          optionsKey: 'interfacesAlmacenamiento'
        },
        { 
          name: 'velocidad_lectura', 
          label: 'Velocidad Lectura (MB/s)', 
          type: 'number', 
          placeholder: 'Ej: 7450'
        },
        { 
          name: 'velocidad_escritura', 
          label: 'Velocidad Escritura (MB/s)', 
          type: 'number', 
          placeholder: 'Ej: 6900'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: M.2, 2.5", 3.5"'
        },
        { 
          name: 'rpm', 
          label: 'RPM (solo HDD)', 
          type: 'number', 
          placeholder: 'Ej: 7200',
          required: true
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
          placeholder: 'Ej: Corsair, EVGA',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: RM1000x, Prime TX-1000'
        },
        { 
          name: 'potencia', 
          label: 'Potencia (W)', 
          type: 'number', 
          required: true, 
          placeholder: 'Ej: 1000'
        },
        { 
          name: 'certificacion', 
          label: 'Certificación', 
          placeholder: 'Ej: 80 Plus Gold',
          type: 'select',
          optionsKey: 'certificacionesFuente'
        },
        { 
          name: 'modular', 
          label: 'Modular', 
          placeholder: 'Ej: Full, Semi',
          type: 'select',
          optionsKey: 'tiposModular'
        },
        { 
          name: 'conectores_pcie', 
          label: 'Conectores PCIe', 
          placeholder: 'Ej: 6x8-pin, PCIe 5.0'
        },
        { 
          name: 'conectores_sata', 
          label: 'Conectores SATA', 
          type: 'number', 
          placeholder: 'Ej: 12'
        },
        { 
          name: 'conectores_molex', 
          label: 'Conectores Molex', 
          type: 'number', 
          placeholder: 'Ej: 4'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: ATX'
        },
        { 
          name: 'protecciones', 
          label: 'Protecciones', 
          placeholder: 'Ej: OPP, OVP, UVP',
          required: true
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
          placeholder: 'Ej: Corsair, Lian Li',
          type: 'select',
          optionsKey: 'marcas'
        },
        { 
          name: 'modelo', 
          label: 'Modelo', 
          required: true, 
          placeholder: 'Ej: O11 Dynamic, North'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: Mid Tower, Full Tower',
          type: 'select',
          optionsKey: 'formatosGabinete'
        },
        { 
          name: 'motherboards_soportadas', 
          label: 'Motherboards Soportadas', 
          placeholder: 'Ej: ATX, Micro-ATX, Mini-ITX'
        },
        { 
          name: 'longitud_max_gpu', 
          label: 'Longitud Máx GPU (mm)', 
          type: 'number', 
          placeholder: 'Ej: 455'
        },
        { 
          name: 'altura_max_cooler', 
          label: 'Altura Máx Cooler (mm)', 
          type: 'number', 
          placeholder: 'Ej: 185'
        },
        { 
          name: 'bahias_35', 
          label: 'Bahías 3.5"', 
          type: 'number', 
          placeholder: 'Ej: 2'
        },
        { 
          name: 'bahias_25', 
          label: 'Bahías 2.5"', 
          type: 'number', 
          placeholder: 'Ej: 4'
        },
        { 
          name: 'slots_expansion', 
          label: 'Slots Expansión', 
          type: 'number', 
          placeholder: 'Ej: 8'
        },
        { 
          name: 'ventiladores_incluidos', 
          label: 'Ventiladores Incluidos', 
          placeholder: 'Ej: 3x120mm'
        },
        { 
          name: 'ventiladores_soportados', 
          label: 'Ventiladores Soportados', 
          placeholder: 'Ej: 10'
        },
        { 
          name: 'radiador_soportado', 
          label: 'Radiador Soportado', 
          placeholder: 'Ej: 360mm'
        },
        { 
          name: 'panel_frontal', 
          label: 'Panel Frontal', 
          placeholder: 'Ej: Vidrio, Malla'
        },
        { 
          name: 'material', 
          label: 'Material', 
          placeholder: 'Ej: Acero, Vidrio',
          required: true
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
  selectButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 0, 0, 0.2)',
    opacity: 0.6,
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