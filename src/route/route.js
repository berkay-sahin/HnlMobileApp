import * as React from 'react';
import { LoginPage } from "../components/login-page"
import { Detail } from "../components/Detail"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from '@rneui/base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons/'


export const Route = () => {

  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
       <Tab.Navigator
         
           screenOptions={({ route }) => ({
            tabBarIconStyle: { display: "none" },
            headerShown:false,
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

        <Tab.Screen  name="Login" component={LoginPage}  />
        <Tab.Screen name="Profil" component={Detail}    />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

