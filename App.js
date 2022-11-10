import * as React from 'react'
import { } from '@react-navigation/native'
import { Route } from "./src/route/route"
import {AuthContext} from './src/context/authContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpinnerContext } from './src/context/spinnerContext';

const App = () => {

  const [tkn,setTkn] = React.useState();

  React.useEffect(()=>{
    AsyncStorage.getItem("token").then((tk)=>{
     
      setTkn(tk);
    }).catch(er=>{
      console.log("Error: ",er);
    })
  },[])
  
  const [spinner,setSpinner]=React.useState("none")

  const setLoadSpinner = (value) => {
    setSpinner(value) 
   }

  const setToken = (value) => {
   setTkn(value) 
  }
  return (
    <SpinnerContext.Provider value={{spinner,setLoadSpinner}}>
    <AuthContext.Provider value={{tkn,setToken}}>
      <Route />
    </AuthContext.Provider>
    </SpinnerContext.Provider>

  );
};

export default App;
