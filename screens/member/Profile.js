import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function Profile({ route, navigation }) {
  const { user } = route.params;

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'กรุณากรอกชื่อและนามสกุล');
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await axios.put(`http://10.0.2.2:3000/member/${user.email_member}`, {
        first_name: firstName,
        last_name: lastName,
        ...(password ? { password } : {}),
      });

      if (response.data.success) {
        Alert.alert('Success', 'updated successfully');

        // ส่งข้อมูลอัปเดตกลับ Member ผ่าน goBack()
        navigation.navigate('Member', {
          updatedUser: { ...user, first_name: firstName, last_name: lastName }
        });
      } else {
        Alert.alert('Error', 'error occurred while updating the data.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Password </Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5, backgroundColor: '#fff' },
  saveBtn: { marginTop: 30, backgroundColor: '#007BFF', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
 