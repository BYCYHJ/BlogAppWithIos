import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import { Animated, Dimensions, StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import ReadOnlyBlog from './screens/BlogDetail';

export default function RootStack() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Login"
                screenOptions={{
                    headerShown: false,//不显示通用Header
                    gestureEnabled: true,//开启手势触摸
                    gestureDirection: "horizontal"//方向为水平
                }}>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Blog' component={ReadOnlyBlog} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator();