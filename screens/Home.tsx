import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Animated, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home(navigation) {

    //持久化存储
    const setStorage = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    }

    //获取存储的值
    const getStorage = async (key) => {
        return await AsyncStorage.getItem(key);
    }

    return (
        <View>
            <Text>aaaa</Text>
        </View>
    );
}