import { Modal } from "@gluestack-ui/themed";
import { useState } from "react";
import { Dimensions, StyleProp, StyleSheet, Touchable, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const windowSet = Dimensions.get('window');

export default function Overlay({children,...props}) {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withSpring(props.height.value)
        }
    });

    return (
        <TouchableOpacity style={[styles.allView, { display: props.visible ? 'flex' : 'none', backgroundColor: props.backgroundColor }]}
            onPress={() => {
                props.height.value = withSpring(0, {
                    damping: 20,
                    velocity: 5
                });
                if (props.setCollapse) { props.setCollapse(); }
                setTimeout(() => {
                    props.setVisible();
                }, 400);
            }}
            activeOpacity={1}
        >
            <Animated.View style={[animatedStyle, props.style]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
}

type OverlayProps = {
    height: SharedValue<number>,
    style?: StyleProp<ViewStyle>,
 //   content: React.Component | null,
    setVisible: () => void,
    visible: boolean,
    setCollapse?: () => void,
    backgroundColor: string
}

const styles = StyleSheet.create({
    allView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: windowSet.width,
        height: windowSet.height,
        justifyContent: 'flex-end',
    }
});