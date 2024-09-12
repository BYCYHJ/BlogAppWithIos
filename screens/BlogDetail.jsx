import { Button, Divider } from "@gluestack-ui/themed";
import { Input } from "@rneui/themed";
import { Dimensions, SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Avatar, Card } from '@rneui/base';
import { ButtonText } from "@gluestack-ui/themed";
import { useEffect, useRef, useState } from "react";
import { GetChildrenComments, GetHighestComments, GetUniqueBlog } from "../services/services";
import { Blog } from '../types/UserInfo';
import AnimateIcon from "../components/AnimateIcon";
import { FlatList } from "react-native";
import { MyComment } from "../types/UserInfo";
import { useSharedValue, withSpring } from "react-native-reanimated";
import Comments from "../components/Comments";

const windowSet = Dimensions.get('window');

export default function ReadOnlyBlog({ navigation, route }) {
    const AvatarImg = require("../screens/logo.png");
    const heartAnimate = require('../lottie/heartBeat.json');//喜欢点击动画
    const starAnimate = require('../lottie/starBeat.json');//收藏点击动画
    const [isLike, setIsLike] = useState(false);
    const [isStar, setIsStar] = useState(false);
    const user = {
        userId: route.params.userId,
        userName: route.params.userName,
        avatarUrl: route.params.avatarUrl,
    };
    const blog = {
        id: route.params.blogId,
        title: route.params.blogTitle,
        content: route.params.blogContent
    };
    const loadingAnimation = useRef(null);//加载评论时的动画
    const [commentLoading, setCommentLoading] = useState(false);
    const animateHeight = useSharedValue(-100);//评论区高度
    const [isVisible, setIsVisible] = useState(false); //评论区可见

    // height: windowSet.height * 0.76 height: 55,
    return (
        <SafeAreaView style={{ backgroundColor: 'white', height: windowSet.height }}>
            {/* Header */}
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Entypo size={20} name="chevron-thin-left" style={{ paddingLeft: 12, paddingRight: 20 }} />
                <Avatar rounded size={30} source={{ uri: user.avatarUrl }} avatarStyle={{ resizeMode: 'stretch', height: 30, width: 30 }} />
                <Text style={{ fontSize: 18, paddingLeft: 15, width: windowSet.width * 0.4 }}>{user.userName}</Text>
                <View style={{ width: windowSet.width * 0.3 }}>
                    <Button backgroundColor="transparent" borderColor="#e5e6e8" borderWidth={1} borderRadius={20} height={28} alignSelf="flex-end">
                        <ButtonText size='sm' color="#a5a7af">关注</ButtonText>
                    </Button>
                </View>
            </View>
            {/* Content */}
            <ScrollView style={{ width: windowSet.width * 0.93, alignSelf: 'center', height: windowSet.height * 0.76 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                {/* BlogHeader:Title、Avatar */}
                {/* 标题 */}
                <View style={{ paddingTop: 15, justifyContent: 'center', paddingBottom: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{blog.title}</Text>
                </View>
                {/* 用户信息 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
                    <Avatar rounded size={60} source={{ uri: user.avatarUrl }} avatarStyle={{ resizeMode: 'stretch', height: 60, width: 60 }} />
                    <View style={{ paddingLeft: 15, justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>{user.userName}</Text>
                        <Text style={{ backgroundColor: "#ffede9", color: 'orangered', marginTop: 5, paddingLeft: 3, paddingRight: 3 }} >未知生物</Text>
                    </View>
                    <View style={{ width: windowSet.width * 0.57 }}>
                        <Button backgroundColor="transparent" borderColor="orangered" borderWidth={1} borderRadius={20} height={28} alignSelf="flex-end">
                            <ButtonText size='sm' color="orangered" >关注</ButtonText>
                        </Button>
                    </View>
                </View>
                <View style={{ height: 30 }} />
                {/* 博客内容 */}
                <RenderHtml contentWidth={windowSet.width * 0.9} source={{ html: blog.content }} tagsStyles={tagsStyles} />
                <Text style={{ color: 'grey', alignSelf: 'center' }}>—— 2023-12-30 09:40:22 ——</Text>
                <Divider my='$0.5' marginTop={20} backgroundColor="#f2f2f4" />
                {/* Comments */}
                <View>
                    {/* 输入框 */}
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
                        onPress={() => {
                            animateHeight.value = withSpring(windowSet.height * 0.7, {
                                velocity: 0,
                                damping: 50
                            });
                            setTimeout(() => {
                                setIsVisible(true);
                            }, 100);
                        }}
                    >
                        <Avatar rounded size={35} source={AvatarImg} containerStyle={{ marginLeft: 10 }} avatarStyle={{ resizeMode: 'stretch', height: 35, width: 35 }} />
                        <View style={{ marginLeft: 20, height: 35, width: windowSet.width * 0.75, backgroundColor: '#f2f2f4', borderRadius: 20, justifyContent: 'center' }}>
                            <Text style={{ color: '#c2c2c3', fontWeight: '500', paddingLeft: 15 }} >说点什么...</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 50 }} />
                </View>
            </ScrollView>
            <View style={{ flex: 2 }}>
                <Divider width={windowSet.width * 0.9} alignSelf="center" backgroundColor="#f2f2f4" />
                <View style={{ height: windowSet.height * 0.08, backgroundColor: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* 评论输入框 */}
                    <TouchableOpacity style={styles.bottomReadOnlyInput}
                        onPress={() => {
                            animateHeight.value = withSpring(windowSet.height * 0.7, {
                                velocity: 0,
                                damping: 50
                            });
                            setTimeout(() => {
                                setIsVisible(true);
                            }, 100);
                        }}
                    >
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Icon size={15} name="edit" color={'grey'} />
                            <Text style={styles.bottomInputText}>说点什么...</Text>
                        </View>
                    </TouchableOpacity>
                    {/* 点赞、收藏、评论图标 */}
                    <View style={{ width: windowSet.width * 0.6 }}>
                        <View style={styles.allIconArea}>
                            <View style={styles.bottomIconArea}>
                                <AnimateIcon lottiePath={heartAnimate} iconName="hearto" width={30} height={30} onCancle={() => { }} onPress={() => { }} isPressed={isLike} setIsPressed={setIsLike} />
                                <Text style={styles.bottomIconText}>1024</Text>
                            </View>
                            <View style={styles.bottomIconArea}>
                                <AnimateIcon lottiePath={starAnimate} iconName="staro" width={32} height={32} onCancle={() => { }} onPress={() => { }} isPressed={isStar} setIsPressed={setIsStar} />
                                <Text style={styles.bottomIconText}>1024</Text>
                            </View>
                            <View style={styles.bottomIconArea}>
                                <Icon size={27} name="message1" color={'black'} />
                                <Text style={styles.bottomIconText}>50</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Comments
                blogId={blog.id}
                visibale={isVisible}
                onHide={() => {
                    setIsVisible(false);
                }}
                height={animateHeight}
            />
        </SafeAreaView>
    );
}

//html样式
const tagsStyles = {
    p: {
        fontSize: 16,
        lineHeight: 25,
    },
    a: {
        color: '#ff4500',
        textDecorationLine: 'none'
    },
    ul: {
        fontSize: 16,
        lineHeight: 25,
    },
    ol: {
        fontSize: 16,
        lineHeight: 25,
    },
    div: {
        fontSize: 16,
        lineHeight: 25,
    },
    code: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 20,
        fontSize:12
    },
    u:{
        backgroundColor:'#f8f2f4',
        color:'#c7254e',
        textDecorationLine:'none',
        borderRadius:10,
    }
};

const styles = StyleSheet.create({
    bottomReadOnlyInput: {
        width: windowSet.width * 0.3,
        backgroundColor: '#f2f2f4',
        height: 33,
        alignSelf: 'center',
        marginLeft: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    bottomInputText: {
        lineHeight: 30,
        fontSize: 15,
        color: 'grey',
        paddingLeft: 5,
        fontWeight: '500'
    },
    allIconArea: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    bottomIconArea: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        justifyContent: 'center'
    },
    bottomIconText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'grey',
        paddingLeft: 4
    },
    card: {
        borderRadius: 30,
        width: windowSet.width * 0.95,
        shadowOffset: { width: 1, height: 1 },
        borderWidth: 1,
        borderColor: '#eff0f1',
        alignSelf: 'center'
    },
});
