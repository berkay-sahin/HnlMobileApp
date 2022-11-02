import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button } from "react-native"
import { useApi } from '../hooks/api'
import { Image } from "@rneui/themed";
import jwt from 'jwt-decode'
import jwtDecode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from "react-native-vector-icons/Ionicons"

export const LoginPage = ({ navigation }) => {
  const [infos, setInfos] = React.useState({ userName: "", password: "" });
  const api = useApi();

  const handleSubmit = async () => {
    console.log("request : ", infos);
    const response = await api.post('/Access/login', infos);

    console.log("response : ", response);

    if (response.status === 200) {

      console.log(response.data)

      var claims = jwt(response.data);
      console.log(claims)
      await deviceStorage("token", response.data);
      var tokenData = jwtDecode(response.data)
      var username =
        tokenData[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      await deviceStorage("user", JSON.stringify(username));
      navigation.navigate("Detail", { Infos: response })

    }
    else {

      console.log("a")
    }

  };

  const deviceStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      //alert(e)
    }

  }

  return (

    <View style={styles.container} >
      <View style={styles.titleContainer} >
        <Text style={{ fontSize: 69, color: "#2D2A35" }}> Özyer ID</Text>
        <Text style={{ fontSize: 31, color: "#2D2A35" }}> Hoşgeldiniz !</Text>
      </View>
      <View style={{ margin: 30 }}>
        <TextInput
          placeholder="Email/Username"
          onChangeText={e => setInfos({ ...infos, userName: e })}
          style={styles.nameField}
        />
        <TextInput
          placeholder="Password"
          onChangeText={e => setInfos({ ...infos, password: e })}
          style={styles.nameField}
        />
      </View>
      <View style={{ marginBottom: -30 }}>
        <TouchableOpacity style={styles.button} onPress={e => handleSubmit()}><Text style={styles.text}>Login</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={e => handleSubmit()}><Text style={styles.text}>QR Login</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAEA"

  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -70

  },
  nameField: {
    borderWidth: 1.2,
    borderColor: "black",
    borderRadius: 10,
    width: 300,
    margin: 10

  },
  button: {
    shadowColor: 'black',
    shadowOpacity: 0,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 0,
    backgroundColor: "#2D2A35",
    borderRadius: 10,
    height: 55,
    width: 300,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",

  },
  text: {

    fontSize: 22,
    color: "#fff",


  }
})