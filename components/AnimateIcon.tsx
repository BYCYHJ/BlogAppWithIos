import { useEffect, useRef, useState } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/AntDesign'

export default function AnimateIcon(props: AnimateIconProps) {
    //const [isPressed, setIsPressed] = useState(false);
    const animation = useRef(null);
    const initialHeight = 30;
    const initialMargin = 16;
    const initialIconSize = 27;
    const initialLottieSize = 65;
    const multiplier = props.height / initialHeight;

    const onPress = props.onPress;

    useEffect(()=>{
        if(props.isPressed){
            animation.current?.play();
        }
    },[props.isPressed]);

    return (
        <TouchableOpacity onPress={() => {
            if (!props.isPressed) {
                props.onPress();
            } else {
                props.onCancle();
            }
            props.setIsPressed(!props.isPressed);
            animation.current?.reset();
            animation.current?.play();
        }}
            style={{ alignItems: 'center', justifyContent: 'center', height: props.height, width: props.width }}>
            <LottieView
                autoPlay={false}
                loop={false}
                ref={animation}
                style={{
                    width: initialLottieSize * multiplier, height: initialLottieSize * multiplier,
                    backgroundColor: 'transparent', display: props.isPressed ? 'flex' : 'none',
                    // marginTop: initialMargin * multiplier, marginLeft: initialMargin * multiplier
                }}
                source={props.lottiePath}
            />
            <Icon name={props.iconName} size={initialIconSize * multiplier} style={{
                display: !props.isPressed ? 'flex' : 'none'
            }} />
        </TouchableOpacity >
    );
}

type AnimateIconProps = {
    width: number,
    height: number,
    iconName: string,
    lottiePath: string,
    onPress?: () => any,
    onCancle?: () => any,
    isPressed: Boolean,
    setIsPressed: (Boolean) => void,
}