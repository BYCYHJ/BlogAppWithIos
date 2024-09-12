import { View, StyleSheet, KeyboardAvoidingView, Keyboard, Dimensions, TouchableOpacity, Text } from "react-native";
import Overlay from "./Overlay";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import TextAreaResizable from "react-native-textarea-resizable";
import React, { Ref, useEffect, useMemo, useRef, useState } from "react";
import AutoHeightTextInput from "./AutoHeightTextInput";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { Input } from "@rneui/base";
import { PublishComment, getUniqueUserInfo, publishBlog } from "../services/services";

const windowSet = Dimensions.get('window');

function CommentEditor(props: commentEditorProps, ref) {
    const textValue = useRef("");
    const inputRef = useRef();

    useEffect(() => {
        if (props.visible == true) {
            inputRef.current.focus();
            console.log(inputRef.current);
        } else {
            Keyboard.dismiss();
        }
    }, [props.visible]);

    //发布评论
    const pressPublish = async () => {
        //获取用户信息
        const userInfo = getUniqueUserInfo();
        console.log(props.highestCommentId + "...?");
        //发布评论
        const { data, status } = await PublishComment(textValue.current, props.blogId, userInfo.userId, props.replyCommentId, props.highestCommentId);
        if (status <= 299) {
            //将新评论加入列表中
            props.setNewData(data.Data);
            Keyboard.dismiss();
        }
    }

    const autoInput = useMemo(() =>
        <AutoHeightTextInput
            onTextChange={value => textValue.current = value}
            animateViewHeight={props.animateHeight}
            style={styles.textAreaStyle}
            containerStyle={styles.textContainerStyle}
            ref={inputRef}
            maxHeight={100}
            placehoder={props.replyId === "" ? "" : `回复 ${props.replyName}：`}
        />
        , []);

    return (
        <Overlay
            height={props.animateHeight}
            setVisible={function (): void {
                props.setVisible();
            }}
            visible={props.visible}
            backgroundColor={"rgba(111,111,111,0.2)"}
            style={{ backgroundColor: 'transparent' }}
        >
            <View style={{ backgroundColor: 'white', borderTopStartRadius: 15, borderTopEndRadius: 15, height: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                    {autoInput}
                    <Button style={styles.commitButton}
                        onPress={async () => { await pressPublish(); }}>
                        <ButtonText fontSize={14}>发布</ButtonText>
                    </Button>
                </View>
            </View>
        </Overlay>
    );
}

export default React.forwardRef(CommentEditor);

type commentEditorProps = {
    visible: boolean,
    setVisible: () => void,//设置输入框为不可见
    animateHeight: SharedValue<number>,//动态高度
    replyId?: string,//所回复的人的id
    replyName?: string,//所回复的人的名称
    blogId: string,//所属博客id
    replyCommentId?: string,//回复的评论id
    highestCommentId?: string,//最高级评论,
    setNewData:React.Dispatch<React.SetStateAction<any[]>>,
}

const styles = StyleSheet.create({
    textAreaStyle: {
        lineHeight: 20,
        marginTop: 23,
        width: windowSet.width * 0.9,
        fontSize: 15,
        borderRadius: 10,
        backgroundColor: "#f2f2f4",
        paddingLeft: 10,
        paddingBottom: 10
    },
    textContainerStyle: {
        width: windowSet.width * 0.75,
        borderWidth: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        alignSelf: 'flex-start',
        paddingLeft: 5,
    },
    commitButton: {
        borderRadius: 10,
        backgroundColor: 'orangered',
        marginLeft: 15,
        width: windowSet.width * 0.2,
    }
});