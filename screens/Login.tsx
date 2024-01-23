import React,{useState} from 'react';
import {
    Form,
    Input,
    Checkbox,
    Switch
  } from 'beeshell';
import {Dimensions,ScrollView,StyleSheet, Text, View ,Alert,Button,TouchableOpacity,ImageBackground,Pressable} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LoginWithNamePwd from '../components/LoginWIthNamePwd';
import LoginWithPhoneCode from '../components/LoginWithPhoneCode';
import FlipCard from 'react-native-flip-card';


export default function Login({navigation}){
    const [loginMethod,setLoginMethod] = useState(false);//false:使用用户名密码登陆,true:使用手机号验证码登陆

    const changeLoginMethod = () => {
        setLoginMethod(!loginMethod);
    };

    return (
        <View style={styles.home}>
            <ImageBackground  source={require('../sources/loginBackground.jpg')} style={styles.image}>
                <View style={[styles.home,{backgroundColor:'black',opacity:0.7,zIndex:0}]}></View>
                <View style={[styles.box,{zIndex:1,position:'absolute'},{backgroundColor:'transparent'}]}>
                    <Svg style={{alignSelf:"center",marginTop:'43%',marginBottom:'5%'}} viewBox="0 0 1024 1024" p-id="11024" width="90" height="90">
                        <Path fill={'#e6e6e6'} d="M937.642667 1024H86.442667C38.4 1024 0 985.6 0 937.642667V86.442667C0 38.4 38.4 0 86.4 0H940.8C985.6 0 1024 38.4 1024 86.4v851.2C1024 985.6 985.6 1024 937.642667 1024zM512 169.6H384A214.4 214.4 0 0 0 169.6 384v256A214.4 214.4 0 0 0 384 854.357333h256A214.4 214.4 0 0 0 854.357333 640v-169.6c0-25.6-19.2-44.8-44.8-44.8H768a42.453333 42.453333 0 0 1-41.642667-41.642667A214.4 214.4 0 0 0 512 169.514667z m131.157333 512H384c-22.4 0-41.6-19.2-41.6-41.6s19.2-41.642667 41.6-41.642667h259.157333c22.442667 0 41.685333 19.2 41.685334 41.642667s-19.2 41.642667-41.6 41.642667z m-108.8-339.2c22.485333 0 41.642667 19.2 41.642667 41.6s-19.2 41.6-41.6 41.6h-153.6c-22.4 0-41.642667-19.2-41.642667-41.6s19.2-41.6 41.6-41.6h153.6z" p-id="11025"></Path>
                    </Svg>
                    <View style={styles.flipCardStyle}>
                        <FlipCard flip={loginMethod} flipHorizontal={true} clickable={false} flipVertical={false} friction={5} >
                            {/*正面*/}
                            <LoginWithNamePwd navigation={navigation}></LoginWithNamePwd>
                            {/*背面*/}
                            <LoginWithPhoneCode navigation={navigation}></LoginWithPhoneCode>
                        </FlipCard>
                    </View>

                    <View style={styles.BottomPhoneArea}>
                        <View style={{height:0.5,backgroundColor:'#bcbcbc',width:'100%',zIndex:1}}></View>
                        <View style={{paddingTop:20}}>
                            {!loginMethod ?
                            <Button onPress={changeLoginMethod} color={'#bcbcbc'} title='Or Try Logging in with Your Phone'></Button> :
                            <Button onPress={changeLoginMethod} color={'#bcbcbc'} title='Or Try Logging in with Your Account'></Button>}
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const windowSet = Dimensions.get('window');//屏幕尺寸

//样式
const styles = StyleSheet.create({
    home:{
        width:windowSet.width,
        height:windowSet.height,
        alignItems:'center',
    },
    box: {
        width: '80%',
        height: '100%',
        borderRadius:5,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        backgroundColor:'white',
        zIndex:1
        //marginTop:windowSet.height * 0.15,
      },
    image: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        width: windowSet.width,
        height: windowSet.height,
        alignItems:'center'
    },
    flipCardStyle:{
        height:'40%',
    },
      button: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        width:'100%',
        height:'100%',
      },
      BottomPhoneArea:{
        marginBottom:'1%',
        zIndex:2,
        height:60,
        alignItems:'center',
        marginTop:'40%'
    }
});
type UserLogin = {
    UserName : string,
    Password : string
}