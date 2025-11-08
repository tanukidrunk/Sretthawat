import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
 
export default function TestHistory({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Member')}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Back to Member</Text>
      </TouchableOpacity>
 
      <Text style={styles.title}>Test History</Text>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#fff' }]}
        onPress={() => navigation.navigate('History', { categoryId: 1, categoryName: 'Vocabulary' })}
      >
        <Text style={styles.btnText}>Vocabulary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#fff' }]}
        onPress={() => navigation.navigate('History', { categoryId: 2, categoryName: 'Verbs' })}
      >
        <Text style={styles.btnText}>Verbs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#fff' }]}
        onPress={() => navigation.navigate('History', { categoryId: 3, categoryName: 'Tense' })}
      >
        <Text style={styles.btnText}>Tense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 15, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginBottom: 20 },
  backText: { fontSize: 16, color: '#007bff', marginLeft: 5 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 40 },
  mainBtn: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  btnText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
});
