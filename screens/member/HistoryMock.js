import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons'; // สำหรับไอคอน Back
 
export default function HistoryMock({ navigation }) { // รับ props navigation
  const [history, setHistory] = useState([]);

  // ข้อมูลจำลอง
  const mockHistory = [
    { test_id: 1, total_score: 5, date: '2025-10-01 10:30:00', t_category_id: 1, t_email_member: 'te@kk.com', t_test_questions_id: 1 },
    { test_id: 2, total_score: 8, date: '2025-10-03 14:15:00', t_category_id: 1, t_email_member: 'te@kk.com', t_test_questions_id: 2 },
    { test_id: 3, total_score: 7, date: '2025-10-05 09:00:00', t_category_id: 1, t_email_member: 'te@kk.com', t_test_questions_id: 3 },
    { test_id: 4, total_score: 6, date: '2025-10-07 16:45:00', t_category_id: 1, t_email_member: 'te@kk.com', t_test_questions_id: 4 },
  ];

  useEffect(() => {
    setHistory(mockHistory);
  }, []);

  // ข้อมูลกราฟ
  const chartData = {
    labels: history.map(item => item.date.split(' ')[0]),
    datasets: [
      { data: history.map(item => item.total_score), color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, strokeWidth: 2 },
    ],
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>score: {item.total_score}</Text>
      <Text style={styles.text}>date: {item.date}</Text>
      <Text style={styles.text}>category: {item.t_category_id}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ปุ่ม Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000000ff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Test History</Text>

      {history.length > 0 && (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          yAxisSuffix=" score"
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
