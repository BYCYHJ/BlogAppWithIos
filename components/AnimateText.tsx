import { useEffect, useMemo } from "react";
import { View, Text, StyleProp, ViewStyle, Dimensions } from "react-native";
import Animated, { useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const windowSet = Dimensions.get('window');

export default function AnimateText({ children, ...prop }) {
    const aWidth = useSharedValue(20);//设置动画宽度

    // //当value改变时，根据字数线性变化宽度
    aWidth.value = useMemo(() => {
        const width = children.length * prop.fontSize;
        if (width < prop.maxWidth) {
            return withTiming(width, {
                duration: 100,
            });
        } else if (aWidth.value != prop.maxWidth) {
            return withTiming(prop.maxWidth, {
                duration: 100,
            });
        }
    }, [children]);

    return (
        <Animated.View style={[prop.containerStyle, { backgroundColor: prop.backgroundColor ? prop.backgroundColor : 'transparent', width: aWidth }]}>
            <Text style={[prop.textStyle]}>{children}</Text>
        </Animated.View>
    );
}

type AnimateTextProps = {
    backgroundColor?: string,//背景颜色
    fontSize: number,//字体大小
    textStyle?: StyleProp<ViewStyle>,//内部Text样式
    containerStyle?: StyleProp<ViewStyle>,//容器样式
    maxWidth: number
};