import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // ãªéäÍ¤Í¹

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const res = await axios.post('http://10.0.2.2:3000/login', {
        email_member: email,
        password,
      });

      if (res.data && res.data.user) {
        Alert.alert('Success', `Welcome, ${res.data.user.first_name}`);
        navigation.navigate('Member', { user: res.data.user });
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        Alert.alert('Error', err.response.data.error);
      } else {
        Alert.alert('Error', 'Cannot connect to server. Make sure your IP is correct and server is running.');
      }
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1e90ff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('Loginadmin')}>
        <Text style={styles.adminButtonText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f0f4f7',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminButton: {
    marginTop: 15,
    alignItems: 'center',
    paddingVertical: 10,
  },
  adminButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
 