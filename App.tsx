/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import SignupScreen from "./src/screens/SignupScreen";
import CollegeStudentLogin from "./src/screens/CollegeStudentLogin";
import StudentLogin from "./src/screens/StudentLogin";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileHome from "./src/components/ProfileHome";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="CollegeStudentLogin" component={CollegeStudentLogin} />
        <Stack.Screen name="StudentLogin" component={StudentLogin} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
