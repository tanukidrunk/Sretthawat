import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function Plist({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPractices = async () => {
    try {
      const res = await axios.get(
        `http://10.0.2.2:3000/admin/practice/category/${categoryId}`
      );
      setPractices(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load practices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractices();
  }, []);

  const deletePractice = async (practiceId) => {
    try {
      await axios.delete(`http://10.0.2.2:3000/admin/practice/${practiceId}`);
      setPractices((prev) => prev.filter((p) => p.practice_id !== practiceId));
      Alert.alert('Success', 'Practice deleted successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete practice');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate('Pquestionform', {
            practiceId: item.practice_id,
            practice: item,
          })
        }
      >
        <Text style={styles.text}>
          {item.practice_id}. {item.practice_name}
        </Text>
      </TouchableOpacity>

      {/* ปุ่มลบ */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this practice?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deletePractice(item.practice_id) },
            ]
          )
        }
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* -------- Top Bar -------- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back-outline' size={28} color='white' />
        </TouchableOpacity>

        <Text style={styles.adminText}>Admin</Text>

        <TouchableOpacity>
          <Ionicons name='person-circle-outline' size={35} color='white' />
        </TouchableOpacity>
      </View>

      {/* -------- Title -------- */}
      <Text style={styles.title}>{categoryName}</Text>

      {/* -------- ปุ่มเพิ่ม Practice -------- */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Practiceform', { categoryId: categoryId })
        }
      >
        <Text style={styles.buttonText}>+ Add Practice</Text>
      </TouchableOpacity>

      {/* -------- รายการ Practice -------- */}
      {loading ? (
        <ActivityIndicator size='large' color='green' />
      ) : (
        <FlatList
          data={practices}
          keyExtractor={(item) => item.practice_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // ---------- Top Bar ----------
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  adminText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ---------- Title & List ----------
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 20,
  },
  item: {
    flexDirection: 'row',   // ทำให้ชื่อและปุ่มอยู่ในแถวเดียว
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  text: { fontSize: 16 },

  // ---------- Add button ----------
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
