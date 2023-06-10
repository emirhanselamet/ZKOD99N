import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [value, setValue] = useState(0);
  const [error, setError] = useState(null);
  const navigation = useNavigation();



  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get(`${BASE_URL}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        auth: {
          username: username,
          password: password,
        },
      });
      // console.log(data);
      setError(null);
    } catch (error) {

      // console.log(error);

      if (error.response.status === 400) {
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('password', password)

        navigation.navigate("HU");

      } else {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    setError(null);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/marelli-logo-history.png')}
        style={{ width: 200, height: 200 }}
      />

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <TextInput
        placeholder="Kullanıcı Adı"
        onChangeText={(t) => setUsername(t)}
        style={styles.input}
      />
      <TextInput
        placeholder="Parola"
        onChangeText={(t) => setPassword(t)}
        style={styles.input}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={{
          width: 250,
          height: 55,
          backgroundColor: "blue",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={() => {
          if (username === "" || password === "") {
            Alert.alert('ZKOD99N', 'Tüm alanları doldur');
          } else {
            handleLogin();
          }
        }}
      >
        <Text style={{ color: "white" }}>Giriş Yap</Text>
      </TouchableOpacity>
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000099",
          }}
        >
          <Text style={{ color: "white" }}>Lütfen Bekleyiniz</Text>
          <ActivityIndicator size="large" color="blue" />
        </View>

      </Modal>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: 250,
    height: 50,
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
});
