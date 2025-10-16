import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
   
export default function Member({ route, navigation }) {
  const [user, setUser] = useState(route.params?.user || {});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedUser = route.params?.updatedUser;
      if (updatedUser) setUser(updatedUser);
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const handleLogout = () => {
    setModalVisible(false);
    navigation.replace('Guest');
  };
 
  const handleProfile = () => {
    setModalVisible(false);
    navigation.navigate('Profile', { user });
  };

  const handleHistory = () => {
    setModalVisible(false);
    navigation.navigate('TestHistory', { email_member: user.email_member });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Member</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name='person-circle-outline' size={35} color='white' />
        </TouchableOpacity>
      </View>

      {/* User Card */}
      {user ? (
        <View style={styles.userCard}>
          <Text style={styles.userName}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.userEmail}>{user.email_member}</Text>
        </View>
      ) : (
        <Text>No user data received</Text>
      )}

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#ffffffff' }]}
        onPress={() => navigation.navigate('Category')}
      >
        <Text style={styles.btnText}>Toeic Practice</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#ffffffff' }]}
        onPress={() => navigation.navigate('Categorytest', { email_member: user.email_member })}
      >
        <Text style={styles.btnText}>Toeic Test</Text>
      </TouchableOpacity>

  

      {/* Profile Menu Modal */}
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
            <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
              <Ionicons name='person-outline' size={22} color='#007BFF' />
              <Text style={[styles.menuText, { color: '#007BFF' }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleHistory}>
              <Ionicons name='time-outline' size={22} color='#28a745' />
              <Text style={[styles.menuText, { color: '#28a745' }]}>
                History
              </Text>
            </TouchableOpacity>

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
 
// Styles เหมือนเดิม
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' },
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
  userCard: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  userEmail: { fontSize: 16, color: '#555' },
  mainBtn: {
    width: '50%',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#000',
  },
  btnText: { color: '#000000ff', fontSize: 18, fontWeight: 'bold' },
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
