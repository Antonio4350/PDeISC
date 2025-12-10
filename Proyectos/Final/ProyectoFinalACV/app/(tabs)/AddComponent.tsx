// app/(tabs)/AddComponent.tsx - CORREGIDO EL ERROR DE undefined
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
  useWindowDimensions,
  Alert
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
  const [manualInputModal, setManualInputModal] = useState(false);
  const [currentField, setCurrentField] = useState<any>(null);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [manualInputValue, setManualInputValue] = useState('');

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
        console.log(`Opciones para ${componentType}:`, flattenedOptions);
      } else {
        console.error('Error obteniendo opciones:', result.error);
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
      'longitud_max_gpu', 'altura_max_cooler', 'bahias_35', 'bahias_25', 'slots_expansion',
      'rpm', 'velocidad_lectura', 'velocidad_escritura'
    ];

    numericFields.forEach(field => {
      if (mappedData[field] !== undefined && mappedData[field] !== null && mappedData[field] !== '') {
        if (field.includes('frecuencia') || field === 'voltaje') {
          mappedData[field] = parseFloat(mappedData[field]);
        } else {
          mappedData[field] = parseInt(mappedData[field]);
        }
      } else {
        // Si el campo no está definido, lo eliminamos para que no vaya null
        delete mappedData[field];
      }
    });

    // Limpiar campos vacíos
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key] === '' || mappedData[key] === null || mappedData[key] === undefined) {
        delete mappedData[key];
      }
    });

    return mappedData;
  };

  // Campos realmente obligatorios para cada tipo
  const getRequiredFields = (type: string) => {
    const baseRequired = ['marca', 'modelo'];
    
    switch (type) {
      case 'procesadores':
        return [...baseRequired, 'socket', 'tecnologia'];
      case 'motherboards':
        return [...baseRequired, 'socket'];
      case 'memorias_ram':
        return [...baseRequired, 'tipo', 'capacidad'];
      case 'tarjetas_graficas':
        return baseRequired;
      case 'almacenamiento':
        return [...baseRequired, 'tipo', 'capacidad'];
      case 'fuentes_poder':
        return [...baseRequired, 'potencia'];
      case 'gabinetes':
        return baseRequired;
      default:
        return baseRequired;
    }
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
          placeholder: 'Ej: 24 (opcional)'
        },
        { 
          name: 'hilos', 
          label: 'Hilos', 
          type: 'number', 
          placeholder: 'Ej: 32 (opcional)'
        },
        { 
          name: 'frecuencia_base', 
          label: 'Frecuencia Base (GHz)', 
          type: 'number', 
          placeholder: 'Ej: 3.5 (opcional)'
        },
        { 
          name: 'frecuencia_turbo', 
          label: 'Frecuencia Turbo (GHz)', 
          type: 'number', 
          placeholder: 'Ej: 5.8 (opcional)'
        },
        { 
          name: 'cache', 
          label: 'Cache', 
          placeholder: 'Ej: 36MB (opcional)'
        },
        { 
          name: 'tdp', 
          label: 'TDP (W)', 
          type: 'number', 
          placeholder: 'Ej: 125 (opcional)'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Ej: DDR5, DDR4 (opcional)',
          type: 'select',
          optionsKey: 'memoryTypes'
        },
        { 
          name: 'velocidad_memoria_max', 
          label: 'Velocidad Memoria Max (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 5600 (opcional)'
        },
        { 
          name: 'graficos_integrados', 
          label: 'Gráficos Integrados', 
          type: 'boolean'
        },
        { 
          name: 'modelo_graficos', 
          label: 'Modelo Gráficos', 
          placeholder: 'Ej: UHD Graphics, Radeon (opcional)'
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
          placeholder: 'Ej: Z790, X870 (opcional)',
          type: 'select',
          optionsKey: 'chipsets'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: ATX, Micro-ATX (opcional)',
          type: 'select',
          optionsKey: 'formats'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Ej: DDR5, DDR4 (opcional)',
          type: 'select',
          optionsKey: 'memoryTypes'
        },
        { 
          name: 'slots_memoria', 
          label: 'Slots Memoria', 
          type: 'number', 
          placeholder: 'Ej: 4 (opcional)'
        },
        { 
          name: 'memoria_maxima', 
          label: 'Memoria Máxima (GB)', 
          type: 'number', 
          placeholder: 'Ej: 128 (opcional)'
        },
        { 
          name: 'velocidad_memoria_soportada', 
          label: 'Velocidad Memoria (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 6000 (opcional)'
        },
        { 
          name: 'slots_pcie', 
          label: 'Slots PCIe', 
          type: 'number', 
          placeholder: 'Ej: 3 (opcional)'
        },
        { 
          name: 'version_pcie', 
          label: 'Versión PCIe', 
          placeholder: 'Ej: 5.0, 4.0 (opcional)',
          type: 'select',
          optionsKey: 'versionesPCIe'
        },
        { 
          name: 'puertos_sata', 
          label: 'Puertos SATA', 
          type: 'number', 
          placeholder: 'Ej: 6 (opcional)'
        },
        { 
          name: 'puertos_m2', 
          label: 'Puertos M.2', 
          type: 'number', 
          placeholder: 'Ej: 4 (opcional)'
        },
        { 
          name: 'conectividad_red', 
          label: 'Conectividad Red', 
          placeholder: 'Ej: 2.5G LAN, WiFi 6E (opcional)'
        },
        { 
          name: 'audio', 
          label: 'Audio', 
          placeholder: 'Ej: Realtek ALC4080 (opcional)'
        },
        { 
          name: 'usb_puertos', 
          label: 'USB Puertos', 
          placeholder: 'Ej: USB 3.2, USB-C (opcional)'
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
          placeholder: 'Ej: 6000 (opcional)'
        },
        { 
          name: 'velocidad_mt', 
          label: 'Velocidad (MT/s)', 
          type: 'number', 
          placeholder: 'Ej: 12000 (opcional)'
        },
        { 
          name: 'latencia', 
          label: 'Latencia', 
          placeholder: 'Ej: CL30, CL16-18-18-38 (opcional)'
        },
        { 
          name: 'voltaje', 
          label: 'Voltaje (V)', 
          type: 'number', 
          placeholder: 'Ej: 1.35 (opcional)'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: DIMM, SODIMM (opcional)'
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
          placeholder: 'Ej: ASUS, Gigabyte, MSI (opcional)'
        },
        { 
          name: 'memoria', 
          label: 'Memoria (GB)', 
          type: 'number', 
          placeholder: 'Ej: 24 (opcional)'
        },
        { 
          name: 'tipo_memoria', 
          label: 'Tipo Memoria', 
          placeholder: 'Ej: GDDR6X, GDDR6 (opcional)',
          type: 'select',
          optionsKey: 'tiposMemoriaGPU'
        },
        { 
          name: 'bus_memoria', 
          label: 'Bus Memoria (bit)', 
          type: 'number', 
          placeholder: 'Ej: 384 (opcional)'
        },
        { 
          name: 'velocidad_memoria', 
          label: 'Velocidad Memoria (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 21000 (opcional)'
        },
        { 
          name: 'nucleos_cuda', 
          label: 'Núcleos CUDA', 
          type: 'number', 
          placeholder: 'Ej: 16384 (opcional)'
        },
        { 
          name: 'frecuencia_base', 
          label: 'Frecuencia Base (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 2235 (opcional)'
        },
        { 
          name: 'frecuencia_boost', 
          label: 'Frecuencia Boost (MHz)', 
          type: 'number', 
          placeholder: 'Ej: 2520 (opcional)'
        },
        { 
          name: 'tdp', 
          label: 'TDP (W)', 
          type: 'number', 
          placeholder: 'Ej: 450 (opcional)'
        },
        { 
          name: 'conectores_alimentacion', 
          label: 'Conectores Alimentación', 
          placeholder: 'Ej: 16-pin, 2x8-pin (opcional)'
        },
        { 
          name: 'salidas_video', 
          label: 'Salidas Video', 
          placeholder: 'Ej: 3xDP, 1xHDMI (opcional)'
        },
        { 
          name: 'longitud_mm', 
          label: 'Longitud (mm)', 
          type: 'number', 
          placeholder: 'Ej: 304 (opcional)'
        },
        { 
          name: 'altura_mm', 
          label: 'Altura (mm)', 
          type: 'number', 
          placeholder: 'Ej: 137 (opcional)'
        },
        { 
          name: 'slots_ocupados', 
          label: 'Slots Ocupados', 
          type: 'number', 
          placeholder: 'Ej: 3 (opcional)'
        },
        { 
          name: 'peso_kg', 
          label: 'Peso (kg)', 
          type: 'number', 
          placeholder: 'Ej: 2.2 (opcional)'
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
          placeholder: 'Ej: PCIe 4.0, SATA III (opcional)',
          type: 'select',
          optionsKey: 'interfacesAlmacenamiento'
        },
        { 
          name: 'velocidad_lectura', 
          label: 'Velocidad Lectura (MB/s)', 
          type: 'number', 
          placeholder: 'Ej: 7450 (opcional)'
        },
        { 
          name: 'velocidad_escritura', 
          label: 'Velocidad Escritura (MB/s)', 
          type: 'number', 
          placeholder: 'Ej: 6900 (opcional)'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: M.2, 2.5", 3.5" (opcional)'
        },
        { 
          name: 'rpm', 
          label: 'RPM (solo HDD)', 
          type: 'number', 
          placeholder: 'Ej: 7200 (opcional)'
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
          placeholder: 'Ej: 80 Plus Gold (opcional)',
          type: 'select',
          optionsKey: 'certificacionesFuente'
        },
        { 
          name: 'modular', 
          label: 'Modular', 
          placeholder: 'Ej: Full, Semi (opcional)',
          type: 'select',
          optionsKey: 'tiposModular'
        },
        { 
          name: 'conectores_pcie', 
          label: 'Conectores PCIe', 
          placeholder: 'Ej: 6x8-pin, PCIe 5.0 (opcional)'
        },
        { 
          name: 'conectores_sata', 
          label: 'Conectores SATA', 
          type: 'number', 
          placeholder: 'Ej: 12 (opcional)'
        },
        { 
          name: 'conectores_molex', 
          label: 'Conectores Molex', 
          type: 'number', 
          placeholder: 'Ej: 4 (opcional)'
        },
        { 
          name: 'formato', 
          label: 'Formato', 
          placeholder: 'Ej: ATX (opcional)'
        },
        { 
          name: 'protecciones', 
          label: 'Protecciones', 
          placeholder: 'Ej: OPP, OVP, UVP (opcional)'
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
          placeholder: 'Ej: Mid Tower, Full Tower (opcional)',
          type: 'select',
          optionsKey: 'formatosGabinete'
        },
        { 
          name: 'motherboards_soportadas', 
          label: 'Motherboards Soportadas', 
          placeholder: 'Ej: ATX, Micro-ATX, Mini-ITX (opcional)'
        },
        { 
          name: 'longitud_max_gpu', 
          label: 'Longitud Máx GPU (mm)', 
          type: 'number', 
          placeholder: 'Ej: 455 (opcional)'
        },
        { 
          name: 'altura_max_cooler', 
          label: 'Altura Máx Cooler (mm)', 
          type: 'number', 
          placeholder: 'Ej: 185 (opcional)'
        },
        { 
          name: 'bahias_35', 
          label: 'Bahías 3.5"', 
          type: 'number', 
          placeholder: 'Ej: 2 (opcional)'
        },
        { 
          name: 'bahias_25', 
          label: 'Bahías 2.5"', 
          type: 'number', 
          placeholder: 'Ej: 4 (opcional)'
        },
        { 
          name: 'slots_expansion', 
          label: 'Slots Expansión', 
          type: 'number', 
          placeholder: 'Ej: 8 (opcional)'
        },
        { 
          name: 'ventiladores_incluidos', 
          label: 'Ventiladores Incluidos', 
          placeholder: 'Ej: 3x120mm (opcional)'
        },
        { 
          name: 'ventiladores_soportados', 
          label: 'Ventiladores Soportados', 
          placeholder: 'Ej: 10 (opcional)'
        },
        { 
          name: 'radiador_soportado', 
          label: 'Radiador Soportado', 
          placeholder: 'Ej: 360mm (opcional)'
        },
        { 
          name: 'panel_frontal', 
          label: 'Panel Frontal', 
          placeholder: 'Ej: Vidrio, Malla (opcional)'
        },
        { 
          name: 'material', 
          label: 'Material', 
          placeholder: 'Ej: Acero, Vidrio (opcional)'
        }
      ]
    }
  };

  const currentForm = componentForms[componentType] || componentForms.procesadores;

  const handleInputChange = (field: string, value: string | number | boolean | undefined) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      
      if (value === undefined) {
        // Si el valor es undefined, eliminamos el campo
        delete newData[field];
      } else {
        // Si tiene valor, lo asignamos
        newData[field] = value;
      }
      
      return newData;
    });
  };

  const openModal = (field: any) => {
    setCurrentField(field);
    const options = formOptions[field.optionsKey] || [];
    setFilteredOptions(options);
    setManualInputModal(false);
    setModalVisible(true);
  };

  const openManualInput = (field: any) => {
    setCurrentField(field);
    setManualInputValue(formData[field.name] || '');
    setModalVisible(false);
    setManualInputModal(true);
  };

  const selectOption = (option: string) => {
    handleInputChange(currentField.name, option);
    setModalVisible(false);
  };

  const saveManualInput = () => {
    if (manualInputValue.trim()) {
      handleInputChange(currentField.name, manualInputValue.trim());
      setManualInputModal(false);
      
      // Agregar la nueva opción a las opciones disponibles para futuras selecciones
      if (currentField?.optionsKey) {
        const currentOptions = formOptions[currentField.optionsKey] || [];
        if (!currentOptions.includes(manualInputValue.trim())) {
          setFormOptions((prev: any) => ({
            ...prev,
            [currentField.optionsKey]: [...currentOptions, manualInputValue.trim()]
          }));
        }
      }
    } else {
      Alert.alert('Error', 'Por favor ingresa un valor válido');
    }
  };

  const handleSubmit = async () => {
    // Validar solo campos realmente obligatorios
    const requiredFields = getRequiredFields(componentType);
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return !value || value.toString().trim() === '';
    });
    
    if (missingFields.length > 0) {
      const fieldLabels = missingFields.map(fieldName => {
        const field = currentForm.fields.find((f: any) => f.name === fieldName);
        return field ? field.label : fieldName;
      });
      
      toast.error(`Completá los campos obligatorios: ${fieldLabels.join(', ')}`);
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
        toast.success('Componente agregado exitosamente');
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
    const hasOptions = options.length > 0;
    
    return (
      <View style={styles.selectContainer}>
        <TouchableOpacity
          style={[styles.selectButton, !hasOptions && styles.selectButtonNoOptions]}
          onPress={() => hasOptions ? openModal(field) : openManualInput(field)}
        >
          <Text style={[
            styles.selectButtonText,
            !value && styles.selectButtonPlaceholder
          ]}>
            {value || (hasOptions ? `Seleccionar ${field.label.toLowerCase()}...` : 'Ingresar manualmente...')}
          </Text>
          <Text style={styles.selectButtonIcon}>▼</Text>
        </TouchableOpacity>
        
        {hasOptions && (
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => openManualInput(field)}
          >
            <Text style={styles.manualButtonText}>✏️ Manual</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderField = (field: any) => {
    if (field.type === 'select') {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {field.label} {field.required && ' *'}
            {!field.required && <Text style={styles.optionalText}> (opcional)</Text>}
          </Text>
          {renderSelectButton(field)}
        </View>
      );
    }

    if (field.type === 'boolean') {
      return (
        <View style={styles.booleanField}>
          <Text style={styles.label}>
            {field.label}
            <Text style={styles.optionalText}> (opcional)</Text>
          </Text>
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
            <TouchableOpacity
              style={[
                styles.booleanOption,
                formData[field.name] === undefined && styles.booleanOptionSelected
              ]}
              onPress={() => handleInputChange(field.name, undefined)}
            >
              <Text style={[
                styles.booleanOptionText,
                formData[field.name] === undefined && styles.booleanOptionTextSelected
              ]}>NS/NC</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {field.label} {field.required && ' *'}
          {!field.required && <Text style={styles.optionalText}> (opcional)</Text>}
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
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={styles.infoBold}>Nota:</Text> Solo los campos marcados con * son obligatorios. 
            Podés dejar los demás vacíos y completarlos después.
          </Text>
        </View>

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
              <View style={styles.modalHeaderButtons}>
                <TouchableOpacity 
                  style={styles.modalManualButton}
                  onPress={() => openManualInput(currentField)}
                >
                  <Text style={styles.modalManualButtonText}>✏️ Manual</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
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
              ListEmptyComponent={
                <View style={styles.emptyOptions}>
                  <Text style={styles.emptyOptionsText}>
                    No hay opciones disponibles
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Modal para entrada manual */}
      <Modal
        visible={manualInputModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setManualInputModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Ingresar {currentField?.label} manualmente
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setManualInputModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.manualInputContainer}>
              <TextInput
                style={styles.manualInput}
                placeholder={`Ingresa el ${currentField?.label?.toLowerCase()}...`}
                placeholderTextColor="#8b9cb3"
                value={manualInputValue}
                onChangeText={setManualInputValue}
                autoFocus={true}
              />
              
              <View style={styles.manualButtons}>
                <TouchableOpacity
                  style={[styles.manualActionButton, styles.cancelButton]}
                  onPress={() => setManualInputModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.manualActionButton, styles.saveButton]}
                  onPress={saveManualInput}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: 20,
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
  infoBox: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoText: {
    color: '#8b9cb3',
    fontSize: 14,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '700',
    color: '#667eea',
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
  optionalText: {
    fontSize: 14,
    color: '#8b9cb3',
    fontWeight: '400',
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
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonNoOptions: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
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
  manualButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  manualButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  booleanField: {
    marginBottom: 20,
  },
  booleanOptions: {
    flexDirection: 'row',
    gap: 10,
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
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  modalManualButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  modalManualButtonText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
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
  emptyOptions: {
    padding: 40,
    alignItems: 'center',
  },
  emptyOptionsText: {
    color: '#8b9cb3',
    fontSize: 16,
    textAlign: 'center',
  },
  manualInputContainer: {
    padding: 20,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  manualButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  manualActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: '#667eea',
  },
  cancelButtonText: {
    color: '#8b9cb3',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});