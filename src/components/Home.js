import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native"
import QRCode from 'react-native-qrcode-svg';
import { Avatar, Card, SpeedDial } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'
import vCard from 'react-native-vcards';
import { useApi } from '../hooks/api';
import Toast from 'react-native-toast-message'

export const Home = ({ route }) => {
    const [orientation, setOrientation] = React.useState("PORTRAIT");
    const [employee, setEmployee] = React.useState();
    const api = useApi();

   

    const showToast = (type,title,detail) => {
        Toast.show({
          type: type,
          text1: title,
          text2: detail
        });
      }

    React.useEffect(() => {
      
        Dimensions.addEventListener('change', ({ window: { width, height } }) => {
            if (width < height) {
                setOrientation("PORTRAIT")
            } else {
                setOrientation("LANDSCAPE")

            }
           
        })
         getUser()
    }, [])


    const generateCard = () => {
        var card = vCard();
        card.cellPhone = employee?.phone,
            card.firstName = employee?.firstName,
            card.lastName = employee?.lastName,
            card.organization = employee?.companyName,
            card.workEmail = employee?.email,
            card.title = employee?.title
        return card.getFormattedString();

    }
    const getUser = async () => {
        const userid = await AsyncStorage.getItem("id")
        var id = parseInt(userid, 10);
        const response = await api.get('/Get-User', { id });

        if (response.status === 200) {

            setEmployee(response.data.data)

        }
        else {

            showToast("error", "Hata", "Kullanıcı yok.")

        }

    };

    return (
        <View style={orientation === "PORTRAIT" ? styles.portraitContainer : styles.landscapeContainer} >
            <Toast />
            <View style={orientation === "PORTRAIT" ? styles.portraitCompanyTitle : styles.landscapeCompTitle} >
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{employee?.companyName}</Text>
                <Image style={orientation === "PORTRAIT" ? styles.portraitImage : styles.landscapeImage} source={require('./sundia.png')} />
            </View>
            <View style={orientation === "PORTRAIT" ? styles.portraitPersonalInfos : styles.landsapcePersonalInfos}>
                <Avatar

                    size={140}
                    avatarStyle={{
                        borderWidth: 2, borderColor: "#2D2A35", shadowColor: 'black',
                    }}
                    rounded
                    source={require('./rs.jpg')}

                />
                <Text style={{ margin: 5, fontSize: 16 }}>{employee?.title}</Text>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}> {employee?.firstName} {employee?.lastName}</Text>
                <Text style={{ margin: 5 }}> {employee?.email}</Text>
                <Text style={{}}> {employee?.phone}</Text>

            </View>
            <View style={orientation === "PORTRAIT" ? styles.portraitQrView : styles.landscapeQrView}>
                <QRCode
                    size={180}
                    value={generateCard()}
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
    landscapeCompTitle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    portraitPersonalInfos: {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        marginTop: -5,
    },
    landsapcePersonalInfos: {
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
        display: "flex",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

    },

})
