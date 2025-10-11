import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // ãªéäÍ¤Í¹
 
export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !firstName || !lastName || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://10.0.2.2:3000/register', {
        email_member: email,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      Alert.alert('Success', res.data.message);
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name='arrow-back' size={24} color='#28a745' />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType='email-address'
        autoCapitalize='none'
        placeholderTextColor='#888'
      />
      <TextInput
        placeholder='First Name'
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        placeholderTextColor='#888'
      />
      <TextInput
        placeholder='Last Name'
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        placeholderTextColor='#888'
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor='#888'
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
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
    color: '#0000ffff',
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
    marginVertical: 8,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#0051ffff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
