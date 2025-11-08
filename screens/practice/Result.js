import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function Result({ route, navigation }) {
  const { score, total, questions = [], userAnswers = [] } = route.params;
  const wrong = total - score;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Result</Text>

      {/* Summary Correct/Wrong */}
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: '#28a745' }]}>
          <Text style={styles.boxTitle}>Correct</Text>
          <Text style={styles.boxCount}>{score}</Text>
        </View>
        <View style={[styles.box, { backgroundColor: '#dc3545' }]}>
          <Text style={styles.boxTitle}>Wrong</Text>
          <Text style={styles.boxCount}>{wrong}</Text>
        </View>
      </View>

      <Text style={styles.total}>Total Questions: {total}</Text>

      {/* Question List */}
      {questions.map((q, i) => {
        const isCorrect = q.correct_answer === userAnswers[i];
        return (
          <View
            key={i}
            style={[styles.item, { backgroundColor: isCorrect ? '#d4edda' : '#f8d7da' }]}
          >
            <Text style={styles.questionText}>
              {i + 1}. {q.practice_question || q.test_Questions}
            </Text>
            <Text style={{ color: isCorrect ? '#155724' : '#721c24' }}>
              Your answer: {userAnswers[i] || 'No answer'}
            </Text>
            {!isCorrect && (
              <Text style={styles.correctAnswer}>
                Correct: {q.correct_answer}
              </Text>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#007bff' }]}
        onPress={() => navigation.replace('Guest')}
      >
        <Text style={styles.btnText}>Back to Categories</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  box: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  boxCount: { fontSize: 26, color: '#fff', fontWeight: 'bold' },

  total: { fontSize: 18, marginBottom: 20, textAlign: 'center' },

  item: { padding: 15, borderRadius: 10, marginBottom: 10 },
  questionText: { fontWeight: 'bold', marginBottom: 5 },
  correctAnswer: { color: '#155724', fontWeight: 'bold' },

  btn: { marginTop: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
