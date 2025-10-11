import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function Practice({ route, navigation }) {
  const { category, title } = route.params;
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    try {
      const res = await axios.get(
        `http://10.0.2.2:3000/admin/practice?category=${category}`
      );
      setPractices(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load practices');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('Quiz', { practiceId: item.practice_id })
      }
    >
      <Text style={styles.itemText}>{item.practice_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{title}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size='large'
          color='#000'
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={practices}
          keyExtractor={(item) => item.practice_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
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

  listContainer: {
    padding: 15,
  },

  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
  },

  itemText: { fontSize: 20, fontWeight: '600', color: '#000' },
});
