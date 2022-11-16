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
import {launchImageLibrary} from 'react-native-image-picker'


export const Profile = () => {
    const [orientation, setOrientation] = React.useState("PORTRAIT");
    const [pswrds, setPswrds] = React.useState({ id: null, oldPassword: "", newPassword: "", repNewPassword: "" });
    const [employee, setEmployee] = React.useState();
    const { tkn, setToken } = React.useContext(AuthContext)
    const [openDia, setOpenDia] = React.useState(false)
    const [photoModal, setPhotoModal] = React.useState(false);
    const [photo, setPhoto] = React.useState({photo:null,id:null});
    const api = useApi();

    const Picture = 'data:image/jpeg;base64'+employee?.photo

    const showToast = (type, title, detail) => {
        Toast.show({
            type: type,
            text1: title,
            text2: detail
        });
    }

    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Zorunlu alan'),
        newPassword: Yup.string()
            .min(4, 'Yeni şifre minimum 4 karakter olmalıdır')
            .max(20, 'Yeni şifre maksimum 20 karakter olmalıdır')
            .required('Zorunlu alan'),
        repNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], "Şifre tekrar alanı,yeni şifre ile aynı olmalıdır")
            .required('Zorunlu alan')
    });

    const { handleChange, handleSubmit, handleBlur, values, errors, touched } = useFormik({
        validationSchema: ChangePasswordSchema,
        initialValues: { ...pswrds },
        onSubmit: values => {
            values.id = employee.id
            changePassword(values)
        }

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


    const changePassword = async (values) => {
        var res = await api.post('/changePassword', values)
        if (res.status === 200) {
            toogleDia();
            showToast("error", "Hata", "Kullanıcı adı ya da şifre yanlış.")
        }
        else {
            toogleDia();
            showToast("error", "Hata", res.toString())
        }
        logOut();
    }
    const logOut = async (e) => {
        setToken(null);
        return await AsyncStorage.clear();
    }
    const toogleDia = () => {
        setOpenDia(!openDia)
    }

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
    

    const handleChoosePhoto = async () => {
        const userId = await AsyncStorage.getItem("id")
        const options = {
            noData: true,
            includeBase64: true
        }
        launchImageLibrary(options, response => {
              
            if (response.didCancel === true) return;
            tooglePhotoModal()
            setPhoto({ ...photo, photo: response.assets[0].base64 ,id:userId})

        })
       
    }

    const updatePhoto = async () => {
   
        const response = await api.post("/updatephoto",photo)
       if(response.status === 200) {
        tooglePhotoModal()
        showToast("success","İşlem Başarılı","Fotoğrafınız başarıyla güncellendi.")
       }
       else {
        tooglePhotoModal()
        showToast("error","Hata",response.message)
       }
       getUser()
    }
    
    const tooglePhotoModal = () => {
        setPhotoModal(!photoModal);
      };
    return (
        <View style={orientation === "PORTRAIT" ? styles.portraitContainer : styles.landscapeContainer} >
            <Toast />
            <View style={orientation === "PORTRAIT" ? styles.portraitCompanyTitle : styles.landscapeCompTitle} >

                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{employee?.companyName}</Text>
                <Image style={orientation === "PORTRAIT" ? styles.portraitImage : styles.landscapeImage} source={require('./SundiaHardalPng.png')} />
            </View>


            <View style={orientation === "PORTRAIT" ? styles.portraitPersonalInfos : styles.landsapcePersonalInfos}>
                <Dialog
                    isVisible={photoModal}
                    onBackdropPress={tooglePhotoModal}
                >
                    <Dialog.Title title="Fotoğraf değişimi" />
                    <Text>Mevcut fotoğrafınızı değiştirmek istediğinize emin misiniz ? </Text>
                    <Dialog.Actions>
                        <Dialog.Button title="İptal" onPress={() => tooglePhotoModal()} />
                        <Dialog.Button title="Kaydet" onPress={() => updatePhoto() } />
                    </Dialog.Actions>
                </Dialog>



                <Avatar
                   
                    size={140}
                    avatarStyle={{
                        borderWidth: 2, borderColor: "#2D2A35", shadowColor: 'black',
                    }}
                    rounded
                    source={ employee?.photo ? {uri: 'data:image/png;base64,' + employee?.photo } : require('./defUser.png')}
                    
                > 
                 <Avatar.Accessory onPress={e => handleChoosePhoto()} size={25} style={{marginRight:15}}/>
                </Avatar>
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
                <Text>Yeni şifrenizi girin. (Bu işlem sonucunda giriş sayfasına yönlendirileceksiniz). </Text>
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
                    onChangeText={handleChange('repNewPassword')}
                    onBlur={handleBlur('repNewPassword')}
                    error={errors.repNewPassword}
                    touched={touched.repNewPassword}

                />
                {(errors.repNewPassword && touched.repNewPassword) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.repNewPassword}</Text>
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

        marginTop: -40,
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
        height: 200,
        width: 200,
        margin: 10,
        margin:-30
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
