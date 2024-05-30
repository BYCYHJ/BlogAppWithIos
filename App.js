import { Dimensions, StyleSheet, View } from 'react-native';
import Login from './screens/Login';
import RootStack from './RootStack';
// import BlogList from './screens/BlogList';
import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import Home from './screens/Home';
import ReadOnlyBlog from './screens/BlogDetail';
import BlogChat from './screens/BlogChat';
import MyInfo from './screens/MyInfo';
import './constant';
import UpdateAvatar from './components/UpdateAvatar';
import BlogEditor from './screens/BlogEditor';
import Test from './screens/Test';
import OtherInfo from './screens/OtherInfo';
import schedulePushNotification from './services/notification';
import { createContext, useContext, useEffect } from 'react';
import GlobalSignalR from './components/GlobalSignalR';
import UserProvider from './UserContext';
import 'react-native-gesture-handler';
import LikeNotification from './screens/LikeNotification';
import Entypo from '@expo/vector-icons/Entypo';
import { Animated, Image, SafeAreaView } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useState } from 'react';

const windowSet = Dimensions.get('screen');

export default function App() {
  const [loading, setLoading] = useState(true);
  const backgroundColor = require('./sources/loginBackground.jpg');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <AnimatedLoader loading={loading}>
      <UserProvider component={
        <GlobalSignalR component={
          <GluestackUIProvider config={config}>
            {/* <Home></Home> */}
            {/* <ReadOnlyBlog/> */}
            {/* <RootStack /> */}
            <RootStack />
            {/* <LikeNotification/> */}
            {/* <UpdateAvatar/> */}
            {/* <BlogChat/> */}
            {/* <MyInfo/> */}
            {/* <BlogEditor/> */}
            {/* <Test /> */}
            {/* <Test2 /> */}
            {/* <OtherInfo /> */}
          </GluestackUIProvider>
        }>
        </GlobalSignalR>}>
      </UserProvider>
    </AnimatedLoader>
  );
}

function AnimatedLoader({ children, loading }) {
  const logoUri = require('./sources/logo.png');
  const AnimatedOpacity = new Animated.Value(1);
  const AnimatedPadding = new Animated.Value(windowSet.height * 0.2);
  const backgroundOpacity = new Animated.Value(1);
  const [animationEnd, setAnimationEnd] = useState(false);

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
      {animationEnd && children}
      {!animationEnd && (
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
        </AnimatedSafeAreaView>)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
