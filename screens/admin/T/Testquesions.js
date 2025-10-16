import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import axios from "axios";
  
export default function Testquesions({ route, navigation }) {
  const { categoryId } = route.params; 
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchQuestions();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `http://10.0.2.2:3000/admin/test/questions/category/${categoryId}`
      );
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load questions");
    }
  };

  const addQuestion = async () => {
    if (!text.trim()) {
      Alert.alert("Please fill in the question.");
      return;
    }

    try {
      await axios.post("http://10.0.2.2:3000/admin/test/questions", {
        test_Questions: text,
        answer1: "",
        answer2: "",
        answer3: "",
        correct_answer: "",
        tq_category_id: categoryId,
      });
      Alert.alert("Success", "Question added successfully");
      setText("");
      fetchQuestions();
    } catch (err) {
      console.error("Add question error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to save question");
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/admin/test/questions/${id}`);
      Alert.alert("Deleted", "Question deleted successfully");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Delete failed");
    }
  };

  const editQuestion = (id) => {
    navigation.navigate("TQ", {
      questionId: id,
      categoryId: categoryId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>

        

        
      </View>
      <Text style={styles.header}>Test Questions</Text>

      <FlatList
        data={questions}
        keyExtractor={(item, index) => (item.test_Questions_id || index).toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.test_Questions}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editQuestion(item.test_Questions_id)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteQuestion(item.test_Questions_id)}
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
  },
  itemText: { fontSize: 16, flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  row: { flexDirection: "row", marginTop: 10 },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
