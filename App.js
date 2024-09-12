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
import AIChat from './screens/AIChat';

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
    // <AnimatedLoader loading={loading}>
      <UserProvider component={
        <GlobalSignalR component={
          <GluestackUIProvider config={config}>
            {/* <Home></Home> */}
            {/* <ReadOnlyBlog/> */}
            <RootStack loading={loading} />
            {/* <AIChat /> */}
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
    // </AnimatedLoader>
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
