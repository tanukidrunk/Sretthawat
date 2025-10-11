import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Portal, Dialog, Button, Provider } from 'react-native-paper';

const shuffleArray = (array) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

export default function Quiz({ route, navigation }) {
  const { practiceId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answeredIndexes, setAnsweredIndexes] = useState([]); // track answered questions

  useEffect(() => {
    fetchQuestions();
  }, [practiceId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://10.0.2.2:3000/practicequestions/${practiceId}`
      );
      if (response.data && response.data.length > 0) {
        let shuffled = shuffleArray(response.data);
        let selected = shuffled.slice(0, 10);
        setQuestions(selected);
      } else {
        setError(`No questions found for practiceId: ${practiceId}`);
        navigation.goBack();
      }
    } catch (err) {
      setError('Error loading questions');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selected) => {
    const currentQ = questions[index];
    let explanationText = '';

    if (selected === currentQ.correct_answer) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      explanationText = currentQ.correct_explanation;
    } else if (selected === currentQ.answer1) {
      explanationText = currentQ.answer1_explanation;
      setIsCorrect(false);
    } else if (selected === currentQ.answer2) {
      explanationText = currentQ.answer2_explanation;
      setIsCorrect(false);
    } else if (selected === currentQ.answer3) {
      explanationText = currentQ.answer3_explanation;
      setIsCorrect(false);
    }

    setExplanation(explanationText);
    setShowDialog(true);
    setAnsweredIndexes((prev) => [...prev, index]); // mark as answered
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      navigation.navigate('Result', { score, total: questions.length });
    }
    setShowDialog(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error || questions.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error || 'No questions found'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchQuestions}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = questions[index];
  const options = shuffleArray([
    currentQ.answer1,
    currentQ.answer2,
    currentQ.answer3,
    currentQ.correct_answer,
  ]);

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dotsContainer}>
            {questions.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === index
                        ? '#007AFF' // current question
                        : answeredIndexes.includes(i)
                        ? '#FFA500' // answered ? orange
                        : '#ccc', // not answered
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>

        <Text style={styles.question}>{`Q${index + 1}: ${
          currentQ.practice_Questions
        }`}</Text>

        {options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.btn}
            onPress={() => handleAnswer(opt)}
            disabled={showDialog} // disable buttons while dialog is open
          >
            <Text style={styles.btnText}>{opt}</Text>
          </TouchableOpacity>
        ))}

        {/* Dialog */}
        <Portal>
          <Dialog
            visible={showDialog}
            dismissable={false} // cannot dismiss by tapping outside
            style={{
              backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
              borderRadius: 12,
              paddingVertical: 15,
              marginHorizontal: 20,
            }}
          >
            <Dialog.Title
              style={{
                color: isCorrect ? '#155724' : '#721c24',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20,
              }}
            >
              {isCorrect ? 'Correct!' : 'Wrong'}
            </Dialog.Title>

            <Dialog.Content style={{ maxHeight: 200 }}>
              <ScrollView>
                <Text
                  style={{
                    color: isCorrect ? '#155724' : '#721c24',
                    textAlign: 'center',
                    fontSize: 16,
                    lineHeight: 22,
                  }}
                >
                  {explanation}
                </Text>
              </ScrollView>
            </Dialog.Content>

            <Dialog.Actions style={{ justifyContent: 'center', marginTop: 10 }}>
              <Button
                onPress={handleNext}
                style={{
                  backgroundColor: isCorrect ? '#28a745' : '#dc3545',
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              >
                {index + 1 === questions.length
                  ? 'View Result'
                  : 'Next Question'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20, alignItems: 'center' },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 4 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  question: {
    fontSize: 18,
    marginBottom: 30,
    lineHeight: 24,
    textAlign: 'center',
  },
  btn: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnText: { fontSize: 16, textAlign: 'center' },
  loadingText: { fontSize: 18, color: '#666' },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backBtn: { backgroundColor: '#666', padding: 10, borderRadius: 8 },
  backBtnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
