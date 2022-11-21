import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button, Dimensions,ActivityIndicator } from "react-native"
import { useApi } from '../hooks/api'
import { Image, Input } from "@rneui/themed";
import jwt from 'jwt-decode'
import jwtDecode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from "react-native-vector-icons/Ionicons"
import { AuthContext, useAuth } from "../context/authContext";
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { SpinnerContext } from "../context/spinnerContext";
import Toast from 'react-native-toast-message'

export const LoginPage = ({ navigation }) => {
  const [infos, setInfos] = React.useState({ email: "", password: "" });
  const api = useApi();
  const { tkn, setToken } = React.useContext(AuthContext)
  const{spinner,setLoadSpinner} = React.useContext(SpinnerContext)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Zorunlu alan'),
    password: Yup.string()
      .min(4, 'Şifre minimum 4 karakter olmalıdır')
      .max(20, 'Şifre maksimum 20 karakter olmalıdır')
      .required('Zorunlu alan')
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } = useFormik({
    validationSchema: LoginSchema,
    initialValues: { ...infos },
    onSubmit: values => handleLogin(values)

  });

  const showToast = (type,title,detail) => {
    Toast.show({
      type: type,
      text1: title,
      text2: detail
    });
  }


  const handleLogin = async (values) => {
    setLoadSpinner("flex")
    const response = await api.post('/Login-User', values);
   
    const tokenInf = response.data?.data.token
    
    if (response.status === 200) {
      var token = jwt(tokenInf);
      
       await deviceStorage("token", tokenInf);
       var tokenData = jwtDecode(tokenInf)
       var userId=
       tokenData[
       "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
       ];
       
       await deviceStorage("id", userId.toString());
      setToken(tokenInf)
         console.log("response", response)
      navigation.navigate("Home", { UserId: userId })
      setLoadSpinner("none")
    }
    else {
      console.log("response", response)
      showToast("error","Hata",response.message ? response.message : "Giriş yaparken hata oluştu" )
      setLoadSpinner("none")
    }

  };

  const deviceStorage = async (key, value) => {
    try {
      const x = await AsyncStorage.setItem(key, value)

    } catch (e) {
      //alert(e)
    }

  }
  
  return (
      
    <View style={styles.container} >
     <Toast/>
      <View style={styles.titleContainer} >
        <Text style={{ fontSize: 69, color: "#2D2A35" }}> Özyer ID</Text>
        <Text style={{ fontSize: 31, color: "#2D2A35" }}> Hoşgeldiniz !</Text>
      </View>

      <View style={{ margin: 30 }}>
      
      <ActivityIndicator size="large" style={{display:spinner}}/>
        <Input
          placeholder="Email"
          leftIcon={{ type: 'ionicons', name: 'mail-outline' }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          containerStyle={styles.nameField}
          onChangeText={handleChange('email')}
          onBlur={handleBlur("email")}
          error={errors.email}
          touched={touched.email}

        // onChangeText={e => setInfos({ ...infos, userName: e })}

        />
        {(errors.email && touched.email) &&
          <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
        }
        <Input
          placeholder="Password"
          secureTextEntry={true}
          leftIcon={{ type: 'ionicons', name: "lock" }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          containerStyle={styles.nameField}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          touched={touched.password}


        />

        {(errors.password && touched.password) &&
          <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
        }
      </View>


      <View style={{ marginBottom: -30 }}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.text}>Login</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.text}>QR Login</Text></TouchableOpacity>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    minHeight: Dimensions.get('screen').height / 1.1,
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
    width: 300,
    height: 50,
    borderWidth: 1.2,
    borderColor: "black",
    borderRadius: 10,
    margin: 5


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