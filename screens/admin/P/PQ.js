import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
 
export default function PQ({ route, navigation }) {
  const { questionId, practiceId } = route.params;

  const [question, setQuestion] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  const [answer1Exp, setAnswer1Exp] = useState('');
  const [answer2Exp, setAnswer2Exp] = useState('');
  const [answer3Exp, setAnswer3Exp] = useState('');
  const [correctExp, setCorrectExp] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(
        `http://10.0.2.2:3000/admin/practice/question/${questionId}`
      );
      const q = res.data;

      setQuestion(q.practice_Questions);
      setAnswer1(q.answer1);
      setAnswer2(q.answer2);
      setAnswer3(q.answer3);
      setCorrectAnswer(q.correct_answer);

      setAnswer1Exp(q.answer1_explanation || '');
      setAnswer2Exp(q.answer2_explanation || '');
      setAnswer3Exp(q.answer3_explanation || '');
      setCorrectExp(q.correct_explanation || '');
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to fetch question');
    }
  };

  const saveQuestion = async () => {
    if (!question.trim() || !correctAnswer.trim()) {
      Alert.alert('Validation', 'Question and correct answer cannot be empty');
      return;
    }

    try {
      await axios.put(
        `http://10.0.2.2:3000/admin/practice/questions/${questionId}`,
        {
          practice_Questions: question,
          answer1,
          answer2,
          answer3,
          correct_answer: correctAnswer,
          answer1_explanation: answer1Exp,
          answer2_explanation: answer2Exp,
          answer3_explanation: answer3Exp,
          correct_explanation: correctExp,
          pq_practice_id: practiceId,
        }
      );
      Alert.alert('Success', 'Question updated successfully');
      navigation.goBack();
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to update question');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Practice Question</Text>

      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <Text style={styles.label}>Answer 1:</Text>
      <TextInput
        style={styles.input}
        value={answer1}
        onChangeText={setAnswer1}
      />
      <Text style={styles.label}>Answer 1 Explanation:</Text>
      <TextInput
        style={styles.input}
        value={answer1Exp}
        onChangeText={setAnswer1Exp}
        multiline
      />

      <Text style={styles.label}>Answer 2:</Text>
      <TextInput
        style={styles.input}
        value={answer2}
        onChangeText={setAnswer2}
      />
      <Text style={styles.label}>Answer 2 Explanation:</Text>
      <TextInput
        style={styles.input}
        value={answer2Exp}
        onChangeText={setAnswer2Exp}
        multiline
      />

      <Text style={styles.label}>Answer 3:</Text>
      <TextInput
        style={styles.input}
        value={answer3}
        onChangeText={setAnswer3}
      />
      <Text style={styles.label}>Answer 3 Explanation:</Text>
      <TextInput
        style={styles.input}
        value={answer3Exp}
        onChangeText={setAnswer3Exp}
        multiline
      />

      <Text style={styles.label}>Correct Answer:</Text>
      <TextInput
        style={styles.input}
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
      />
      <Text style={styles.label}>Correct Answer Explanation:</Text>
      <TextInput
        style={styles.input}
        value={correctExp}
        onChangeText={setCorrectExp}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveQuestion}>
        <Text style={styles.btnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
