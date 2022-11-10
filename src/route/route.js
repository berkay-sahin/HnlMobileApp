import * as React from 'react';
import { LoginPage } from "../components/login-page"
import { Home } from "../components/Home"
import {Profile} from '../components/profile'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/authContext';

export const Route = () => {
  const Tab = createBottomTabNavigator();
  const {tkn,setToken} = React.useContext(AuthContext)

  return (
    tkn !== null ? 
    <NavigationContainer>
       <Tab.Navigator
         initialRouteName='Home'
           screenOptions={({ route }) => ({
            tabBarIconStyle: { display: "none" },
            headerShown:false,
            
            tabBarStyle:{display: tkn===null ? "none" :"flex"},
            tabBarActiveBackgroundColor:"#2D2A35",
            tabBarInactiveBackgroundColor:"#2D2A35",
            tabBarLabelStyle:{fontSize:16,color:"white",fontWeight:"bold", position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            textAlignVertical: 'center',}
            
        })}
       
          
 
      >
        
        <Tab.Screen  name="Login"component={LoginPage}  options={{
      tabBarButton: (props) => null
    }} />
        <Tab.Screen name="Home" component={Home}    /> 
        <Tab.Screen name="Profil" component={Profile}  /> 
       
      </Tab.Navigator>
    </NavigationContainer>  : <NavigationContainer>
       <Tab.Navigator
         
           screenOptions={({ route }) => ({
            tabBarIconStyle: { display: "none" },
            headerShown:false,
            tabBarStyle:{display: tkn===null ? "none" :"flex"},
            tabBarActiveBackgroundColor:"#2D2A35",
            tabBarInactiveBackgroundColor:"#2D2A35",
            tabBarLabelStyle:{fontSize:16,color:"white",fontWeight:"bold", position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            textAlignVertical: 'center',}
            
        })}
       
          
 
      >
        
        <Tab.Screen  name="Login"component={LoginPage}  options={{
      tabBarButton: (props) => null
    }} />
        
       
      </Tab.Navigator>
    </NavigationContainer> 
    
  );
};

