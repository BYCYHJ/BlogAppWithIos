import { Button, ButtonText } from "@gluestack-ui/themed";
import { Avatar } from "@rneui/base";
import { useRef, useState } from "react";
import { Dimensions, StyleSheet, View, Animated, Image } from "react-native";
import AntdIcon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { photoUploadToServer } from '../services/services'
import { EasyLoading, Loading } from './Loading'
import { setUniqueUserInfo, getUniqueUserInfo } from "../services/services";

const AnimatedAvatar = Animated.createAnimatedComponent(Image);

export default function UpdateAvatar(props: AvatarAnimated) {
    const [avatarUrl, setAvatarUrl] = useState({ uri: props.url });//头像路径
    const [showButton, setShowButton] = useState(false);//是否显示关闭和上传头像按钮

    //添加宽度监听器,当大于屏幕宽度的0.6时显示
    props.width.addListener(({ value }) => {
        if (value > windowSet.width * 0.6) {
            setShowButton(true);
        }
    });

    const AnimatedRadius = props.width.interpolate({
        inputRange: [0, windowSet.width],
        outputRange: [0, windowSet.width * 0.5]
    });

    const uploadAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true
        });
        //如果选择了图片
        if (!result.canceled) {
            EasyLoading.show();
            //上传到服务器中
            const { data, status } = await photoUploadToServer({ base64Str: result.assets[0].base64 });
            if (status < 299) {
                //更新头像为新头像
                setAvatarUrl({ uri: data });
                //更新userInfo
                const userInfo = getUniqueUserInfo();
                if (userInfo) {
                    userInfo.avatarUrl = data;
                    setUniqueUserInfo(userInfo);
                }

            } else {
                console.log("失败" + data);
            }
            EasyLoading.dismiss();
        }
    }

    //上传头像
    const uploadAndGranted = async () => {
        const permission = ImagePicker.PermissionStatus;
        //未授权则授权
        if (!permission.GRANTED) {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
                //提示权限不足

            }
        }
        await uploadAvatar();
    }

    const PressClose = () => {
        props.pressClose();
    }

    return (
        <Animated.View style={[styles.container, { width: props.width, height: props.height, display: props.display ? 'flex' : 'none' }]}>
            <View style={{ height: windowSet.height * 0.25, justifyContent: 'flex-end', display: showButton ? 'flex' : 'none' }}>
                <AntdIcon name="close" style={styles.icon} onPress={PressClose} />
            </View>
            <Animated.View style={[styles.avatarArea, { width: props.width }]}>
                {/* <Avatar rounded size={windowSet.width} source={avatarUrl} /> */}
                <AnimatedAvatar source={avatarUrl} style={{ width: props.width, height: props.width, borderRadius: AnimatedRadius }} />
                <Button style={[styles.buttonStyle, { display: showButton ? 'flex' : 'none' }]} onPress={uploadAndGranted}><ButtonText>更换头像</ButtonText></Button>
            </Animated.View>
            <Loading style={{ backgroundColor: 'transparent' }}></Loading>
        </Animated.View>
    );
}

const windowSet = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    avatarArea: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: 'white',
        fontSize: 25,
        paddingBottom: 85,
        paddingLeft: 15,
        alignSelf: 'flex-start',
    },
    buttonStyle: {
        backgroundColor: '#121212',
        borderRadius: 20,
        marginTop: 30,
        height: 40,
        width: windowSet.width * 0.6,
    },
});

interface AvatarAnimated {
    width: Animated.Value,
    height: Animated.Value,
    url: string,
    display: boolean,
    pressClose: Function
}