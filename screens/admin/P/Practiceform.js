import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
 
export default function Practiceform({ route, navigation }) {
  const [name, setName] = useState("");
  const categoryId = route.params?.categoryId;
  const refresh = route.params?.refresh;

  const handleSave = async () => {
  if (!name) {
    Alert.alert("Error", "Please enter practice name");
    return;
  }

  try {
    const res = await axios.post("http://10.0.2.2:3000/admin/practice", {
      practice_name: name,
      category_id: Number(categoryId), // แปลงเป็น number
    });

    Alert.alert("Success", "Practice saved successfully");

    if (refresh) refresh(); 
    navigation.goBack();
  } catch (err) {
    console.error(err.response?.data || err.message);
    Alert.alert("Error", err.response?.data?.error || "Failed to save practice");
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Practice Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter practice name"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Practice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
