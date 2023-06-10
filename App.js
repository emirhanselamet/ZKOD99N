import { decode, encode } from "base-64";
import React, { useEffect } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  Login  from "./screens/Login";
import  HuScreen from "./screens/HuScreen";
import PrintScreen from "./screens/PrintScreen";


const Stack = createNativeStackNavigator();

if (!global.btoa) {
  global.btoa = encode;
}


if (!global.atob) {
  global.atob = decode;
}


export default function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{
        headerShown:false
      }}/>

      <Stack.Screen name="HU" component={HuScreen} options={{
        headerShown:false
      }} />

<Stack.Screen name="Print" component={PrintScreen} options={{
        headerShown:false
      }} />

      </Stack.Navigator>
     </NavigationContainer>
  );
}
