import HeaderReact from "@/components/header";
import UserItem from "@/components/useritem";
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;
const isLargeScreen = width >= 768;

export default function UserList() {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://192.168.1.38:3031/getUsuarios')
      .then(response => response.json())
      .then(data => setUsuarios(data));
  }, []);

  return (
    <View style={styles.screen}>
      <HeaderReact />
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeTitle}>Lista de Usuarios</Text>
        </View>

        <ScrollView 
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {usuarios.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay usuarios registrados</Text>
            </View>
          ) : (
            <View style={styles.singleContainer}>
              <View style={styles.columnsContainer}>
                <View style={styles.column}>
                  <View style={styles.columnContent}>
                    {usuarios.filter((_, index) => index % 2 === 0).map((item, index) => {
                      let data = new FormData();
                      data.append('nombre', item.nombre);
                      data.append('mail', item.mail);
                      data.append('telefono', item.telefono);
                      data.append('direccion', item.direccion);
                      data.append('foto', item.foto.replace('./', ''));
                      data.append('isGoogleUser', item.isGoogleUser ? 'true' : 'false');
                      
                      if (item.documento1) {
                        data.append('documento1', item.documento1.replace('./', ''));
                      }
                      if (item.documento2) {
                        data.append('documento2', item.documento2.replace('./', ''));
                      }

                      return <UserItem key={index} userData={data} />;
                    })}
                  </View>
                </View>

                <View style={styles.column}>
                  <View style={styles.columnContent}>
                    {usuarios.filter((_, index) => index % 2 === 1).map((item, index) => {
                      let data = new FormData();
                      data.append('nombre', item.nombre);
                      data.append('mail', item.mail);
                      data.append('telefono', item.telefono);
                      data.append('direccion', item.direccion);
                      data.append('foto', item.foto.replace('./', ''));
                      data.append('isGoogleUser', item.isGoogleUser ? 'true' : 'false');
                      
                      if (item.documento1) {
                        data.append('documento1', item.documento1.replace('./', ''));
                      }
                      if (item.documento2) {
                        data.append('documento2', item.documento2.replace('./', ''));
                      }

                      return <UserItem key={index} userData={data} />;
                    })}
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: isWeb ? 24 : isMediumScreen ? 20 : 16,
    paddingTop: isWeb ? 24 : 20,
    paddingBottom: 20,
  },
  headerSection: {
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: isWeb ? 28 : isMediumScreen ? 24 : 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  singleContainer: {
    width: '100%',
  },
  columnsContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: isWeb ? 24 : 16,
    paddingVertical: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    marginBottom: isWeb ? 0 : 16,
  },
  columnContent: {
    width: '100%',
    alignItems: 'center',
    gap: isWeb ? 20 : 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: isWeb ? 18 : 16,
    color: '#666',
    textAlign: 'center',
  },
});