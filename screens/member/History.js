import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function History({ route, navigation }) {
  const { categoryId, categoryName } = route.params; 
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ?? ??????????????????????????
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:3000/history/${categoryId}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const chartData = {
    labels: history.map(item => item.date.split(' ')[0]),
    datasets: [
      {
        data: history.map(item => item.total_score),
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>Score: {item.total_score}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Category ID: {item.t_category_id}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000000ff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Test History — {categoryName}</Text>

      {history.length > 0 && (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#007bff' },
          }}
          style={{ marginVertical: 16, borderRadius: 16 }}
        />
      )}

      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.test_id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.text}>There is no test history yet</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 10, marginBottom: 10 },
  text: { fontSize: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backText: { fontSize: 16, color: '#007bff', marginLeft: 5 },
});
