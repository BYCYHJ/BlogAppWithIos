import { Button, ButtonText, Input, InputField } from "@gluestack-ui/themed";
import { Image, Text } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Keyboard, SafeAreaView, ScrollView, View, useAnimatedValue, TouchableOpacity, FlatList } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import AutoHeightTextInput from "../components/AutoHeightTextInput";
import { useSharedValue } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import LottieView from "lottie-react-native";
import { GetAIAnswer } from "../services/services";
import EventSource, { EventSourceListener } from "react-native-sse";
import AnimateText from "../components/AnimateText";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const windowSet = Dimensions.get('window');

const exampleData = [];

function AIChatMsg(props: MsgContent) {
    const [msg, setMsg] = useState(props.cType == 0 ? "" : props.question);
    const timer = new Date();

    const getStream = async (data: string | undefined | null | "") => {
        //输入框无内容直接返回
        if (data == "" || typeof data != "string") { return; }

        const params = new URLSearchParams();
        params.append("content", data);
        const url = "http://192.168.2.117:5046/api/chat/AIChat?" + params.toString();
        //server sent event
        const es = new EventSource(url);
        // 添加事件监听器
        es.addEventListener("open", (event) => {
            console.log("SSE 连接已打开。");
        });
        es.addEventListener("message", (event) => {
            if (event.data != "[DONE]") {
                setMsg(preMsg => preMsg + event.data);
                console.log(event.data);
            } else {
                //已经全部加载完成，关闭连接
                es.close();
            }
            props.scrollViewFuc();
        });
        es.addEventListener("error", (event) => {
            if (event.type === "error") {
                console.error("连接错误：", event.message);
            } else if (event.type === "exception") {
                console.error("错误：", event.message, event.error);
            }
        });

        es.addEventListener("close", (event) => {
            console.log("SSE 连接已关闭。");
        });
    }

    useEffect(() => {
        if (props.cType == 0) {
            getStream(props.question);
        }
    }, [props.question]);

    const Loader = () => {
        return (
            <View style={{ paddingLeft: windowSet.width * 0.05 }}>
                <LottieView loop autoPlay source={require("../lottie/aiLoading.json")}
                    style={{ width: 60, height: 60 }}
                />
            </View>
        );
    }

    const UserMsg = () => {
        return (
            <View style={{ alignItems: 'flex-end', paddingRight: windowSet.width * 0.05 }}>
                <View style={{ backgroundColor: 'white', width: 20 * msg.length > windowSet.width * 0.9 ? windowSet.width * 0.9 : 20 * msg.length, borderRadius: 10, borderBottomRightRadius: 0, alignItems: 'center' }}>
                    <Text style={{ lineHeight: 25, fontSize: 16, fontWeight: '400', padding: 5 }}>{msg}</Text>
                </View>
            </View>
        );
    }

    const AIMsg = () => {
        return (
            <View style={{ paddingLeft: windowSet.width * 0.05 }}>
                <View style={{ backgroundColor: 'white', width: 20 * msg.length > windowSet.width * 0.9 ? windowSet.width * 0.9 : 23 * msg.length, borderRadius: 10, borderBottomLeftRadius: 0, alignItems: 'center' }}>
                    <Text style={{ lineHeight: 25, fontSize: 16, fontWeight: '400', padding: 10 }}>{msg}</Text>
                </View>
                {/* <Button onPress={async () => { await getStream(); }}></Button> */}
            </View >
        );
    }

    return (
        <View style={{}}>
            <Text style={{ alignSelf: 'center', paddingTop: 10, paddingBottom: 20, color: 'grey' }}>{timer.toLocaleTimeString()}</Text>
            {
                props.cType == 0 ?
                    <AIMsg /> :
                    <UserMsg />
            }
            {/* <Loader /> */}
        </View>
    );
}

export default function AIChat() {
    // const [keybordHeight, setKeyboardHeight] = useState(new Animated.Value(0));//软键盘当前高度
    const scrollHeight = useRef(new Animated.Value(windowSet.height * 0.78)).current;//页面高度
    const aiPersonSrc = require('../sources/AiBaby.jpg');
    const inputHeight = useSharedValue(0);//输入框高度
    const aiLoadRef = useRef(null);//动画钩子
    const inputContent = useRef("");//输入内容
    const [chatMsg, setChatMsg] = useState<Array<MsgContent>>([]);//对话数组
    const inputRef = useRef();
    const listRef = useRef<ScrollView>();

    //输入框内容改变函数
    const changeInputContent = (content: string) => {
        inputContent.current = content;
    }

    //自动将List回滚至末条信息
    const scrollViewToEnd = () => {
        listRef.current.scrollToEnd({ animated: true });
    }

    //发送输入框内容函数
    const sendQuestion = () => {
        //向信息数组添加新数据:1.用户提出的问题 2.AI回答的问题
        setChatMsg([...chatMsg, { cType: 1, question: inputContent.current }, { cType: 0, question: inputContent.current, scrollViewFuc: scrollViewToEnd }]);
        console.log(chatMsg);
        //清空输入框内容
        inputRef.current.clearContent();
    }

    //清空Msg
    const clearAllMsg = () => {
        setChatMsg([]);
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
            //根据软键盘高度变化页面高度
            Animated.spring(scrollHeight, {
                tension: 70,
                friction: 13,
                toValue: windowSet.height * 0.78 - e.endCoordinates.height,
                useNativeDriver: false
            }).start();
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            //根据软键盘高度变化页面高度
            Animated.timing(scrollHeight, {
                duration: 300,
                toValue: windowSet.height * 0.78,
                useNativeDriver: false
            }).start();
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    return (
        <SafeAreaView style={{ backgroundColor: '#f1f6fc' }}>
            {/* header */}
            <View style={{ justifyContent: 'center' }}>
                <Entypo size={20} name="chevron-thin-left" style={{ position: 'absolute', paddingLeft: 12, paddingRight: 20 }} />
                <View style={{ height: 55, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: '500', fontSize: 18, zIndex: 1 }}>AI助手</Text>
                    <View style={{ position: 'absolute', width: 50, height: 10, backgroundColor: '#b6f858', borderTopLeftRadius: 5, borderTopRightRadius: 5, zIndex: 0 }} />
                </View>
            </View>
            {/* 信息 */}
            <AnimatedScrollView ref={listRef} style={{ height: scrollHeight, maxHeight: scrollHeight }}>
                {/* 名片 */}
                <View style={{ height: 230, backgroundColor: 'transparent', justifyContent: 'flex-end', paddingBottom: 10 }}>
                    <Image source={aiPersonSrc} containerStyle={{ height: 230, width: 230, marginTop: 10, marginLeft: -20, position: 'absolute', backgroundColor: 'transparent', zIndex: 1 }} style={{ width: 230, height: 230, backgroundColor: 'transparent' }} />
                    <View style={{ height: 155, width: windowSet.width * 0.95 + 5, alignItems: 'center', backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignSelf: 'center' }}>
                        <LinearGradient colors={["#fbd5dc", "#ccd4f9"]} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }} style={{ height: 150, width: windowSet.width * 0.95, borderRadius: 12, flexDirection: 'row' }}>
                            <View style={{ flex: 2 }} />
                            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingRight: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#434a6d', width: '90%' }}>=￣ω￣=，我是助手哈枇，要和我聊聊天嘛？</Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
                {/* 对话 */}
                {/* <AIChatMsg cType={1} /> */}
                <FlatList data={chatMsg} renderItem={object => <AIChatMsg cType={object.item.cType} question={object.item.question} scrollViewFuc={object.item.scrollViewFuc} />} scrollEnabled={false} style={{ paddingBottom: 20 }} />
            </AnimatedScrollView>
            {/* 输入框 */}
            <View style={{ backgroundColor: 'white', width: windowSet.width, height: windowSet.height * 0.12, flexDirection: 'row', borderWidth: 0 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'flex-end', paddingTop: 12 }} onPress={clearAllMsg}>
                    <Svg viewBox="0 0 1024 1024" p-id="9632" width="28" height="28">
                        <Path d="M332.8 204.8L221.866667 264.533333l64-110.933333L221.866667 42.666667l110.933333 64L443.733333 42.666667 384 153.6l64 110.933333c-4.266667 0-115.2-59.733333-115.2-59.733333zM870.4 640l110.933333-64-64 110.933333 64 110.933334-110.933333-64-110.933333 64 64-110.933334-64-110.933333 110.933333 64zM981.333333 42.666667l-64 110.933333L981.333333 264.533333l-110.933333-64-110.933333 64 64-110.933333L759.466667 42.666667l110.933333 64L981.333333 42.666667z m-388.266666 482.133333l110.933333-110.933333-93.866667-93.866667-110.933333 110.933333 93.866667 93.866667zM640 277.333333L746.666667 384c17.066667 17.066667 17.066667 46.933333 0 64L221.866667 968.533333c-17.066667 17.066667-46.933333 17.066667-64 0l-106.666667-106.666666c-17.066667-17.066667-17.066667-46.933333 0-64L576 277.333333c17.066667-17.066667 46.933333-17.066667 64 0z" p-id="9633"></Path>
                    </Svg>
                </TouchableOpacity>
                <AutoHeightTextInput maxHeight={windowSet.height * 0.06} onTextChange={(text) => { changeInputContent(text); }} animateViewHeight={inputHeight}
                    containerStyle={{ flex: 5, borderWidth: 0, alignItems: 'flex-start', borderBottomWidth: 0 }}
                    style={{ backgroundColor: '#f4f7fe', borderRadius: 15, borderWidth: 0, padding: 5, marginTop: 10 }}
                    placehoder="开始探索吧~"
                    ref={inputRef}
                />
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'transparent', paddingTop: 12, alignItems: 'center' }}>
                    <Svg viewBox="0 0 1024 1024" p-id="10867" width="35" height="35">
                        <Path d="M400.696 268.795c-17.249 0-31.233 13.986-31.233 31.233v30.471c0 17.249 13.986 31.233 31.233 31.233s31.233-13.986 31.233-31.233v-30.471c0-17.249-13.985-31.233-31.233-31.233z" fill="#2c2c2c" p-id="10868"></Path>
                        <Path d="M623.649 361.734c17.249 0 31.234-13.986 31.234-31.233v-30.471c0-17.249-13.986-31.233-31.234-31.233s-31.233 13.986-31.233 31.233v30.471c-0.001 17.248 13.985 31.233 31.233 31.233z" fill="#2c2c2c" p-id="10869"></Path>
                        <Path d="M438.295 388.804c-14.656 9.104-19.155 28.362-10.050 43.013 11.209 18.047 41.976 48.59 86.157 48.59 43.958 0 75.1-30.313 86.574-48.223 9.303-14.529 5.068-33.847-9.455-43.15-14.539-9.298-33.852-5.068-43.15 9.455-0.122 0.199-13.38 19.45-33.969 19.45-20.009 0-32.444-18.128-33.278-19.373-9.166-14.423-28.28-18.805-42.829-9.761z" fill="#2c2c2c" p-id="10870"></Path>
                        <Path d="M824.508503 116.690676 571.592236 116.690676c-17.248849 0-31.233352 13.985526-31.233352 31.233352s13.985526 31.233352 31.233352 31.233352l252.916267 0c40.181141 0 72.878844 32.692586 72.878844 72.878844l0 396.966057-189.334159-165.29465c-12.20088-10.655687-30.517037-10.207479-42.173518 0.9967L468.578048 674.16231 309.521472 517.519714c-11.895935-11.70253-30.903847-12.002358-43.154869-0.645706L126.957507 646.163629l0-394.126382c0-40.186258 32.692586-72.878844 72.878844-72.878844l252.916267 0c17.248849 0 31.233352-13.985526 31.233352-31.233352S470.000444 116.690676 452.751594 116.690676L199.836351 116.690676c-74.632791 0-135.346571 60.71378-135.346571 135.346571l0 520.56405c0 74.632791 60.71378 135.346571 135.346571 135.346571l252.916267 0c17.248849 0 31.233352-13.985526 31.233352-31.233352s-13.985526-31.233352-31.233352-31.233352L199.836351 845.481164c-40.186258 0-72.878844-32.692586-72.878844-72.878844l0-41.23924 160.003134-148.385539 159.428036 157.007917c12.048407 11.865235 31.361265 11.981892 43.546795 0.274246l198.576661-190.68697 208.876238 182.346001 0 40.683585c0 40.186258-32.697703 72.878844-72.878844 72.878844L571.592236 845.481164c-17.248849 0-31.233352 13.985526-31.233352 31.233352s13.985526 31.233352 31.233352 31.233352l252.916267 0c74.627674 0 135.346571-60.71378 135.346571-135.346571L959.855074 252.037247C959.855074 177.404456 899.136178 116.690676 824.508503 116.690676z" fill="#2c2c2c" p-id="10871"></Path>
                    </Svg>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, paddingTop: 11, alignItems: 'center' }} onPress={sendQuestion}>
                    <Svg viewBox="0 0 1024 1024" p-id="3195" width="35" height="35">
                        <Path d="M899.925333 172.080762a48.761905 48.761905 0 0 1 0 28.525714l-207.969523 679.448381a48.761905 48.761905 0 0 1-81.115429 20.187429l-150.552381-150.552381-96.304762 96.329143a24.380952 24.380952 0 0 1-41.593905-17.237334v-214.966857l275.821715-243.370667-355.57181 161.596953-103.253333-103.228953a48.761905 48.761905 0 0 1 20.23619-81.091047L838.997333 139.702857a48.761905 48.761905 0 0 1 60.903619 32.353524z" p-id="3196" fill="#9880f3"></Path>
                    </Svg>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

type MsgContent = {
    cType: number,//信息类型，0为ai，1为自己
    question?: string,//问题，当为ai时可为空
    scrollViewFuc?: () => void,
}