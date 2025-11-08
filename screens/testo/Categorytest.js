import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Categorytest({ route, navigation }) {
  // ? รับ email_member จากหน้า Member
  const { email_member } = route.params;

  return (
    <View style={styles.container}>
      
      <View class='topBar' style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Category test</Text>
      </View>

      {/*Category */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Testquiz', {
              categoryId: 1,
              email_member: email_member, 
            })
          }
        >
          <Text style={styles.buttonText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Testquiz', {
              categoryId: 2,
              email_member: email_member, 
            })
          }
        >
          <Text style={styles.buttonText}>Verb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Testquiz', {
              categoryId: 3,
              email_member: email_member, 
            })
          }
        >
          <Text style={styles.buttonText}>Tense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
