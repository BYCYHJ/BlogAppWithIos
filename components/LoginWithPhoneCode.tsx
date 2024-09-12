import React, { useState, useRef } from '../node_modules/react'
import CodeStyles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR
} from '../styles/PhoneCode'
import { Input } from 'beeshell'
import { Animated, Dimensions, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Animatable from 'react-native-animatable'
import axios from 'axios'
import Svg, { Path } from 'react-native-svg'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { useEffect } from 'react'
import { EasyLoading, Loading } from './Loading'
import { getPhoneTokenCode, setStorage, getStorage, getUserInfo, setUniqueUserInfo } from '../services/services'
import { useUser } from '../UserContext'
import { Divider } from '@rneui/base'

const { Value, Text: AnimatedText } = Animated

const CELL_COUNT = 6
const windowSet = Dimensions.get('window');

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0))
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1))
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1
      //duration: hasValue ? 300 : 250,
    })
  ]).start()
}

const AnimatedInput = Animated.createAnimatedComponent(Text)

export default function LoginWithPhoneCode({ navigation }) {
  const [UserName, SetUserName] = useState('') //用户名
  const [CodeVisible, SetCodeVisible] = useState(false) //code visible
  const [NumWarningVisible, SetNumWarningVisible] = useState(false)
  const [LoginBackground, SetBackground] = useState('#f1d28d');
  const phoneNumLocate = useRef(new Animated.ValueXY()).current //电话号码的坐标
  const [fontSize, setFontSize] = useState(new Animated.Value(18))
  const anonymousNum = useRef('') //电话号码 aaa****bbbb格式
  const modalMsg = useRef('') //模态框信息
  const [modalVisible, setModalVisible] = useState(false) //模态框是否可见
  const [verificationCode, setVerificationCode] = useState('') //验证码
  const [timing, setTiming] = useState(30) //验证码按钮禁用秒数
  const [isPressed, setIsPressed] = useState(false) //是否点击了验证码按钮
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userId: "",
    phoneNumber: "",
    avatarUrl: "",
  });//用户信息
  const { user, setUser } = useUser();

  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })

  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol)
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
          inputRange: [0, 1],
          outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR]
        })
        : animationsColor[index].interpolate({
          inputRange: [0, 1],
          outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR]
        }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS]
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1]
          })
        }
      ]
    }

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused })
    }, 0)

    return (
      <AnimatedText key={index} style={[CodeStyles.cell, animatedCellStyle]} onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    )
  }

  //显示modal提示框，自动关闭时间2s
  const showModalMsg = (msg: string) => {
    modalMsg.current = msg
    setModalVisible(true)
    setTimeout(() => {
      setModalVisible(false)
    }, 2000)
  }

  //获取验证码
  const getVerificationCode = async () => {
    setIsPressed(true)
    SetBackground('grey')
    const phoneRegex = /1\d{10}/
    if (!phoneRegex.test(UserName)) {
      SetNumWarningVisible(true)
      return
    }
    SetNumWarningVisible(false)
    Animated.parallel([
      //动画效果
      Animated.spring(phoneNumLocate, {
        toValue: -20,
        friction: 5,
        useNativeDriver: true
      }),
      Animated.spring(fontSize, {
        toValue: 35,
        useNativeDriver: false
      })
    ]).start()
    SetCodeVisible(true)

    try {
      const params = {
        phone: UserName,
      }
      const { data, status } = await getPhoneTokenCode({ params });
      //请求成功但服务器拒绝
      if (status > 299) {
        modalMsg.current = data;
        setModalVisible(true);
      } else {
        //成功
        modalMsg.current = '已发送验证码，请注意查收' + data;
        setModalVisible(true);
        setVerificationCode(data);
      }
    } catch (error) {
      //未知错误
      modalMsg.current = error.response.data
      setModalVisible(true)
    }

    setTimeout(() => {
      setModalVisible(false)
    }, 2000)
    //navigationRef.navigate("Test");
  }

  //获取并设置用户信息
  const getAndSetUserInfo = async () => {
    //获取用户信息
    try {
      const response = await getUserInfo();
      const { data, status } = { data: response.data, status: response.status }
      console.log(JSON.stringify(data));
      //无异常
      if (status < 299) {
        //将用户信息存储
        await setStorage('userInfo', JSON.stringify(data));
        //赋值
        setUserInfo(data);
        setUniqueUserInfo(data);
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //电话号码转为1ab****cdef格式
  useEffect(() => {
    const headStr = UserName.slice(0, 3)
    const endStr = UserName.slice(-4)
    anonymousNum.current = '+86 ' + headStr + '****' + endStr
  }, [UserName])

  //验证码按钮禁用
  useEffect(() => {
    let interval
    if (timing > 0 && isPressed) {
      interval = setInterval(() => {
        setTiming(prevTiming => prevTiming - 1)
      }, 1000)
    }
    if (timing <= 0) {
      setTiming(30)
      SetBackground('#f1d28d')
      setIsPressed(false)
    }
    return () => clearInterval(interval)
  }, [timing, isPressed])

  //验证码校验
  useEffect(() => {
    if (value.length == CELL_COUNT && value == verificationCode) {
      EasyLoading.show() //loader
      axios({
        method: 'post',
        url: 'http://132.232.108.176:5200/api/Login/LoginWithPhone',
        params: {
          phone: UserName,
          code: value
        }
      })
        .then(async response => {
          console.log(response);
          // //存储token
          await setStorage('token', response.data);
          //获取user
          await getAndSetUserInfo();
          EasyLoading.dismiss() //loader消失
          navigation.navigate('Home')
        })
        .catch(error => {
          showModalMsg('验证码错误:' + error.message)
          setValue('')
          EasyLoading.dismiss() //loader消失
        })
    } else if (value.length == CELL_COUNT && value != verificationCode) {
      showModalMsg('验证码错误')
      setValue('')
    }
  }, [value])

  return (
    <View style={{
      display: 'flex', height: !CodeVisible ? windowSet.height * 0.33 : windowSet.height * 0.45, backgroundColor: 'white', borderTopStartRadius: 20, borderTopEndRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.22,
      shadowRadius: 4.22,
    }}>
      <Image style={{ width: windowSet.width * 0.45, height: windowSet.height * 0.05, marginTop: 30, marginLeft: 15, marginBottom: !CodeVisible ? windowSet.height * 0.04 : windowSet.height * 0.05 }} source={require('../sources/logo2.png')} />
      <Animated.View style={[styles.UsernameAPassword, { transform: [{ translateY: phoneNumLocate.y }] }]}>
        <View
          style={{
            display: !CodeVisible ? 'flex' : 'none',
            flexDirection: 'row',
            height: 50,
            width: '95%',
            position: 'absolute',
            top: 0,
            borderRadius: 20,
            backgroundColor: '#fbf3e0',
            alignSelf: 'center'
          }}
        >
          <View style={{ width: '10%', height: '100%', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
            <Svg viewBox="0 0 1024 1024" p-id="7972" width={'80%'} height={'100%'}>
              <Path
                d="M341.333333 298.666667a170.666667 170.666667 0 1 1 341.333334 0 170.666667 170.666667 0 0 1-341.333334 0z m170.666667 106.666666a106.666667 106.666667 0 1 0 0-213.333333 106.666667 106.666667 0 0 0 0 213.333333zM384 512a202.666667 202.666667 0 0 0-202.666667 202.666667v149.333333a32 32 0 0 0 64 0v-149.333333A138.666667 138.666667 0 0 1 384 576h256a138.666667 138.666667 0 0 1 138.666667 138.666667v149.333333a32 32 0 0 0 64 0v-149.333333A202.666667 202.666667 0 0 0 640 512H384z"
                fill="#e2c85e"
                p-id="7973"
              ></Path>
            </Svg>
          </View>
          <Input
            inputStyle={styles.UAPInputStyle}
            style={styles.UAPInput}

            placeholder="Phone Number"
            value={UserName}
            onChange={v => SetUserName(v)}
          ></Input>
        </View>
        <View style={{ position: 'absolute', top: 0, alignSelf: 'center', display: CodeVisible ? 'flex' : 'none' }}>
          <AnimatedInput style={{ fontSize: fontSize, color: 'black' }}>{anonymousNum.current}</AnimatedInput>
        </View>
        <Text
          style={{
            fontSize: 15,
            color: '#ff5819',
            marginTop: 50,
            height: 20,
            alignSelf: 'center',
            display: NumWarningVisible ? 'flex' : 'none'
          }}
        >
          a number of length 11 is required
        </Text>
        <View style={{ marginTop: NumWarningVisible ? '0%' : '15%' }}></View>
        <Animatable.View animation={CodeVisible ? 'flipInX' : 'flipOutX'} duration={500}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={[CodeStyles.codeFiledRoot, { position: 'relative', display: CodeVisible ? 'flex' : 'none' }]}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
          />
        </Animatable.View>
      </Animated.View>
      <View style={styles.BottomArea}>
        <TouchableOpacity
          disabled={isPressed}
          activeOpacity={0.8}
          style={[styles.LoginButton, { marginTop: windowSet.height * 0.03 }]}
          onPressIn={() => SetBackground('grey')}
          onPressOut={() => SetBackground('#f1d28d')}
          onPress={getVerificationCode}
        >
          <View style={{ height: '100%', width: '80%', borderRadius: 30, backgroundColor: LoginBackground, alignSelf: 'center' }}>
            <Text style={[styles.SignInText, { backgroundColor: 'transparent' }]}>
              {!isPressed ? 'Get verification code' : timing + 's'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMsg.current}</Text>
          </View>
        </View>
      </Modal>
      <Loading style={{ backgroundColor: 'transparent' }}></Loading>
    </View>
  )
}


const styles = StyleSheet.create({
  UsernameAPassword: {
    position: 'relative',
    borderRadius: 5,
    backgroundColor: 'transparent'
  },
  UAPInput: {
    marginLeft: 20,
    width: '75%',
    backgroundColor: 'transparent',
    marginRight: 5
  },
  UAPInputStyle: {
    color: 'black',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  UAPSvg: {
    width: '35%',
    marginLeft: 5,
    backgroundColor: 'transparent',
    marginTop: 7
  },
  BottomArea: {
    //marginTop: '10%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  LoginButton: {
    width: '90%',
    height: 60,
    alignItems: 'flex-end',
    display: 'flex',
    marginBottom: '3%',
    borderRadius: 20
  },
  SignInText: {
    borderRadius: 20,
    color: '#fffff1',
    fontSize: 20,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    lineHeight: 60
  },
  centeredView: {
    flex: 1,
    //justifyContent: "center",
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    marginTop: '75%',
    backgroundColor: '#050505',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.9
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18
  }
})
