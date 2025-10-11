import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
 
export default function Registeradmin({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://10.0.2.2:3000/registeradmin', {
        email_admin: email,
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
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
});
