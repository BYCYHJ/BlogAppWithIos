import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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
    const VituralBlogList = () => {
        return(<BlogList navigation={navigation}></BlogList>);
    }

    return (
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
                    component={Discover}
                    options={{
                        tabBarIcon: ({ focused, color }) => (
                            <TabBarIcon focused={focused} tintColor={color} name="message-square" />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="My"
                    component={MyInfo}
                    options={{
                        tabBarIcon: ({ focused, color }) => (
                            <TabBarIcon focused={focused} tintColor={color} name="user" />
                        ),
                    }}
                />
            </Tabs.Navigator>
        </NavigationContainer>
    );
}