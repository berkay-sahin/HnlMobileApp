import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image,Dimensions } from "react-native"
import QRCode from 'react-native-qrcode-svg';
import { Avatar, Card } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'

export const Detail = () => {
    const [orientation, setOrientation] = React.useState("PORTRAIT");

    const avatar = 'https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553__340.jpg'
    const employee =
    {
        "employeeName": "Berkay",
        "employeeSurname": "Şahin",
        "gender": "Erkek",
        "email": "b.sahin@hanelgrup.com",
        "telNo": "+90 539 648 74 47",
        "personalEmail": "berkaysahin8@gmail.com",
        "department": "It",
        "title": "Yazılım Geliştirme "

    }

    React.useEffect(()=>{
        Dimensions.addEventListener('change', ({window:{width,height}})=>{
            if (width<height) {
              setOrientation("PORTRAIT")
            } else {
              setOrientation("LANDSCAPE")
          
            }
          })
    },[])
  

    return (
        <View  style={ orientation==="PORTRAIT" ? styles.portraitContainer : styles.landscapeContainer} >
            <View style={ orientation==="PORTRAIT" ? styles.portraitCompanyTitle : styles.landscapeCompTitle} >
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sundia Fethiye</Text>
                <Image style={orientation==="PORTRAIT" ?styles.portraitImage : styles.landscapeImage} source={require('./sundia.png')} />
            </View>
            <View style={orientation==="PORTRAIT" ? styles.portraitPersonalInfos : styles.landsapcePersonalInfos }>
                <Avatar
                    size={140}
                    avatarStyle={{ borderWidth: 2, borderColor: "#2D2A35",shadowColor: 'black',
                   }}
                    rounded
                    source={{ uri: avatar }}

                />
                <Text style={{ margin: 5, fontSize: 16 }}>{employee.title}</Text>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}> {employee.employeeName} {employee.employeeSurname}</Text>
                <Text style={{ margin: 5 }}> {employee.email}</Text>
                <Text style={{}}> {employee.telNo}</Text>
                
            </View>
            <View style={orientation==="PORTRAIT" ? styles.portraitQrView :styles.landscapeQrView}>
                     <QRCode  
                        size={190}
                        value="https://github.com/berkay-sahin"
                     />
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    portraitContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAEAEA"

    },
    landscapeContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAEAEA"

    },
    portraitCompanyTitle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    landscapeCompTitle:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    portraitPersonalInfos:{
        display: "flex",
         flexDirection: 'column', 
         alignItems: "center",
        justifyContent: "center",
         margin: 5,
         marginTop:-5,
    },
    landsapcePersonalInfos:{
        display: "flex",
         flexDirection: 'column', 
         alignItems: "center",
        justifyContent: "center",
         margin: 31
    },
    portraitImage: {
        height: 100,
        width: 100,
        margin: 10,
      
    },
    landscapeImage: {
        height: 100,
        width: 100,
        margin: 10,
      
    },
    portraitQrView: {
        height: 220,
        width: 220,
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        elevation: 15,
        backgroundColor: "white",
        margin: 10,
        borderRadius: 10,
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        
    },
    landscapeQrView: {
        height: 220,
        width: 220,
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        elevation: 15,
        backgroundColor: "white",
        margin: 10,
        borderRadius: 10,
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        
    },

})
