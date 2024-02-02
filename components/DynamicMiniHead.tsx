import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { ViewStyle,StyleProp } from 'react-native';

export default function DynamicMiniHead(props: DynamicMiniHeadProp) {
    const Scroll_Distance = props.maxHeight - props.minHeight;
    const Component = props.component;

    const AnimatedHeaderHeight = props.scrollY.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [props.maxHeight, props.minHeight],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View style={[{ height: AnimatedHeaderHeight,backgroundColor:props.backgroundColor},props.containerStyle]}>
            {props.component == null ? null : <Component {...props.componentProps}/>}
        </Animated.View>
    );
}

interface DynamicMiniHeadProp {
    maxHeight: number,
    minHeight: number,
    backgroundColor: string,
    scrollY: Animated.Value,
    component: React.ComponentType | null,
    componentProps : any | null,
    containerStyle?: StyleProp<ViewStyle>
}