import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import ReadOnlyBlog from './screens/BlogDetail';
import BlogChat from './screens/BlogChat';
import BlogEditor from './screens/BlogEditor';
import LikeNotification from './screens/LikeNotification';
import OtherInfo from './screens/OtherInfo';
import { Animated, SafeAreaView, View, Text, Image, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import AIChat from './screens/AIChat';

const windowSet = Dimensions.get('screen');

export default function RootStack({ loading }) {
    const [animationEnd, setAnimationEnd] = useState<boolean>(false);

    return (
        <NavigationContainer independent={true}>
            {!animationEnd ?
                <AnimatedLoader loading={loading} animationEnd={animationEnd} setAnimationEnd={setAnimationEnd} />
                :
                <Stack.Navigator initialRouteName="Login"
                    screenOptions={{
                        headerShown: false,//不显示通用Header
                        gestureEnabled: true,//开启手势触摸
                        gestureDirection: "horizontal"//方向为水平
                    }}>
                    <Stack.Screen name='Login' component={Login} />
                    <Stack.Screen name='Home' component={Home} />
                    <Stack.Screen name='Blog' component={ReadOnlyBlog} />
                    <Stack.Screen name="BlogChat" component={BlogChat} />
                    <Stack.Screen name="BlogEditor" component={BlogEditor} />
                    <Stack.Screen name='LikeRecord' component={LikeNotification} />
                    <Stack.Screen name="OtherInfo" component={OtherInfo} />
                    <Stack.Screen name="AIChat" component={AIChat} />
                </Stack.Navigator>
            }
        </NavigationContainer>
    );
}

function AnimatedLoader({ loading, animationEnd, setAnimationEnd }) {
    const logoUri = require('./sources/logo.png');
    const AnimatedOpacity = new Animated.Value(1);
    const AnimatedPadding = new Animated.Value(windowSet.height * 0.2);
    const backgroundOpacity = new Animated.Value(1);

    const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

    useEffect(() => {
        if (loading) return;
        Animated.parallel([
            Animated.timing(AnimatedOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.sequence([
                Animated.timing(AnimatedPadding, {
                    toValue: windowSet.height * 0.2 - 50,
                    duration: 200,
                    useNativeDriver: false
                }),
                Animated.timing(AnimatedPadding, {
                    toValue: windowSet.height,
                    duration: 400,
                    useNativeDriver: false
                }),
                Animated.timing(backgroundOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                })
            ])
        ]).start(() => {
            setAnimationEnd(true);
        });
    }, [loading]);

    return (
        <View>
            <AnimatedSafeAreaView style={{ opacity: backgroundOpacity, alignItems: 'center', width: windowSet.width, height: windowSet.height, backgroundColor: '#fbf3e0', position: 'absolute' }}>
                <Animated.View style={{ transform: [{ translateY: AnimatedPadding }] }}>
                    <Image resizeMode='cover' style={{ width: 170, height: 170 }} source={logoUri} />
                </Animated.View>
                <Animated.View style={{ opacity: AnimatedOpacity, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'absolute', marginTop: windowSet.height * 0.75 }}>
                    <Svg viewBox="0 0 1280 1024" width="25" height="25">
                        <Path d="M1280 635.8c0 182.6-78.8 297-220.6 297-125.2 0-191.6-69.2-313.8-273.2l-62.8-105.2c-16.6-25-29-48.4-42.4-70-40.2 67.6-94.2 166-94.2 166-134 233.2-209.2 282.4-313.8 282.4C86.84 932.8 0 818.2 0 641c0-286 159.56-556.2 367.8-556.2 100.4 0 187.6 49.36 289.6 179 74.2-100.2 156.2-179 261.2-179 198.2 0 361.4 251.4 361.4 551zM574.8 384.4c-85.8-124.2-141.8-161-208.8-161-123.8 0-227.56 212.2-227.56 420 0 97 36.96 151.4 99.16 151.4 60.4 0 98-38 206.4-207.6 0 0 49.4-78.2 130.8-202.8z m487.6 410.4c64.4 0 93.8-55 93.8-149.8 0-248.4-108.6-450.84-246.4-450.84-66.4 0-122.2 51.84-189.8 156.04 18.8 27.6 38.2 58 58.6 90.8l75 124.8c117.4 188.2 147 229 208.8 229z" fill="#1b8efb"></Path>
                    </Svg>
                    <Text style={{ paddingLeft: 10, fontWeight: '700', fontSize: 18 }}>Beta 1.0</Text>
                </Animated.View>
            </AnimatedSafeAreaView>
        </View>
    );
}

const Stack = createNativeStackNavigator();