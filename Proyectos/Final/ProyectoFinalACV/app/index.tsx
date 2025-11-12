import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  ViewStyle
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './AuthContext';
import toast from './utils/toast';
import HamburgerMenu from './components/HamburgerMenu';

export default function Index() {
  const { user, logout, isLoading, isAdmin } = useAuth();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [showMenu, setShowMenu] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;
  const isMobile = screenWidth < 768;

  const categories = [
    { name: 'Procesadores', icon: '⚡', color: '#FF6B6B' },
    { name: 'Motherboards', icon: '🔌', color: '#4ECDC4' },
    { name: 'Memorias RAM', icon: '💾', color: '#45B7D1' },
    { name: 'Gabinetes', icon: '🖥️', color: '#96CEB4' },
    { name: 'Fuentes', icon: '🔋', color: '#FFEAA7' },
    { name: 'Almacenamiento', icon: '💿', color: '#98D8C8' },
    { name: 'Tarjetas Gráficas', icon: '🎯', color: '#F7DC6F' }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7E57C2" />
        <Text style={styles.loadingText}>Cargando tu experiencia...</Text>
      </View>
    );
  }

  const handleStartBuilding = () => {
    if (!user) {
      router.push('/(tabs)/Login');
    } else {
      router.push('/(tabs)/PcBuilder');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
      setTimeout(() => {
        router.navigate('/');
      }, 100);
    } catch (error) {
      toast.error('No se pudo cerrar sesión');
    }
  };

  const handleProjects = () => {
    if (!user) {
      router.push('/(tabs)/Login');
    } else {
      router.push('/(tabs)/Projects');
    }
  };

  const handleComponents = () => {
    if (!user) {
      router.push('/(tabs)/Login');
    } else {
      router.push('/(tabs)/ComponentsCatalog');
    }
  };

  const handleAdminPanel = () => {
    router.push('/(tabs)/AdminPanel');
  };

  const handleCategoryPress = (category: string) => {
    if (!user) {
      router.push('/(tabs)/Login');
    } else {
      router.push('/(tabs)/ComponentsCatalog');
    }
  };

  // Estilos dinámicos con tipos correctos
  const getDynamicStyles = () => {
    const header: ViewStyle = {
      paddingTop: isDesktop ? 60 : isTablet ? 50 : Math.max(screenHeight * 0.06, 40),
      paddingBottom: isDesktop ? 20 : 16,
    };

    const logo = {
      fontSize: isDesktop ? 32 : isTablet ? 28 : Math.min(screenWidth * 0.06, 24),
    };

    const navGroup: ViewStyle = {
      gap: isDesktop ? 20 : isTablet ? 16 : 12,
    };

    const navButton: ViewStyle = {
      paddingHorizontal: isDesktop ? 20 : isTablet ? 16 : 12,
      paddingVertical: isDesktop ? 12 : isTablet ? 10 : 8,
    };

    const heroTitle = {
      fontSize: isDesktop ? 48 : isTablet ? 36 : Math.min(screenWidth * 0.08, 32),
      lineHeight: isDesktop ? 56 : isTablet ? 42 : 38,
    };

    const categoryCard: ViewStyle = {
      width: isDesktop ? 180 : isTablet ? 160 : Math.min(screenWidth * 0.35, 140),
      height: isDesktop ? 140 : isTablet ? 130 : 120,
    };

    const ctaSection: ViewStyle = {
      marginHorizontal: isDesktop ? 100 : isTablet ? 60 : 20,
      padding: isDesktop ? 40 : isTablet ? 36 : 32,
    };

    const featuresGrid: ViewStyle = {
      flexDirection: (isDesktop ? 'row' : isTablet ? 'row' : 'column') as 'row' | 'column',
      gap: isDesktop ? 20 : isTablet ? 16 : 12,
      paddingHorizontal: isDesktop ? 100 : isTablet ? 60 : 20,
    };

    const featureCard: ViewStyle = {
      flex: isDesktop ? 1 : isTablet ? 1 : undefined,
      marginBottom: isDesktop ? 0 : isTablet ? 0 : 12,
    };

    return {
      header,
      logo,
      navGroup,
      navButton,
      heroTitle,
      categoryCard,
      ctaSection,
      featuresGrid,
      featureCard
    };
  };

  const dynamicStyles = getDynamicStyles();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1b27" />
      
      {/* HEADER */}
      <Animated.View 
        style={[
          styles.header,
          dynamicStyles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.logo, dynamicStyles.logo]}>
            🛠️ AntonioPC
            <Text style={styles.logoHighlight}>Builder</Text>
          </Text>
          
          {/* MENU HAMBURGUESA PARA MÓVIL / NAVEGACIÓN NORMAL PARA DESKTOP */}
          {isMobile ? (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setShowMenu(true)}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navLinks}>
              {!user ? (
                <View style={[styles.navGroup, dynamicStyles.navGroup]}>
                  <TouchableOpacity 
                    style={[styles.navButton, dynamicStyles.navButton]}
                    onPress={() => router.push('/(tabs)/Login')}
                  >
                    <Text style={styles.navButtonText}>Ingresar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.navButton, styles.registerButton, dynamicStyles.navButton]}
                    onPress={() => router.push('/(tabs)/Register')}
                  >
                    <Text style={styles.navButtonText}>Crear Cuenta</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.navGroup, dynamicStyles.navGroup]}>
                  <TouchableOpacity 
                    style={[styles.navButton, dynamicStyles.navButton]}
                    onPress={handleComponents}
                  >
                    <Text style={styles.navButtonText}>Componentes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.navButton, dynamicStyles.navButton]}
                    onPress={handleProjects}
                  >
                    <Text style={styles.navButtonText}>Proyectos</Text>
                  </TouchableOpacity>
                  
                  {isAdmin() && (
                    <TouchableOpacity 
                      style={[styles.navButton, styles.adminButton, dynamicStyles.navButton]}
                      onPress={handleAdminPanel}
                    >
                      <Text style={styles.navButtonText}>👑 Admin</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.logoutBtn}
                    onPress={handleLogout}
                  >
                    <Text style={styles.logoutText}>Salir</Text>
                  </TouchableOpacity>
                  <View style={styles.userInfo}>
                    <Text style={styles.userWelcome}>
                      👋 {user.nombre || user.email.split('@')[0]}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>

      {/* MENÚ HAMBURGUESA */}
      <HamburgerMenu 
        isVisible={showMenu} 
        onClose={() => setShowMenu(false)} 
      />

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView 
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SECTION */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.heroTitle, dynamicStyles.heroTitle]}>
            {user ? `¡Hola de nuevo, ${user.nombre || 'Builder'}!` : 'Construí tu PC ideal'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {user 
              ? 'Continuá diseñando tu setup soñado con componentes perfectamente compatibles' 
              : 'Desde gaming hasta trabajo profesional - Armá la máquina perfecta para vos'
            }
          </Text>
        </Animated.View>

        {/* CATEGORÍAS */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Explorar Componentes</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  dynamicStyles.categoryCard,
                  { backgroundColor: category.color }
                ]}
                onPress={() => handleCategoryPress(category.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CALL TO ACTION */}
        <Animated.View 
          style={[
            styles.ctaSection,
            dynamicStyles.ctaSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>
              {user ? '¿Listo para continuar?' : '¿Preparado para empezar?'}
            </Text>
            <Text style={styles.ctaDescription}>
              {user 
                ? 'Retomá tu proyecto o comenzá uno nuevo desde cero'
                : 'Unite a nuestra comunidad y descubrí el poder de armar tu propia PC'
              }
            </Text>
            
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={handleStartBuilding}
              activeOpacity={0.9}
            >
              <Text style={styles.ctaButtonText}>
                {user ? '🚀 Continuar Construyendo' : '🎯 Empezar Ahora'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FEATURES GRID */}
        {user && (
          <Animated.View 
            style={[
              styles.featuresGrid,
              dynamicStyles.featuresGrid,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.featureCard, dynamicStyles.featureCard]}>
              <Text style={styles.featureIcon}>💾</Text>
              <Text style={styles.featureTitle}>Tus Proyectos</Text>
              <Text style={styles.featureDesc}>Accedé a todos tus builds guardados</Text>
            </View>
            
            <View style={[styles.featureCard, dynamicStyles.featureCard]}>
              <Text style={styles.featureIcon}>🔧</Text>
              <Text style={styles.featureTitle}>Constructor Avanzado</Text>
              <Text style={styles.featureDesc}>Herramientas profesionales de armado</Text>
            </View>
            
            <View style={[styles.featureCard, dynamicStyles.featureCard]}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>Comparar</Text>
              <Text style={styles.featureDesc}>Analizá diferentes configuraciones</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1117'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8b9cb3'
  },
  header: {
    backgroundColor: '#1a1b27',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  logo: {
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5
  },
  logoHighlight: {
    color: '#ffd700'
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  menuButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600'
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  registerButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff5252'
  },
  adminButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.5)'
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  userInfo: {
    marginLeft: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)'
  },
  userWelcome: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '600'
  },
  body: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 30
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center'
  },
  heroTitle: {
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#8b9cb3',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600
  },
  categoriesSection: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    paddingHorizontal: 24
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingRight: 10
  },
  categoryCard: {
    borderRadius: 20,
    marginRight: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  categoryText: {
    color: '#1a1b27',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  },
  ctaSection: {
    backgroundColor: '#1a1b27',
    borderRadius: 24,
    marginBottom: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12
  },
  ctaContent: {
    alignItems: 'center'
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center'
  },
  ctaDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8
  },
  ctaButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700'
  },
  featuresGrid: {
    justifyContent: 'space-between'
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center'
  },
  featureDesc: {
    color: '#8b9cb3',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16
  }
});