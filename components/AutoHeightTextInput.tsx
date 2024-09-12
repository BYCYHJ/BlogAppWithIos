import { Input } from '@rneui/base';
import React, { Ref, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { TextInput, StyleSheet, ViewStyle, StyleProp, Keyboard, TouchableOpacity, Text } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

const AutoHeightTextInput = (props: AutoTextInputProps, ref) => {
    const [height, setHeight] = useState(0);
    const [value, setValue] = useState('');
    const inputRef = React.createRef<Input>();

    useImperativeHandle(ref, () => ({
        //传递子组件清空方法
        clearContent() {
            handleChangeText('');
        },
        //聚焦键盘
        focus() {
            inputRef.current.focus();
        }
    }));

    const handleChangeText = (text) => {
        setValue(text);
        if (props.onTextChange) {
            props.onTextChange(text);
        }
    };

    const handleContentSizeChange = (event) => {
        const newHeight = event.nativeEvent.contentSize.height;
        if (props.animateViewHeight.value > 400) {
            if (newHeight < props.maxHeight && newHeight > height) {
                props.animateViewHeight.value = props.animateViewHeight.value + (newHeight - height);
            } else if (height > newHeight && newHeight > 20) {
                props.animateViewHeight.value = props.animateViewHeight.value - (height - newHeight);
            }
        }
        setHeight(Math.max(20, props.maxHeight > newHeight ? newHeight : props.maxHeight)); // 最小值设置为20
    };


    return (
        <Input
            onChangeText={value => handleChangeText(value)}
            value={value}
            ref={inputRef}
            {...props}
            multiline
            onContentSizeChange={handleContentSizeChange}
            style={[styles.default, { height }, props.style]}
            inputContainerStyle={props.containerStyle}
            placeholder={props.placehoder}
        />
    );
};

const styles = StyleSheet.create({
    default: {
    },
});

export default React.forwardRef(AutoHeightTextInput);

type AutoTextInputProps = {
    maxHeight: number,
    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    animateViewHeight?: SharedValue<number>,
    onTextChange: (string) => void,
    placehoder?: string,
}
