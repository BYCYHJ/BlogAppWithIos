import React, { useState } from '../node_modules/react';
import {
    Form,
    Input,
} from 'beeshell';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';
import { Divider } from '@rneui/base';


export default function LoginWithNamePwd({ navigation }) {
    const [UserName, SetUserName] = useState("");//用户名
    const [Password, SetPassword] = useState("");//密码
    const [LoginBackground, SetBackground] = useState('#f1d28d');

    //按钮点击提交表单
    const handleLogin = async () => {
        navigation.navigate("Test");
    }

    return (
        <View style={{
            backgroundColor: 'white', height: windowSet.height * 0.44, borderTopStartRadius: 20, borderTopEndRadius: 20,    
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.22,
            shadowRadius: 4.22,
        }}>
            <Image style={{ width: windowSet.width * 0.45, height: windowSet.height * 0.05, marginTop: 30, marginLeft: 15, marginBottom: windowSet.height * 0.03 }} source={require('../sources/logo2.png')} />
            <Form>
                <Form.Item label={false} style={styles.FormItem}>
                    <Text style={{ height: 0 }}></Text>
                    <View style={styles.UsernameAPassword}>
                        <View style={{ width: '10%', height: '100%', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                            <Svg viewBox="0 0 1024 1024" p-id="7972" width={'100%'} height={'100%'}>
                                <Path d="M341.333333 298.666667a170.666667 170.666667 0 1 1 341.333334 0 170.666667 170.666667 0 0 1-341.333334 0z m170.666667 106.666666a106.666667 106.666667 0 1 0 0-213.333333 106.666667 106.666667 0 0 0 0 213.333333zM384 512a202.666667 202.666667 0 0 0-202.666667 202.666667v149.333333a32 32 0 0 0 64 0v-149.333333A138.666667 138.666667 0 0 1 384 576h256a138.666667 138.666667 0 0 1 138.666667 138.666667v149.333333a32 32 0 0 0 64 0v-149.333333A202.666667 202.666667 0 0 0 640 512H384z" fill="#e2c85e" p-id="7973"></Path>
                            </Svg>
                        </View>
                        <Input inputStyle={styles.UAPInputStyle} style={styles.UAPInput} placeholder='Username' value={UserName} onChange={v => SetUserName(v)}></Input>
                    </View>
                    <Divider style={{ paddingTop: 10 }} />
                </Form.Item>
                <View style={{ marginTop: '8%' }}></View>
                <Form.Item label={false} style={styles.FormItem}>
                    <Text></Text>
                    <View style={styles.UsernameAPassword}>
                        <View style={{ width: '10%', height: '100%', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                            <Svg viewBox="0 0 1024 1024" p-id="10010" id="mx_n_1703121978630" width={'80%'} height={'100%'}>
                                <Path d="M855.808 465.152 798.72 465.152l0-178.176c0-158.208-128.512-286.976-286.72-286.976-157.952 0-286.72 128.768-286.72 286.976l0 178.176-57.088 0c-25.344 0-45.824 20.48-45.824 45.824l0 467.2c0 25.344 20.48 45.824 45.824 45.824l687.616 0c25.344 0 45.824-20.48 45.824-45.824L901.632 510.976C901.632 485.888 880.896 465.152 855.808 465.152zM158.464 510.976c0-5.376 4.352-9.984 9.984-9.984L225.28 500.992l0 82.176 35.84 0 0-82.176 501.504 0 0 82.176 35.84 0 0-82.176 57.088 0c5.376 0 9.984 4.352 9.984 9.984l0 467.2c0 5.376-4.352 9.984-9.984 9.984L168.192 988.16c-5.376 0-9.984-4.352-9.984-9.984L158.208 510.976zM261.376 465.152l0-178.176C261.376 148.736 373.76 36.096 512 36.096c138.24 0 250.624 112.64 250.624 251.136l0 178.176L261.376 465.408z" fill="#e2c85e" p-id="10011"></Path>
                            </Svg>
                        </View>
                        <Input secureTextEntry={true} inputStyle={styles.UAPInputStyle} style={styles.UAPInput} placeholder='Password' value={Password} onChange={p => SetPassword(p)}></Input>
                    </View>
                    <Divider style={{ paddingTop: 10 }} />
                </Form.Item>
                {/* <View style={{height:'2%'}}></View> */}
                <View style={styles.BottomArea}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.LoginButton]}
                        onPressIn={() => SetBackground('grey')} onPressOut={() => SetBackground('#f1d28d')} onPress={handleLogin}>
                        <View style={{ height: '100%', width: '80%', borderRadius: 30, backgroundColor: LoginBackground, alignSelf: 'center' }}>
                            <Text style={[styles.SignInText, { backgroundColor: 'transparent' }]}>Sign in</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Form>
        </View>
    );
}

const windowSet = Dimensions.get('window');//屏幕尺寸

const styles = StyleSheet.create({
    FormItem: {
        height: 55,
        //backgroundColor: '#050505',
    },
    UsernameAPassword: {
        display: 'flex',
        flexDirection: 'row',
        //borderWidth:0.5,
        borderRadius: 5,
        height: '100%',
        backgroundColor: 'transparent',
    },
    UAPInput: {
        marginLeft: 20,
        width: '75%',
        //backgroundColor:'inherit',
        backgroundColor: 'transparent',
        marginRight: 5,
    },
    UAPInputStyle: {
        color: 'black',
        fontSize: 18,
    },
    UAPSvg: {
        width: '35%',
        marginLeft: 5,
        backgroundColor: 'transparent'
    },
    BottomArea: {
        marginTop: '10%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    LoginButton: {
        width: '90%',
        height: 60,
        alignItems: 'flex-end',
        display: 'flex',
        marginBottom: '3%',
        borderRadius: 20,
    },
    SignInText: {
        borderRadius: 20,
        color: '#fffff1',
        fontSize: 30,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        alignItems: 'center',
        //fontWeight:'bold',
        lineHeight: 60
    },
});