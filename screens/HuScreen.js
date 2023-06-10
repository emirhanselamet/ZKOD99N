import { StyleSheet, Text, View, TextInput,TouchableOpacity,StatusBar } from "react-native";
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
  const [data,setData] = useState({})
  const navigation = useNavigation()
  const getLocaldata = async () => {
    const username = await AsyncStorage.getItem("username").then((data) => {
      setUsername(data);
    });
    const password = await AsyncStorage.getItem("password").then((data) =>
      setPassword(data)
    );
  };
  const fetch = async () => {
    try {
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
    navigation.navigate('Print',{
        data: data.data,
        hu: value
    })
    setValue('')
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };
  useEffect(() => {
    getLocaldata();
    setError(null);
  }, []);

  const  handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
   // alert(keyValue)
};
  return (
    <View style={styles.container}>
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
        onKeyPress={handleKeyPress}
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
            fetch()
          }
        }}
      >
        <Text style={{ color: "white" }}>Tamamla</Text>
      </TouchableOpacity>
     
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
