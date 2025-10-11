import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 
export default function Guest({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Bar */} 
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <TouchableOpacity
          style={[styles.button, styles.mainButton]}
          onPress={() => navigation.navigate('Category')}
        >
          <Text style={styles.buttonText}>Toeic Practice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10, 
    padding: 15,
    backgroundColor: '#000000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
 
  // ปุ่มพื้นฐาน
  button: {
    backgroundColor: '#ffffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  // ปุ่มหลัก (ใหญ่กว่า/เด่นกว่า)
mainButton: {
  backgroundColor: '#ffffffff', // เขียว
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 8,       // ขอบมน (ถ้าต้องการ)
  borderWidth: 2,        // ความหนาของเส้นขอบ
  borderColor: '#000000ff',   // สีขอบ (เช่น ขาว)
},
  // ตัวหนังสือบนปุ่ม
  buttonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
