import HeaderReact from "@/components/header";
import UserItem from "@/components/useritem";
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Usuarios</Text>
              </View>
              
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
                      
                      // Agregar documentos si existen
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
                      
                      // Agregar documentos si existen
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
    paddingHorizontal: 15,
  },
  headerSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
    marginVertical: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 12,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  sectionHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    paddingVertical: 12,
    backgroundColor: '#7B2CBF',
    borderRadius: 12,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  columnContent: {
    width: '100%',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});