import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native"
import QRCode from 'react-native-qrcode-svg';
import { Avatar, Card, Button, Dialog, Input } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../context/authContext';
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { useApi } from '../hooks/api';
import Toast from 'react-native-toast-message'

export const Profile = () => {
    const [orientation, setOrientation] = React.useState("PORTRAIT");
    const [pswrds, setPswrds] = React.useState({ oldPassword: "", newPassword: "", newPasswordRep: "" });
    const [employee, setEmployee] = React.useState();
    const { tkn, setToken } = React.useContext(AuthContext)
    const [openDia, setOpenDia] = React.useState(false)
    const api = useApi();


    const getUser = async () => {
        const userid = await AsyncStorage.getItem("id")
        var id = parseInt(userid, 10);
        const response = await api.get('/Get-User', { id });

    
        if (response.status === 200) {

            setEmployee(response.data.data)

        }
        else {

            showToast("error", "Hata", "Kullanıcı bilgileri getirilirken hata.")

        }

    };

    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Zorunlu alan'),
        newPassword: Yup.string()
            .min(4, 'Yeni şifre minimum 4 karakter olmalıdır')
            .max(20, 'Yeni şifre maksimum 20 karakter olmalıdır')
            .required('Zorunlu alan'),
        newPasswordRep: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], "Şifre tekrar alanı,yeni şifre ile aynı olmalıdır")
            .required('Zorunlu alan')
    });

    const { handleChange, handleSubmit, handleBlur, values, errors, touched } = useFormik({
        validationSchema: ChangePasswordSchema,
        initialValues: { ...pswrds },
        onSubmit: values => changePassword(values)

    });


    React.useEffect(() => {
        getUser()
        Dimensions.addEventListener('change', ({ window: { width, height } }) => {
            if (width < height) {
                setOrientation("PORTRAIT")
            } else {
                setOrientation("LANDSCAPE")

            }
        })
    }, [])

    const changePassword = ( values) => {
          console.log("şifre değiştirme :", values)
    }
    const logOut = async (e) => {
        setToken(null);
        return await AsyncStorage.clear();
    }
    const toogleDia = () => {
        setOpenDia(!openDia)
    }

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
            <View style={styles.editButtonsView}>
                <Button
                    onPress={e => logOut(e)}
                    title="Log out"
                    icon={{
                        name: 'sign-out',
                        type: 'font-awesome',
                        size: 15,
                        color: 'black',
                    }}
                    iconRight
                    iconContainerStyle={{ marginLeft: 10 }}
                    titleStyle={{ color: "black" }}
                    buttonStyle={styles.buttonStyles}

                />

                <Button
                    onPress={e => toogleDia(e)}
                    title="Change Password"
                    icon={{
                        name: 'edit',
                        type: 'font-awesome',
                        size: 15,
                        color: 'black',
                    }}
                    iconRight
                    iconContainerStyle={{ marginLeft: 10 }}
                    titleStyle={{ color: "black" }}
                    buttonStyle={styles.buttonStyles}

                />
            </View>
            <Dialog
                isVisible={openDia}
                onBackdropPress={e => toogleDia(e)}
            >
                <Dialog.Title title="Şifre Değiştirme" />
                <Text>Yeni şifrenizi girin</Text>
                <Input
                    placeholder="Eski Şifre"
                    onChangeText={handleChange('oldPassword')}
                    onBlur={handleBlur('oldPassword')}
                    error={errors.oldPassword}
                    touched={touched.oldPassword}

                />
                {(errors.oldPassword && touched.oldPassword) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.oldPassword}</Text>
                }
                <Input
                    placeholder="Yeni Şifre"
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    error={errors.password}
                    touched={touched.password}

                />
                {(errors.newPassword && touched.newPassword) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.newPassword}</Text>
                }
                <Input
                    placeholder="Yeni Şifre Tekrar"
                    onChangeText={handleChange('newPasswordRep')}
                    onBlur={handleBlur('newPasswordRep')}
                    error={errors.newPasswordRep}
                    touched={touched.newPasswordRep}

                />
                {(errors.newPasswordRep && touched.newPasswordRep) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.newPasswordRep}</Text>
                }
                <Dialog.Actions>
                    <Dialog.Button title="İptal" onPress={e => toogleDia(e)} />
                    <Dialog.Button title="Kaydet" onPress={handleSubmit} />
                </Dialog.Actions>
            </Dialog>

        </View>

    );
}

const styles = StyleSheet.create({
    portraitContainer: {
        display: "flex",
        flex: 1,
        minHeight: Dimensions.get('screen').height,
        marginTop: -130,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAEAEA"

    },
    landscapeContainer: {
        display: "flex",
        flex: 1,
        minHeight: Dimensions.get('screen').height,
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
    editButtonsView: {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        margin: 15
    },
    buttonStyles: {
        backgroundColor: '#EAEAEA',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
    }

})
