import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
  
export default function TQ({ route, navigation }) {
  const { questionId, categoryId } = route.params;

  const [question, setQuestion] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`http://10.0.2.2:3000/admin/test/questions`);
      const q = res.data.find((item) => item.test_Questions_id === questionId);
      if (q) {
        setQuestion(q.test_Questions);
        setAnswer1(q.answer1);
        setAnswer2(q.answer2);
        setAnswer3(q.answer3);
        setCorrectAnswer(q.correct_answer);
      } else {
        Alert.alert("Error", "Question not found");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch question");
    }
  };

  const saveQuestion = async () => {
    if (!question.trim() || !correctAnswer.trim()) {
      Alert.alert("Validation", "Question and correct answer cannot be empty");
      return;
    }

    try {
      await axios.put(`http://10.0.2.2:3000/admin/test/questions/${questionId}`, {
        test_Questions: question,
        answer1,
        answer2,
        answer3,
        correct_answer: correctAnswer,
        tq_category_id: categoryId,
      });
      Alert.alert("Success", "Question updated successfully");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update question");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Test Question</Text>

      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <Text style={styles.label}>Answer 1:</Text>
      <TextInput style={styles.input} value={answer1} onChangeText={setAnswer1} />

      <Text style={styles.label}>Answer 2:</Text>
      <TextInput style={styles.input} value={answer2} onChangeText={setAnswer2} />

      <Text style={styles.label}>Answer 3:</Text>
      <TextInput style={styles.input} value={answer3} onChangeText={setAnswer3} />

      <Text style={styles.label}>Correct Answer:</Text>
      <TextInput
        style={styles.input}
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
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
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
