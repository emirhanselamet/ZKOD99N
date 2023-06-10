import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Modal, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HuScreen = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation()

  const getLocaldata = async () => {
    const username = await AsyncStorage.getItem("username").then((data) => {
      setUsername(data);
    });
    const password = await AsyncStorage.getItem("password").then((data) =>
      setPassword(data)
    );
  };

  const fetchDataFromSap = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get(`${BASE_URL}&EXIDV=${value}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        auth: {
          username: username,
          password: password,
        },
      });
      setData(data.data)
      setError(null);
      navigation.navigate('Print', {
        data: data.data,
        hu: value
      })
      setValue('')
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
    finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    getLocaldata();
    setError(null);
  }, []);

  
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/marelli-logo-history.png')}
        style={{ width: 200, height: 200 }}
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {username ? (
        <Text>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{username}</Text>{" "}
          Olarak Giriş Yapıldı
        </Text>
      ) : null}

      <TextInput
        value={value}
        autoFocus={true}
        onChangeText={(text) => setValue(text)}
        placeholder="HU Numarası Giriniz"
        style={styles.input}
        keyboardType="numeric"
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
          if (value === '') {
            alert("Tüm alanları doldur");
          } else {
            fetchDataFromSap()
          }
        }}
      >
        <Text style={{ color: "white" }}>Tamamla</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          setIsLoading(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Text>
            Lütfen Bekleyiniz...
          </Text>
          <ActivityIndicator size="large" color="blue" />
        </View>
      </Modal>


      <StatusBar style="auto" />
    </View>
  );
};
export default HuScreen;

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
