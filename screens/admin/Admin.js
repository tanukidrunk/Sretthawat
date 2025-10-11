import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Admin({ route, navigation }) {
  // รับข้อมูล user จาก Login.js
  const { user } = route.params || {};

  return (
    
    <View style={styles.container}>
        <View style={styles.topBar}>
                 <Button
          title="Logout"
          color="red"
          onPress={() => navigation.replace("Guest")} 
        />
              </View>
      {user ? (
        <>
          <Text style={styles.title}>
            Welcome, {user.first_name} {user.last_name}
          </Text>
          <Text>Email: {user.email_member}</Text>
        </>
      ) : (
        <Text>No user data received</Text>
      )}

      {/* ปุ่ม Toeic Practice */}
      <View style={styles.centerContent}>
      


        <Button
          title="Toeic Practice"
          onPress={() => navigation.navigate("Category")}
        />
      </View>

      <View style={styles.centerContent}>
        <Button
          title="Toeic Test"
          onPress={() => navigation.navigate("Categorytest")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10, // ใช้กับ RN >= 0.71, ถ้าไม่ได้ใช้ marginLeft เอา
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
