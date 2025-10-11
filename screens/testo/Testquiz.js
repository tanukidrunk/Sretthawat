import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const shuffleArray = (array) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

export default function Testquiz({ route, navigation }) {
  const { categoryId, userEmail } = route.params; // เพิ่ม userEmail
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900);
  const [optionsList, setOptionsList] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  // -------- FETCH QUESTIONS --------
  useEffect(() => {
    fetchQuestions();
  }, [categoryId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`http://10.0.2.2:3000/testquestions/${categoryId}`);

      if (response.data && response.data.length > 0) {
        let shuffled = shuffleArray(response.data);
        let selected = shuffled.slice(0, 10);

        const opts = selected.map((q) =>
          shuffleArray([q.answer1, q.answer2, q.answer3, q.correct_answer])
        );

        setQuestions(selected);
        setOptionsList(opts);
        setAnswered(new Array(selected.length).fill(false));
        setUserAnswers(new Array(selected.length).fill(null));
      } else {
        const msg = `No questions found for categoryId: ${categoryId}`;
        setError(msg);
        Alert.alert('No Questions', msg, [
          { text: 'Back', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      let errorMessage = 'Error loading questions';
      if (err.response) {
        if (err.response.status === 404)
          errorMessage = `No questions found for categoryId: ${categoryId}`;
        else if (err.response.data?.message) errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Cannot connect to server';
      }
      setError(errorMessage);
      Alert.alert('Error', errorMessage, [
        { text: 'Try Again', onPress: fetchQuestions },
        { text: 'Back', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // -------- SAVE TEST RESULT --------
  const saveTestResult = async (finalScore, finalUserAnswers) => {
    try {
      // รวบรวม question IDs
      const questionIds = questions.map(q => q.test_questions_id || q.id);
      
      await axios.post('http://10.0.2.2:3000/api/saveTestResult', {
        total_score: finalScore,
        t_category_id: categoryId,
        t_email_member: userEmail,
        test_questions: questionIds
      });
      
      console.log('Test result saved successfully');
    } catch (error) {
      console.error('Error saving test result:', error);
      // ไม่ต้อง Alert เพื่อไม่ให้รบกวนผู้ใช้
    }
  };

  // -------- TIMER --------
  useEffect(() => {
    if (questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // บันทึกคะแนนก่อนไปหน้าผลลัพธ์
          saveTestResult(score, userAnswers);
          navigation.replace('Resulttest', {
            score,
            total: questions.length,
            questions,
            userAnswers,
            categoryId,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions]);

  // -------- HANDLE SELECT --------
  const handleSelect = (selected) => {
    const currentQ = questions[index];
    const updatedAnswered = [...answered];
    const updatedUserAnswers = [...userAnswers];

    updatedAnswered[index] = true;
    updatedUserAnswers[index] = selected;

    setAnswered(updatedAnswered);
    setUserAnswers(updatedUserAnswers);

    const isCorrect = selected === currentQ.correct_answer;
    const updatedScore = score + (isCorrect ? 1 : 0);
    setScore(updatedScore);

    if (index + 1 < questions.length) {
      setTimeout(() => setIndex(index + 1), 500);
    } else {
      // บันทึกคะแนนเมื่อทำข้อสุดท้ายเสร็จ
      saveTestResult(updatedScore, updatedUserAnswers);
      navigation.replace('Resulttest', {
        score: updatedScore,
        total: questions.length,
        questions,
        userAnswers: updatedUserAnswers,
        categoryId,
      });
    }
  };

  // -------- FORMAT TIME --------
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // -------- RENDER --------
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
      {/* ---------- Header (Timer only) ---------- */}
      <View style={styles.header}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* ---------- Pagination Dots ---------- */}
      <View style={styles.paginationContainer}>
        {questions.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index && { backgroundColor: '#007AFF' },
              answered[i] && { backgroundColor: '#FFA500' },
            ]}
          />
        ))}
      </View>

      {/* ---------- Question ---------- */}
      <Text style={styles.question}>{currentQ.test_Questions}</Text>

      {/* ---------- Options ---------- */}
      {options.map((opt, idx) => (
        <TouchableOpacity key={idx} style={styles.btn} onPress={() => handleSelect(opt)}>
          <Text style={styles.btnText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 15 },
  timerText: { fontSize: 20, fontWeight: 'bold', color: '#e63946' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ccc', marginHorizontal: 4, marginVertical: 2 },
  question: { fontSize: 18, marginBottom: 25, lineHeight: 24, color: '#333' },
  btn: { padding: 15, backgroundColor: '#fff', marginVertical: 8, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  btnText: { fontSize: 16, textAlign: 'center' },
  loadingText: { fontSize: 18, color: '#666' },
  errorText: { fontSize: 16, color: '#ff6b6b', textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginBottom: 10 },
  retryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  backBtn: { backgroundColor: '#666', padding: 10, borderRadius: 8 },
  backBtnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});