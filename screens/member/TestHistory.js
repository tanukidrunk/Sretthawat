import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function TestHistory({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      <Text style={styles.title}>Test History</Text>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#ffffffff' }]}
        onPress={() => navigation.navigate('Category')}
      >
        <Text style={styles.btnText}>vocabulary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#ffffffff' }]}
        onPress={() => navigation.navigate('Categorytest')}
      >
        <Text style={styles.btnText}>Verbs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#ffffffff' }]}
        onPress={() => navigation.navigate('HistoryMock')}
      >
        <Text style={styles.btnText}>Tense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  mainBtn: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#000',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  
});
