import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
  
export default function Resulttest({ route, navigation }) {
  const { score, total, questions = [], userAnswers = [] } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Test Result</Text>
      <Text style={styles.score}>
        Score: {score} / {total}
      </Text>

      {/* แสดงรายการข้อ */}
      {questions.map((q, i) => {
        const isCorrect = q.correct_answer === userAnswers[i];
        return (
          <View
            key={i}
            style={[
              styles.item,
              { backgroundColor: isCorrect ? '#d4edda' : '#f8d7da' },
            ]}
          >
            <Text style={styles.questionText}>
              {i + 1}. {q.test_Questions}
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
        onPress={() => navigation.replace('Categorytest')}
      >
        <Text style={styles.btnText}>Back to Categories</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  score: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  item: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionText: { fontWeight: 'bold', marginBottom: 5 },
  correctAnswer: { color: '#155724', fontWeight: 'bold' },
  btn: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
