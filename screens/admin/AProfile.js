import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function AProfile({ route, navigation }) {
  const { admin } = route.params || {};
  const [firstName, setFirstName] = useState(admin?.first_name || "");
  const [lastName, setLastName] = useState(admin?.last_name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "กรุณากรอกชื่อและนามสกุล");
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert("Error", "รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!admin?.email_admin) {
      Alert.alert("Error", "ไม่พบข้อมูลอีเมลของผู้ดูแลระบบ");
      console.log("admin object:", admin);
      return;
    }

    try {
      console.log("ส่งคำขอแก้ไข admin:", admin.email_admin);

      const response = await axios.put(`http://10.0.2.2:3000/admin/${admin.email_admin}`, {
        first_name: firstName,
        last_name: lastName,
        ...(password ? { password } : {}),
      });

      if (response.data.success) {
        Alert.alert("สำเร็จ", "อัปเดตข้อมูลเรียบร้อยแล้ว");
        navigation.navigate("Home", {
          updatedadmin: { ...admin, first_name: firstName, last_name: lastName },
        });
      }
    } catch (err) {
      console.error("", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.error || "Server error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
