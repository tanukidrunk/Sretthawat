import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function Pquestionform({ route, navigation }) {
  const { practiceId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchQuestions();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `http://10.0.2.2:3000/admin/practice/questions/${practiceId}`
      );
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load questions');
    }
  };

  const addQuestion = async () => {
    if (!text.trim()) {
      Alert.alert('Please fill in the question.');
      return;
    }

    try {
      await axios.post('http://10.0.2.2:3000/admin/practice/questions', {
        practice_Questions: text,
        answer1: '',
        answer2: '',
        answer3: '',
        correct_answer: '',
        answer1_explanation: '',
        answer2_explanation: '',
        answer3_explanation: '',
        correct_explanation: '',
        pq_practice_id: practiceId,
      });
      Alert.alert('Success', 'Question added successfully');
      setText('');
      fetchQuestions();
    } catch (err) {
      console.error('Add question error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to save question');
    }
  };

  // ? ¿Ñ§¡ìªÑ¹Åº¤Ó¶ÒÁ
  const deleteQuestion = (questionId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(
                `http://10.0.2.2:3000/admin/practice/questions/${questionId}`
              );
              Alert.alert('Deleted', 'Question deleted successfully');
              fetchQuestions(); // âËÅ´¢éÍÁÙÅãËÁèËÅÑ§Åº
            } catch (err) {
              console.error('Delete question error:', err);
              Alert.alert('Error', 'Failed to delete question');
            }
          },
        },
      ]
    );
  };

  // ? ¿Ñ§¡ìªÑ¹Åºáºº½Ö¡ (ÂÑ§¤§à´ÔÁ)
  const deletePractice = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this practice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://10.0.2.2:3000/admin/practice/${id}`);
              Alert.alert('Deleted', 'Practice deleted successfully');
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to delete practice');
            }
          },
        },
      ]
    );
  };

  const editQuestion = (id) => {
    navigation.navigate('PQ', {
      questionId: id,
      practiceId: practiceId,
    });
  };

  return (
    <View style={styles.container}>
      {/* -------- Go Back Button -------- */}
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Question List</Text>

      <FlatList
        data={questions}
        keyExtractor={(item, index) =>
          (
            item.practice_question_id ||
            item.practice_Questions_id ||
            index
          ).toString()
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.practice_question || item.practice_Questions}
            </Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editQuestion(item.practice_Questions_id)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteQuestion(item.practice_Questions_id)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Type a question"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
        <Text style={styles.btnText}>Add Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },

  goBackButton: {
    marginBottom: 10,
  },
  goBackText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  itemText: { fontSize: 16, flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  row: { flexDirection: 'row', marginTop: 10 },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
