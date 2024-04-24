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
import LottieView from "lottie-react-native";


const example = {
    html: `<h2><strong>贪心算法介绍</strong></h2>

<p>什么是贪心算法呢？</p>

<p>首先，我们需要知道<a href="https://so.csdn.net/so/search?q=%E8%B4%AA%E5%BF%83%E7%AD%96%E7%95%A5&amp;spm=1001.2101.3001.7020" target="_blank">贪心策略</a>，即解决问题的策略，将局部最优转变为全局最优；</p>

<ul>
	<li>把解决问题的过程分为若干步；</li>
	<li>解决每一步的时候，都选择当前看起来&quot;最优的&quot;解法；</li>
	<li>&quot;希望&quot;得到全局最优解</li>
</ul>

<p>贪心算法的特点：</p>

<ol>
	<li>提出贪心策略，但是贪心策略的提出是没有标准和模板的，可能每一道题的贪心策略都是不同的；</li>
	<li>贪心策略的正确性没有保障，因为我们提出的&quot;贪心策略&quot;有可能是错误的，正确的贪心策略是需要&quot;证明的&quot;；常用的证明方法是我们学过的数学中见过的证明方法。</li>
</ol>

<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<img alt="" src="https://i.postimg.cc/7br8STM5/logo2.png" style="height:200px; width:200px" /></p>

<p>&nbsp;</p>
`
}

const windowSet = Dimensions.get('window');

export default function ReadOnlyBlog({ navigation, route }) {
    const AvatarImg = require("../screens/logo.png");
    const heartAnimate = require('../lottie/heartBeat.json');//喜欢点击动画
    const starAnimate = require('../lottie/starBeat.json');//收藏点击动画
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
    const [comments, setComments] = useState([]);
    const highestPage = useRef(1);
    const loadingAnimation = useRef(null);//加载评论时的动画
    const [commentLoading,setCommentLoading] = useState(false);

    //评论区
    const CommentArea = () => {
        const exampleComments = [{
            id: '1',
            Content: `太厉害了连续空间区域上的问题转化为在离散网格点上进行计算，从而更容易在计算机上实现数值求解。</div><div>差分格式方法有多种，如显式与隐式算法。显式算法相对简单，但有时为了满足计算稳定的条件，需要取很小的步`,
            ParentId: '',
            UserId: '',
            UserName: 'AnAn',
            AvatarUrl: '',
            ChildrenComments: [{
                id: '2',
                Content: "什么很厉害吗?",
                UserId: '',
                UserName: 'BaiBai',
                AvatarUrl: '',
                ReplyName: "AnAn"
            }, {
                id: '4',
                Content: "你很厉害咯?",
                UserId: '',
                UserName: 'Emo',
                AvatarUrl: '',
                ReplyName: "BaiBai"
            },
            ]
        },
        {
            id: '3',
            Content: "楼主很棒",
            ParentId: '',
            UserId: '',
            UserName: '哈枇',
            AvatarUrl: '',
            ChildrenComments: []
        }];

        const commentsArea = ({ item }) => {
            return (
                <View style={{ paddingBottom: 30, alignItems: 'center', width: windowSet.width }}>
                    <View style={{ flexDirection: 'row', width: windowSet.width }}>
                        <Avatar size={36} rounded source={AvatarImg} containerStyle={{ marginLeft: 5 }} avatarStyle={{ resizeMode: 'stretch', height: 45, width: 45 }} />
                        <View style={{ paddingLeft: 10, justifyContent: 'center', width: windowSet.width * 0.72 }}>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#a9a9ab' }}>{item.userName}</Text>
                            <Text style={{ lineHeight: 19, paddingTop: 5 }}>{item.content}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5 }}>
                                <Text style={{ lineHeight: 19, color: 'grey', fontSize: 13 }}>{item.publishDate}</Text>
                                <Text style={{ lineHeight: 19, fontSize: 12 }}> 回复</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', alignSelf: 'flex-start', width: windowSet.width * 0.1 }}>
                            <View style={{ alignItems: 'center', paddingTop: 2 }}>
                                <AnimateIcon lottiePath={heartAnimate} iconName="hearto" width={20} height={20} onCancle={() => { }} onPress={() => { }} />
                                <Text>2</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <FlatList data={item.childrenComment} scrollEnabled={false} renderItem={({ item }) => {
                            return (
                                <View style={{ flexDirection: 'row', width: windowSet.width, paddingTop: 20 }}>
                                    <Avatar size={36} rounded source={AvatarImg} containerStyle={{ marginLeft: 45 }} avatarStyle={{ resizeMode: 'stretch', height: 45, width: 45 }} />
                                    <View style={{ paddingLeft: 10, justifyContent: 'center', width: windowSet.width * 0.62 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#a9a9ab' }}>{item.userName}</Text>
                                        <View style={{ flexDirection: 'row', paddingTop: 5, }}>
                                            <Text style={{ lineHeight: 19, }}>
                                                <Text style={{ lineHeight: 19 }}>回复 </Text>
                                                <Text style={{ lineHeight: 19, color: '#c2c2c3', fontWeight: '500' }}>{item.replyUserName}</Text>：{item.content}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5 }}>
                                            <Text style={{ lineHeight: 19, color: 'grey', fontSize: 13 }}>{item.publishDate}</Text>
                                            <Text style={{ lineHeight: 19, fontSize: 12 }}> 回复</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', alignSelf: 'flex-start', width: windowSet.width * 0.1 }}>
                                        <View style={{ alignItems: 'center', paddingTop: 2 }}>
                                            <AnimateIcon lottiePath={heartAnimate} iconName="hearto" width={20} height={20} onCancle={() => { }} onPress={() => { }} />
                                            <Text>2</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }} />
                        {/* 加载子评论按钮 */}
                        <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'flex-start', width: windowSet.width, paddingLeft:50,justifyContent: 'flex-start', paddingTop: 10 }}
                            onPress={() => getChildComments(item.id)}
                        >
                            <View style={{ display: !commentLoading ? 'flex' : 'none',flexDirection:'row',alignItems: 'center', }}>
                                <Divider width={windowSet.width * 0.05} my='$0.5' backgroundColor="#f2f2f4" />
                                <Text style={{ paddingLeft: 10, fontSize: 13, fontWeight: 'bold', color: 'grey' }}>展开评论</Text>
                            </View>
                            <View style={{ height: 10, width: windowSet.width - 100, alignItems: 'center', display: commentLoading ? 'flex' : 'none' }}>
                                <LottieView
                                    autoPlay={true}
                                    loop={true}
                                    ref={loadingAnimation}
                                    style={{
                                        width: 50, height: 50,
                                        marginTop: -10, marginLeft: -windowSet.width / 2 + 70
                                    }}
                                    source={require("../lottie/loadComments.json")}
                                />
                            </View>
                        </TouchableOpacity>
                    </View >
                    <Divider width={windowSet.width * 0.7} my='$0.5' marginTop={20} backgroundColor="#f2f2f4" />
                </View >
            );

        }

        return (
            <View style={{ paddingTop: 30 }}>
                <FlatList scrollEnabled={false} renderItem={commentsArea} data={comments} style={{ paddingTop: 10 }} />
            </View>
        );
    }

    useEffect(() => {
        (async () => {
            const { data, status } = await GetHighestComments(blog.id, highestPage.current, 5);
            console.log(data);
            setComments(data.Data);
        })();
    }, []);

    const getChildComments = async (commentId) => {
        setCommentLoading(true);
        const { data, status } = await GetChildrenComments(commentId, 1, 5);
        const tempComments = [...comments];
        const index = tempComments.findIndex(c => c.id == commentId);
        tempComments[index].childrenComment = data.Data;
        setComments(tempComments);
        setCommentLoading(false);
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            {/* Header */}
            <View style={{ height: 55, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Entypo size={20} name="chevron-thin-left" style={{ paddingLeft: 12, paddingRight: 20 }} />
                <Avatar rounded size={30} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 30, width: 30 }} />
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
                    <Avatar rounded size={60} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 60, width: 60 }} />
                    <View style={{ paddingLeft: 5, justifyContent: 'space-between' }}>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <Avatar rounded size={35} source={AvatarImg} containerStyle={{ marginLeft: 10 }} avatarStyle={{ resizeMode: 'stretch', height: 35, width: 35 }} />
                        <View style={{ marginLeft: 20, height: 35, width: windowSet.width * 0.75, backgroundColor: '#f2f2f4', borderRadius: 20, justifyContent: 'center' }}>
                            <Text style={{ color: '#c2c2c3', fontWeight: '500', paddingLeft: 15 }} >说点什么...</Text>
                        </View>
                    </View>
                    <CommentArea />
                </View>
            </ScrollView>
            <View style={{}}>
                <Divider width={windowSet.width * 0.9} alignSelf="center" backgroundColor="#f2f2f4" />
                <View style={{ height: windowSet.height * 0.08, backgroundColor: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* 评论输入框 */}
                    <TouchableOpacity style={styles.bottomReadOnlyInput}>
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
                                <AnimateIcon lottiePath={heartAnimate} iconName="hearto" width={30} height={30} onCancle={() => { }} onPress={() => { }} />
                                <Text style={styles.bottomIconText}>1024</Text>
                            </View>
                            <View style={styles.bottomIconArea}>
                                <AnimateIcon lottiePath={starAnimate} iconName="staro" width={32} height={32} onCancle={() => { }} onPress={() => { }} />
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
