import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View, Animated } from 'react-native';
import {
    AnimatedTabBarNavigator,
    DotSize,
    TabElementDisplayOptions,
} from 'react-native-animated-nav-tab-bar';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import BlogList from './BlogList';
import MyInfo from './MyInfo';
import { getUniqueUserInfo, setStorage,setUniqueUserInfo } from '../services/services';
import ChatList from './ChatList';
import SideMenu from '@rexovolt/react-native-side-menu';
import UpdateAvatar from '../components/UpdateAvatar';
import { UserInfo } from '../types/UserInfo';

const windowSet = Dimensions.get('window');

const Tabs = AnimatedTabBarNavigator();

const Screen = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
`;

const Logo = () => (
    <Image
        source={require('./logo.png')}
        resizeMode={'cover'}
        style={{ width: 150, height: 150 }}
    />
);

const TabBarIcon = (props: any) => {
    return (
        <Icon
            name={props.name}
            size={props.size ? props.size : 24}
            color={props.tintColor}
        />
    );
};

const Discover = (props: any) => (
    <View>
        <Logo />
        <Text>Discover</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
            <Text>Go to Home</Text>
        </TouchableOpacity>
    </View>
);

export default function Home({ navigation }) {
    const [userInfo, setUserInfo] = useState<UserInfo>(getUniqueUserInfo());//用户信息
    const [showMenu, setShowMenu] = useState(false);//是否展示菜单
    const upAvatarWidth = useRef(new Animated.Value(0)).current;
    const upAvatarHeight = useRef(new Animated.Value(0)).current;
    const avatarUrl = "https://i.postimg.cc/7br8STM5/logo2.png";//默认头像
    const [showUpAvatar, setShowAvatar] = useState(false);//是否展示头像上传页面

    //打开侧边栏
    const OpenMenu = () => {
        setShowMenu(true);
    }
    //关闭侧边栏
    const CloseMenu = (isOpen) => {
        if (isOpen) {
            setShowMenu(false);
        }
    }
    //打开头像上传页面
    const PressAvatar = () => {
        setShowAvatar(true);
        Animated.parallel([
            Animated.spring(upAvatarWidth, {
                toValue: windowSet.width,
                useNativeDriver: false
            }),
            Animated.spring(upAvatarHeight, {
                toValue: windowSet.height,
                useNativeDriver: false
            }),
        ]).start();
    }
    //关闭头像上传页面
    const PressAvatarClose = () => {
        Animated.parallel([
            Animated.spring(upAvatarWidth, {
                toValue: 0,
                speed: 5,
                useNativeDriver: false
            }),
            Animated.spring(upAvatarHeight, {
                toValue: 0,
                speed: 5,
                useNativeDriver: false
            }),
        ]).start();
        setShowAvatar(false);
    }

    const VituralBlogList = () => {
        return (<BlogList navigation={navigation}></BlogList>);
    }
    const VirturalChatList = () => {
        return (<ChatList navigation={navigation} userInfo={userInfo} />);
    }
    const VirturalMyInfo = () => {
        return (<MyInfo showMenu={OpenMenu} pressAvatar={PressAvatar} closeAvatar={PressAvatarClose} />);
    }

    const Test = () => {
        return (
            <View><Text>aaa</Text></View>
        );
    }
    const menu = <Test />;
    return (
        <SideMenu menu={menu} overlayOpacity={0} animateOverlayOpacity={false} isOpen={showMenu} menuPosition='right' openMenuOffset={windowSet.width * 0.5} onChange={(isOpen) => CloseMenu(showMenu)} >
            <UpdateAvatar width={upAvatarWidth} height={upAvatarHeight}
                url={userInfo.avatarUrl || userInfo.avatarUrl == "" ? avatarUrl : userInfo.avatarUrl}
                display={showUpAvatar} pressClose={PressAvatarClose} />
            <View style={{ display: showUpAvatar ? 'none' : 'flex',width:windowSet.width,height:windowSet.height }} >
                <NavigationContainer independent={true}>
                    <Tabs.Navigator
                        initialRouteName="Home"
                        tabBarOptions={{
                            activeTintColor: '#ffffff',
                            inactiveTintColor: '#223322',
                            activeBackgroundColor: 'red',
                        }}
                        appearance={{
                            shadow: true,
                            // floating: true,
                            whenActiveShow: TabElementDisplayOptions.ICON_ONLY,
                            dotSize: DotSize.SMALL,
                        }}>
                        <Tabs.Screen
                            name="Home"
                            component={VituralBlogList}
                            options={{
                                tabBarIcon: ({ focused, color }) => (
                                    <TabBarIcon focused={focused} tintColor={color} name="home" />
                                ),
                            }}
                        />
                        <Tabs.Screen
                            name="Message"
                            component={VirturalChatList}
                            options={{
                                tabBarIcon: ({ focused, color }) => (
                                    <TabBarIcon focused={focused} tintColor={color} name="message-square" />
                                ),
                            }}
                        />
                        <Tabs.Screen
                            name="My"
                            component={VirturalMyInfo}
                            options={{
                                tabBarIcon: ({ focused, color }) => (
                                    <TabBarIcon focused={focused} tintColor={color} name="user" />
                                ),
                            }}
                        />
                    </Tabs.Navigator>
                </NavigationContainer>
            </View>
        </SideMenu>
    );
}