import React, { useState } from 'react';
import { View, Text, Button, Animated, TextInput } from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
//import { Input } from 'beeshell';

const AnimatedInput = Animated.createAnimatedComponent(Text);
const AnimatedBeeShell = Animated.createAnimatedComponent(TextInput);

export default function Test() {
    const [fontSize, setFontSize] = useState(new Animated.Value(16));

    const handlePress = () => {
        Animated.timing(fontSize, {
            toValue: 24,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View>
            <Bubbles size={10} color="#FFF" />
            <Bars size={10} color="#FDAAFF" />
            <Pulse size={10} color="#52AB42" />
            <DoubleBounce size={10} color="#1CAFF6" />
        </View>
    );
}