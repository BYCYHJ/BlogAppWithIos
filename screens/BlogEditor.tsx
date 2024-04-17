import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogFooter,
    AlertDialogBody,
    Button,
    ButtonText,
    ButtonGroup,
    Input,
    InputField,
    Icon,
    HelpCircleIcon,
} from "@gluestack-ui/themed";
import { Card } from "@rneui/base";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    actions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import * as ImagePicker from 'expo-image-picker';
import { publishBlog } from "../services/services";
import { EasyLoading, Loading } from '../components/Loading';

const windowSet = Dimensions.get('window');

export default function BlogEditor() {
    const richText = useRef();
    const [title, setTitle] = useState("");//标题
    const [descHTML, setDescHTML] = useState("");//富文本内容
    const [showDescError, setShowDescError] = useState(false);//显示错误
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);//键盘状态
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)//是否显示提示框

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardVisible(true);
            // 在键盘弹出时执行其他操作
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false);
            // 在键盘隐藏时执行其他操作
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    const richTextHandle = (descriptionText) => {
        if (descriptionText) {
            setShowDescError(false);
            setDescHTML(descriptionText);
        } else {
            setShowDescError(true);
            setDescHTML("");
        }
    };

    //检查是否有权限并插入图片
    const addImg = async () => {
        const permission = ImagePicker.PermissionStatus;
        //未授权则授权
        if (!permission.GRANTED) {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
                //提示权限不足
                setShowAlertDialog(true);
                return;
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true
        });
        if (!result.canceled) {
            const base64Uri = "data:image/png;base64," + result.assets[0].base64;
            richText.current.insertImage(base64Uri);
        }
        return;
    }

    //发布
    const publish = async () => {
        EasyLoading.show();
        const blog = {
            title:title,
            content:descHTML,
            userId:"ce990000-9030-d493-a0ba-08dc5b9d3277",
            tags:[1]
        };
        const {data,status} = await publishBlog(blog);
        console.log(data);
        EasyLoading.dismiss();
    }

    return (
        <View
            style={styles.container}>
            <AlertDialog isOpen={showAlertDialog}
                onClose={() => {
                    setShowAlertDialog(false)
                }}>
                <AlertDialogContent style={{ backgroundColor: "#3e4043",width:windowSet.width*0.8 }}>
                    <AlertDialogHeader style={{justifyContent:'flex-start'}}>
                        <Icon
                            as={HelpCircleIcon}
                            color="$red400"
                        />
                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold',paddingLeft:15 }}>Not Granted</Text>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text style={{ fontSize: 15, color: 'white', }}>
                            Please grant the photo access to upload your fantastic time.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            style={{ borderColor: '#1869de' }}
                            size="sm"
                            variant="outline"
                            action="secondary"
                            onPress={() => {
                                setShowAlertDialog(false)
                            }}
                        >
                            <ButtonText style={{ color: 'white' }}>Ok</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <View style={styles.header}>
                <Button style={[styles.headerButton, { marginLeft: 10, backgroundColor: 'transparent' }]}>
                    <ButtonText style={{ color: 'black', fontWeight: '400' }}>取消</ButtonText>
                </Button>
                <Text style={{ fontWeight: '500', fontSize: 17 }}>博客</Text>
                <Button style={[styles.headerButton, { marginRight: 20, backgroundColor: '#539FEC' }]} onPress={async () => publish()}>
                    <ButtonText>发布</ButtonText>
                </Button>
            </View>
            <View style={styles.richTextContainer}>
                <Card containerStyle={[styles.card, { height: windowSet.height * 0.07, justifyContent: 'center' }]}>
                    <Input style={styles.richTextTitleStyle}>
                        <InputField placeholder="Title" style={{ fontWeight: 'bold' }} value={title} onChangeText={(text) => setTitle(text)} />
                    </Input>
                </Card>
                <Card containerStyle={[styles.card, { height: isKeyboardVisible ? windowSet.height * 0.4 : windowSet.height * 0.75, justifyContent: 'space-between', alignItems: 'center' }]}>
                    <ScrollView style={{ height: isKeyboardVisible ? windowSet.height * 0.3 : windowSet.height * 0.6 }}>
                        <RichEditor
                            ref={richText}
                            onChange={richTextHandle}
                            placeholder="Write your cool content here ✉"
                            initialHeight={windowSet.height * 0.4}
                        />
                    </ScrollView>
                    <RichToolbar
                        editor={richText}
                        actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                            actions.insertLink,
                            actions.setStrikethrough,
                            actions.setUnderline,
                            actions.insertImage,
                        ]}
                        style={styles.richToolBar}
                        onPressAddImage={async () => addImg()}
                    >
                    </RichToolbar>
                </Card>
            </View>
            <Loading style={{ backgroundColor: 'transparent' }}></Loading>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowSet.width,
        height: windowSet.height,
        backgroundColor: "#f3f3f7"
    },
    header: {
        marginTop: 40,
        backgroundColor: '#f3f3f7',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerButton: {
        width: 80,
        height: 35,
        borderRadius: 10,
    },
    richTextContainer: {
        display: "flex",
        width: "100%",
        marginBottom: 10,
        alignItems: 'center',
        height: windowSet.height * 0.7,
    },
    card: {
        borderRadius: 10,
        width: windowSet.width * 0.95,
        shadowOffset: { width: 1, height: 1 },
        borderWidth: 0,
    },
    richTextTitleStyle: {
        // width: windowSet.width*0.9,
        height: windowSet.height * 0.05,
        lineHeight: windowSet.height * 0.05,
        fontSize: 25,
        borderWidth: 0
    },
    richToolBar: {
        backgroundColor: 'white',
        height: 50,
        width: windowSet.width * 0.95
    }
});