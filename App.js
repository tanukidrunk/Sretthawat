import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// ?? import ทุกหน้า
import Login from './screens/Login';
import Register from './screens/Register';

import Guest from './screens/Guest';
import Category from './screens/practice/Category';
import Practice from './screens/practice/Practice';
import Quiz from './screens/practice/Quiz';

import Member from './screens/member/Member';
import Categorytest from './screens/testo/Categorytest';
import Testquiz from './screens/testo/Testquiz';
import Result from './screens/practice/Result';
import TestHistory from './screens/member/TestHistory';
import HistoryChart from './screens/member/HistoryChart';

import Admin from './screens/admin/Admin';
import Home from './screens/admin/Home';
import Loginadmin from './screens/admin/Loginadmin';
import Practiceform from './screens/admin/P/Practiceform';
import Pquestionform from './screens/admin/P/Pquestionform';
import Testquesions from './screens/admin/T/Testquesions';
import Registeradmin from './screens/admin/Registeradmin';
import ctgp from './screens/admin/P/ctgp';
import ctgt from './screens/admin/T/ctgt';
import Plist from './screens/admin/P/Plist';
import PQ from './screens/admin/P/PQ';
import TQ from './screens/admin/T/TQ';
import AProfile from './screens/admin/AProfile';
import Profile from './screens/member/Profile';
import Resulttest from './screens/testo/Resulttest';

import HistoryMock from './screens/member/HistoryMock';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* ?? เปลี่ยนสี StatusBar ให้เข้ากับ Header */}
      <StatusBar barStyle='light-content' backgroundColor='#000' />

      <Stack.Navigator
        initialRouteName='Guest'
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#000' },
        }}
      >
        {/* ?? รายชื่อหน้าทั้งหมด */}
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Guest' component={Guest} />
        <Stack.Screen name='Category' component={Category} />
        <Stack.Screen name='Practice' component={Practice} />
        <Stack.Screen name='Quiz' component={Quiz} />
        <Stack.Screen name='Result' component={Result} />
        <Stack.Screen name='Member' component={Member} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='Categorytest' component={Categorytest} />
        <Stack.Screen name='Testquiz' component={Testquiz} />
        <Stack.Screen name='TestHistory' component={TestHistory} />
        <Stack.Screen name='HistoryChart' component={HistoryChart} />
        <Stack.Screen name='Admin' component={Admin} />
        <Stack.Screen name='AProfile' component={AProfile} />
        <Stack.Screen name='Registeradmin' component={Registeradmin} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Loginadmin' component={Loginadmin} />
        <Stack.Screen name='Practiceform' component={Practiceform} />
        <Stack.Screen name='Pquestionform' component={Pquestionform} />
        <Stack.Screen name='Testquesions' component={Testquesions} />
        <Stack.Screen name='ACategorypractice' component={ctgp} />
        <Stack.Screen name='ACategorytest' component={ctgt} />
        <Stack.Screen name='Plist' component={Plist} />
        <Stack.Screen name='PQ' component={PQ} />
        <Stack.Screen name='TQ' component={TQ} />
        <Stack.Screen name='Resulttest' component={Resulttest} />

         <Stack.Screen name='HistoryMock' component={HistoryMock} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
