import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
  

export default function ACategorytest({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    { id: 1, name: 'Vocabulary' },
    { id: 2, name: 'Verb' },
    { id: 3, name: 'Tense' },
  ];

  const handleLogout = () => {
    setModalVisible(false);
    navigation.replace('Guest');
  };

  return (
    <View style={styles.container}>
      {/* ---------- Top Bar ---------- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack('Member')}>
          <Ionicons name='arrow-back-outline' size={28} color='white' />
        </TouchableOpacity>

        <Text style={styles.adminText}>Admin</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name='person-circle-outline' size={35} color='white' />
        </TouchableOpacity>
      </View>

      {/* ---------- Title ---------- */}
      <Text style={styles.title}>Test Categories</Text>

      {/* ---------- Category Buttons ---------- */}
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.button}
          onPress={() =>
            navigation.navigate('Testquesions', {
              categoryId: cat.id,
              categoryName: cat.name,
            })
          }
        >
          <Text style={styles.buttonText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}

      {/* ---------- Profile Modal ---------- */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name='log-out-outline' size={22} color='red' />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },

  // ---------- TOP BAR ----------
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  adminText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ---------- CATEGORY SECTION ----------
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 25,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },

  // ---------- PROFILE MODAL ----------
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});
