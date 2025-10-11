import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
 
export default function Loginadmin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    try {
      const res = await axios.post('http://10.0.2.2:3000/loginadmin', {
        email_admin: email,
        password,
      });

      Alert.alert('Success', res.data.message);
      navigation.navigate('Home', { admin: res.data.admin });
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Admin Login</Text>

        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // สีพื้นหลังอ่อนๆ
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a', // น้ำเงินเข้ม
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#2563eb', // น้ำเงินสด
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
