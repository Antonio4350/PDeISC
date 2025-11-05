import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../AuthContext';
import toast from '../utils/toast';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HamburgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  color: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

export default function HamburgerMenu({ isVisible, onClose }: HamburgerMenuProps) {
  const { user, logout, isAdmin } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animación de salida
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  const menuItems: MenuItem[] = [
    // Navegación principal
    { 
      id: 'home', 
      label: 'Inicio', 
      icon: '🏠', 
      route: '/', 
      color: '#667eea' 
    },
    { 
      id: 'components', 
      label: 'Componentes', 
      icon: '🔧', 
      route: 'components', 
      color: '#4ECDC4',
      requiresAuth: true 
    },
    { 
      id: 'builder', 
      label: 'Constructor PC', 
      icon: '🛠️', 
      route: 'builder', 
      color: '#FF6B6B',
      requiresAuth: true 
    },
    { 
      id: 'projects', 
      label: 'Mis Proyectos', 
      icon: '📂', 
      route: 'projects', 
      color: '#45B7D1',
      requiresAuth: true 
    },
    
    // Administración
    { 
      id: 'admin', 
      label: 'Panel Admin', 
      icon: '👑', 
      route: 'admin', 
      color: '#ffd700',
      requiresAuth: true,
      adminOnly: true 
    },
    
    // Autenticación
    { 
      id: 'login', 
      label: 'Ingresar', 
      icon: '🔐', 
      route: 'login', 
      color: '#667eea',
      requiresAuth: false 
    },
    { 
      id: 'register', 
      label: 'Crear Cuenta', 
      icon: '🎯', 
      route: 'register', 
      color: '#ff6b6b',
      requiresAuth: false 
    },
    { 
      id: 'logout', 
      label: 'Cerrar Sesión', 
      icon: '🚪', 
      route: 'logout', 
      color: '#ef4444',
      requiresAuth: true 
    },
  ];

  const handleNavigation = async (item: MenuItem) => {
    // Feedback háptico
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setActiveItem(item.id);
    onClose();

    // Pequeño delay para la animación
    setTimeout(() => {
      if (!user && item.requiresAuth) {
        router.push('/(tabs)/Login');
        return;
      }

      if (item.adminOnly && !isAdmin()) {
        toast.error('No tenés permisos de administrador');
        return;
      }

      switch (item.route) {
        case '/':
          router.push('/');
          break;
        case 'components':
          router.push('/(tabs)/ComponentsCatalog');
          break;
        case 'builder':
          router.push('/(tabs)/PcBuilder');
          break;
        case 'projects':
          router.push('/(tabs)/Projects');
          break;
        case 'admin':
          router.push('/(tabs)/AdminPanel');
          break;
        case 'login':
          router.push('/(tabs)/Login');
          break;
        case 'register':
          router.push('/(tabs)/Register');
          break;
        case 'logout':
          handleLogout();
          break;
        default:
          router.push('/');
      }
    }, 200);

    // Reset active item después de la navegación
    setTimeout(() => setActiveItem(null), 1000);
  };

  const handleLogout = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await logout();
      router.replace('/');
      toast.success('¡Sesión cerrada correctamente!');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!user && item.requiresAuth) return false;
    if (item.adminOnly && !isAdmin()) return false;
    if (user && (item.id === 'login' || item.id === 'register')) return false;
    if (!user && item.id === 'logout') return false;
    return true;
  });

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = activeItem === item.id;
    
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.menuItemContainer,
          {
            opacity: fadeAnim,
            transform: [
              { 
                translateX: slideAnim.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0],
                  outputRange: [-50 * (index + 1), 0]
                }) 
              },
              { scale: isActive ? 0.95 : 1 }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.menuItem,
            isActive && styles.menuItemActive,
            { borderLeftColor: item.color }
          ]}
          onPress={() => handleNavigation(item)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemIcon}>{item.icon}</Text>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
              {item.adminOnly && (
                <Text style={styles.adminBadge}>ADMIN</Text>
              )}
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </View>
          
          {isActive && (
            <Animated.View 
              style={[
                styles.activeIndicator,
                { backgroundColor: item.color }
              ]}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" barStyle="light-content" />
      
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: fadeAnim }
          ]}
        />
      </TouchableOpacity>

      {/* Menú */}
      <Animated.View 
        style={[
          styles.menuContainer,
          {
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Header del Menú */}
        <View style={styles.menuHeader}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🛠️</Text>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoTitle}>AntonioPC</Text>
              <Text style={styles.logoSubtitle}>Builder</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Información del Usuario */}
        {user && (
          <Animated.View 
            style={[
              styles.userInfo,
              {
                opacity: fadeAnim,
                transform: [
                  { 
                    translateY: slideAnim.interpolate({
                      inputRange: [-SCREEN_WIDTH, 0],
                      outputRange: [-20, 0]
                    }) 
                  }
                ]
              }
            ]}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userWelcome}>
                👋 Hola, {user.nombre || user.email.split('@')[0]}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userBadges}>
                <Text style={styles.userRole}>
                  {isAdmin() ? '👑 Administrador' : '👤 Usuario'}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Separador */}
        <View style={styles.separator} />

        {/* Items del Menú */}
        <ScrollView 
          style={styles.menuItems}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuItemsContent}
        >
          {/* Sección: Navegación */}
          <Animated.View 
            style={[
              styles.sectionHeader,
              {
                opacity: fadeAnim,
                transform: [
                  { 
                    translateX: slideAnim.interpolate({
                      inputRange: [-SCREEN_WIDTH, 0],
                      outputRange: [-30, 0]
                    }) 
                  }
                ]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Navegación</Text>
          </Animated.View>
          
          {filteredMenuItems
            .filter(item => ['home', 'components', 'builder', 'projects'].includes(item.id))
            .map((item, index) => renderMenuItem(item, index))}

          {/* Sección: Administración */}
          {user && isAdmin() && (
            <>
              <Animated.View 
                style={[
                  styles.sectionHeader,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { 
                        translateX: slideAnim.interpolate({
                          inputRange: [-SCREEN_WIDTH, 0],
                          outputRange: [-30, 0]
                        }) 
                      }
                    ]
                  }
                ]}
              >
                <Text style={styles.sectionTitle}>Administración</Text>
              </Animated.View>
              
              {filteredMenuItems
                .filter(item => ['admin'].includes(item.id))
                .map((item, index) => renderMenuItem(item, index + 4))}
            </>
          )}

          {/* Sección: Cuenta */}
          <Animated.View 
            style={[
              styles.sectionHeader,
              {
                opacity: fadeAnim,
                transform: [
                  { 
                    translateX: slideAnim.interpolate({
                      inputRange: [-SCREEN_WIDTH, 0],
                      outputRange: [-30, 0]
                    }) 
                  }
                ]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Cuenta</Text>
          </Animated.View>
          
          {filteredMenuItems
            .filter(item => user ? ['logout'].includes(item.id) : ['login', 'register'].includes(item.id))
            .map((item, index) => renderMenuItem(item, index + 5))}
        </ScrollView>

        {/* Footer del Menú */}
        <Animated.View 
          style={[
            styles.menuFooter,
            {
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: slideAnim.interpolate({
                    inputRange: [-SCREEN_WIDTH, 0],
                    outputRange: [20, 0]
                  }) 
                }
              ]
            }
          ]}
        >
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>AntonioPCBuilder</Text>
            <Text style={styles.footerVersion}>v2.0.0</Text>
          </View>
          <Text style={styles.footerSubtext}>Construí tu PC ideal</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 320,
    backgroundColor: '#0f1117',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffd700',
    marginTop: -2,
  },
  closeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 8,
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    margin: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userWelcome: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    color: '#8b9cb3',
    fontSize: 12,
    marginBottom: 4,
  },
  userBadges: {
    flexDirection: 'row',
  },
  userRole: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
  },
  menuItems: {
    flex: 1,
  },
  menuItemsContent: {
    paddingVertical: 16,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItemContainer: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
    overflow: 'hidden',
  },
  menuItemActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    transform: [{ scale: 0.98 }],
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  menuItemTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  adminBadge: {
    color: '#ffd700',
    fontSize: 8,
    fontWeight: '800',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  menuItemArrow: {
    color: '#8b9cb3',
    fontSize: 18,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 3,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  footerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footerVersion: {
    color: '#8b9cb3',
    fontSize: 12,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#8b9cb3',
    fontSize: 11,
    textAlign: 'center',
  },
});