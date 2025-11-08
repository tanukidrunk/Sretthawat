import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert, // ? ????? Alert ??????
} from 'react-native';
import axios from 'axios';

const shuffleArray = (array) =>
  array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);

export default function Testquiz({ route, navigation }) {
  const { categoryId, email_member } = route.params;
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900);
  const [optionsList, setOptionsList] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, [categoryId]);

  useEffect(() => {
    if (questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish(calculateScore(userAnswers));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, userAnswers]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://10.0.2.2:3000/testquestions/${categoryId}`);

      if (response.data && response.data.length > 0) {
        let shuffled = shuffleArray(response.data);
        let selected = shuffled.slice(0, 10);
        const opts = selected.map((q) =>
          shuffleArray([q.answer1, q.answer2, q.answer3, q.correct_answer])
        );

        setQuestions(selected);
        setOptionsList(opts);
        setUserAnswers(new Array(selected.length).fill(null));
      } else {
        setError(`No questions found for categoryId: ${categoryId}`);
      }
    } catch (err) {
      setError('Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (answers) => {
    let total = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct_answer) total++;
    }
    return total;
  };

  const saveTestResult = async (finalScore) => {
    try {
      await axios.post('http://10.0.2.2:3000/savetest', {
        total_score: finalScore,
        t_category_id: categoryId,
        t_email_member: email_member,
      });
      console.log('The test results have been recorded.');
    } catch (err) {
      console.error('Error saving test result:', err);
    }
  }; 
 
   
  const handleFinish = (finalScore) => {
    const unanswered = userAnswers.filter((ans) => ans === null).length;

    if (unanswered > 0) {
      Alert.alert(
        'Confirm Submission',
        `You still have unanswered questions. ${unanswered} questions, Do you want to send it now?`,
        [
          { text: 'cancel', style: 'cancel' },
          {
            text: 'Submis',
            style: 'destructive',
            onPress: () => {
              saveTestResult(finalScore);
              navigation.replace('Resulttest', {
                score: finalScore,
                total: questions.length,
                questions,
                userAnswers,
                categoryId,
              });
            },
          },
        ]
      );
    } else {
      saveTestResult(finalScore);
      navigation.replace('Resulttest', {
        score: finalScore,
        total: questions.length,
        questions,
        userAnswers,
        categoryId,
      });
    }
  };

  const handleSelect = (selected) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = selected;
    setUserAnswers(updatedAnswers);
    setScore(calculateScore(updatedAnswers));
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = questions[index];
  const options = optionsList[index] || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.paginationContainer}>
        {questions.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => setIndex(i)}>
            <View
              style={[
                styles.dot,
                i === index && { backgroundColor: '#007AFF' },
                userAnswers[i] && { backgroundColor: '#FFA500' },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.question}>{`${index + 1}. ${currentQ.test_Questions}`}</Text>

      {options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.btn,
            userAnswers[index] === opt && { backgroundColor: '#d1e7dd' },
          ]}
          onPress={() => handleSelect(opt)}
        >
          <Text style={styles.btnText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.navBtn, index === 0 && { backgroundColor: '#ccc' }]}
          disabled={index === 0}
          onPress={() => setIndex(index - 1)}
        >
          <Text style={styles.navText}>back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => {
            if (index + 1 < questions.length) {
              setIndex(index + 1);
            } else {
              handleFinish(calculateScore(userAnswers));
            }
          }}
        >
          <Text style={styles.navText}>
            {index + 1 === questions.length
              ? 'Submit'
              : userAnswers[index]
              ? 'next'
              : 'skip'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// -------- STYLE --------
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 15 },
  timerText: { fontSize: 20, fontWeight: 'bold', color: '#e63946' },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
    marginVertical: 2,
  },
  question: { fontSize: 18, marginBottom: 25, lineHeight: 24, color: '#333' },
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
  retryBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginBottom: 10 },
  retryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  backBtn: { backgroundColor: '#666', padding: 10, borderRadius: 8 },
  backBtnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
