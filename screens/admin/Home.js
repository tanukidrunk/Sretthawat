import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation, route }) {
  const initialAdmin = route?.params?.admin || {};
  const [admin, setAdmin] = useState(initialAdmin);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedAdmin = route?.params?.updatedadmin;
      if (updatedAdmin) {
        console.log("? Admin Updated:", updatedAdmin);
        setAdmin(updatedAdmin);
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  const handleLogout = () => {
    setModalVisible(false);
    navigation.replace('Guest');
  };

  const handleProfile = () => {
    setModalVisible(false);
    navigation.navigate('AProfile', { admin });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Admin</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Buttons Center */}
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.mainBtn}
          onPress={() => navigation.navigate('ACategorypractice')}
        >
          <Text style={styles.btnText}>Toeic Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainBtn}
          onPress={() => navigation.navigate('ACategorytest')}
        >
          <Text style={styles.btnText}>Toeic Test</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
              <Ionicons name="person-outline" size={22} color="#007BFF" />
              <Text style={[styles.menuText, { color: '#007BFF' }]}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="red" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#000',
  },
  topBarTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainBtn: {
    width: '60%',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  btnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingTop: 60,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuText: { fontSize: 16, marginLeft: 10, fontWeight: 'bold' },
});
