import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Category({ navigation }) {
  const categories = [
    { id: 1, label: 'Vocabulary' },
    { id: 2, label: 'Verb' },
    { id: 3, label: 'Tense' },
  ];
 
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Category</Text>
      </View>

      {/* ??????? */}
      <View style={styles.content}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.button}
            onPress={() =>
              navigation.navigate('Practice', {
                category: item.id,
                title: item.label,
              })
            }
          >
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ? ??? Back ???????? Header ???????
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  backButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },

  backText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },

  buttonText: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
