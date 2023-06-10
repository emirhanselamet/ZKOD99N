
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Modal, ActivityIndicator, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
import { Alert } from "react-native";

const PrintScreen = ({ route }) => {

  const { data, hu } = route.params;

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation()


  const convertDate = (sapDate) => {
    let year = sapDate.substr(0, 4);
    let month = sapDate.substr(4, 2);
    let day = sapDate.substr(6, 2);

    return `${day}.${month}.${year}`;
  };

  const getLocaldata = async () => {
    const username = await AsyncStorage.getItem("username").then((data) => {
      setUsername(data);
    });
    const password = await AsyncStorage.getItem("password").then((data) =>
      setPassword(data)
    );
  };

  const printRequest = async () => {
    try {
      setIsLoading(true);
      // console.log(`${BASE_URL}&EXIDV=${hu}`);
      const printData = await axios.post(`${BASE_URL}&EXIDV=${hu}`, {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          auth: {
            username: username,
            password: password,
          },
        });

      alert(`Teyit veildi.Batch :${printData.data.acharg}`);

      const pairedDevices = await RNZebraBluetoothPrinter.pairedDevices();
      let deviceAddress = "";
      let deviceEnergy = "";

      pairedDevices.forEach((device) => {
        if (device.name.startsWith('MM0')) {
          deviceAddress = device.address;
          deviceEnergy = device.energy;
        }
      });

      const zpl = `^XA
                ~TA000
                ~JSN
                ^LT0
                ^MNW
                ^MTD
                ^PON
                ^PMN
                ^LH0,0
                ^JMA
                ^PR5,5
                ~SD10
                ^JUS
                ^LRN
                ^CI27
                ^PA0,1,1,0
                ^XZ
                ^XA
                ^MMT
                ^PW863
                ^LL609
                ^LS0
                ^FT110,178^A0N,90,91^FH\^CI28^FD${printData.data.matnr}^FS^CI27
                ^FT86,265^A0N,45,46^FH\^CI28^FD${printData.data.maktx}^FS^CI27
                ^FO248,398^BY3^B3N,N,100,Y,N^FD${hu}^FS
                ^FT326,358^A0N,68,68^FH\^CI28^FD${printData.data.erfmg}^FS^CI27
                ^FT641,61^A0N,34,33^FH\^CI28^FD${convertDate(printData.data.proddate)}^FS^CI27
                ^FT68,61^A0N,34,33^FH\^CI28^FD${printData.data.belnr}^FS^CI27
                ^FT467,348^A0N,34,33^FH\^CI28^F${printData.data.erfme === "ST" ? "ADT" : printData.data.erfme}^FS^CI27
                ^PQ1,0,1,Y
                ^XZ`;

      if (deviceAddress !== "") {
        await RNZebraBluetoothPrinter.print(deviceAddress, zpl, deviceEnergy);
      } else {
        alert('Printer Bulunamadı.');
      }
      navigation.navigate("HU");

    } catch (error) {
      Alert.alert(
        "Hata",
        error.response.data.error,
        [
          {
            text: "Tamam",
            onPress: () => navigation.navigate("HU"),
            style: "cancel"
          },
        ],
        { cancelable: false }
      );
    }
    finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    getLocaldata();
  }, []);


  function DataListItem({ title, data }) {
    return (
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{title}</Text>
        <Text>{data}</Text>
      </View>
    );
  }

  const dataList = [
    { title: 'Tanımı', data: data?.maktx },
    { title: 'Numarası', data: data?.matnr },
    { title: 'Miktar', data: data?.erfmg },
    { title: 'Birim', data: data?.erfme === "ST" ? "ADT" : data?.erfme },
  ];

  return (
    <View style={styles.container}>

      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Bilgiler</Text>
      <View>
        <FlatList
          data={dataList}
          renderItem={({ item }) => <DataListItem title={item.title} data={item.data} />}
          keyExtractor={item => item.title}
        />
      </View>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white' }}>Geri</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={() => {
            printRequest()
          }}
        >
          <Text style={{ color: 'white' }}>Yazdır</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
      <Modal
        animationType="slide"
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
          <Text style={{ color: "white", fontSize: 22 }}>Yazdırılıyor...</Text>
          <ActivityIndicator size="large" color="blue" />
        </View>
      </Modal>
    </View>
  );
};

export default PrintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  ButtonContainer: {
    flexDirection: 'row',
    marginTop: 35,
    paddingVertical: 10,
  },
});
