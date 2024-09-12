import React, { useState, useRef, useEffect } from 'react';
import DynamicHeader from '../components/DynamicHeader';
import { SafeAreaView, ScrollView, View, Animated, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Box, VStack, HStack, Heading, Text, Link, Button, ButtonText } from '@gluestack-ui/themed';
import { Avatar, SearchBar, Skeleton } from '@rneui/themed';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { GetPersonalBlogs, getUniqueUser, getUniqueUserInfo } from '../services/services';
import DynamicMiniHead from '../components/DynamicMiniHead';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { UserInfo } from '../types/UserInfo';
import LottieView from 'lottie-react-native';

const windowSet = Dimensions.get('window');
const AnimatedSearchBar = Animated.createAnimatedComponent(SearchBar);


function EmptyScreen() {
    const animateRef = useRef(null);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: windowSet.width, height: 400 }}>
            <LottieView
                autoPlay={true}
                loop={true}
                style={{ width: 200, height: 200 }}
                source={require("../lottie/booking.json")}
            />
            <Text style={{ paddingTop: 20, fontWeight: '500' }}>TA暂时没有笔记哦&nbsp;&nbsp; 👀</Text>
        </View>
    );

}


function Blogs({ item }) {
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <Box
            width={windowSet.width * 0.48}
            // maxWidth="$64"
            borderColor="#fffff5"
            borderRadius="$lg"
            borderWidth="$1"
            my="$4"
            overflow="hidden"
            $base-mx="$1"
        >
            <Box>
                <Skeleton style={{ height: 180, width: windowSet.width * 0.48, position: 'absolute', zIndex: 2, direction: 'ltr', display: imageLoading ? 'flex' : 'none' }} />
                <Image
                    onLoad={() => { setImageLoading(false) }}
                    source={item.PreviewStr ? { uri: item.PreviewStr } : require('./logo.png')}
                    resizeMode='stretch'
                    style={{ height: 180, width: windowSet.width * 0.48 }}
                />
            </Box>
            <VStack style={{ width: '100%' }}>
                <Text $dark-color="$textLight200" fontSize="$sm" my="$1.5" width={windowSet.width * 0.45} paddingLeft={5}>
                    {item.TimeString}
                </Text>
                <Heading $dark-color="$textLight200" size="sm" width={windowSet.width * 0.45} alignSelf='center'>
                    {item.Title}
                </Heading>
                <Text my="$1.5" $dark-color="$textLight200" fontSize="$xs" width={windowSet.width * 0.45} alignSelf='center'>
                    {item.Content.length > 50 ? item.Content + "..." : item.Content}
                </Text>
                {/* <Link href="https://gluestack.io/" isExternal> */}
                <Text fontSize="$sm" color="$pink600" alignSelf='center' paddingRight={5}>
                    See it more
                </Text>
                {/* </Link> */}
            </VStack>
        </Box>
    );
}

function MyCollection({ userId }) {
    const [blogs, setBlogs] = useState<Array<BlogInfo>>([]);

    useEffect(() => {
        (async () => {
            //获取该用户的博客
            const blogResponse = await GetPersonalBlogs(userId, 1, 4);
            const blogStatus = blogResponse.status;
            if (blogStatus > 299) { return; }
            setBlogs(blogResponse.data.Data);
        })();
    }, []);

    return (
        <View>
            {
                blogs.length == 0 ?
                    <EmptyScreen /> :
                    <View>
                        <FlatList data={blogs} numColumns={2} renderItem={object => <Blogs item={object.item} />} scrollEnabled={false} />
                        <Text style={{ alignSelf: 'center', color: '#c4c5cb', fontWeight: 'bold' }}>已经到底啦~</Text>
                        <View style={{ height: 120 }} />
                    </View>
            }
        </View>
    );

}

export default function OtherInfo({ navigation, route }) {
    const userId = route.params.userId;
    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const searchBarWidth = useRef(new Animated.Value(10)).current;
    const [searchVal, setSearchVal] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);
    //const [userInfo, setUserInfo] = useState(getUniqueUserInfo());
    const AvatarImg = require("../screens/logo.png");
    const [colors, setColors] = useState(null);
    const backgroundImg = require('../sources/Bg1.jpg');
    const [loading, setLoading] = useState(false);
    const yunaUrl = 'http://132.232.108.176/test.png';
    const [targetUserInfo, setTargetUserInfo] = useState<UserInfo>({ userId: route.params.userId, userName: route.params.userName, avatarUrl: route.params.avatarUrl });


    useEffect(() => {
        (async () => {
            //获取用户信息
            const { data, status } = await getUniqueUser(userId);
            if (status > 299) { return; }
            setTargetUserInfo({
                userId: data.Data.id,
                userName: data.Data.userName,
                avatarUrl: data.Data.avatarUrl
            });
            console.log(data.Data);
        })();
    }, [userId]);



    const PressSearch = () => {
        setSearchVisible(true);
        Animated.spring(searchBarWidth, {
            toValue: 200,
            speed: 4,
            useNativeDriver: true
        }).start();
    }

    //Header部分
    const InfoHeader = () => {

        return (
            <ImageBackground source={backgroundImg} style={{ height: 420 }}>
                <LinearGradient colors={loading ? ["grey", "white"] : ['rgba(22,22,22,0.9)', 'rgba(111,111,111,0.2)']} style={{ height: 420 }} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }} >
                    <View style={{ height: 60 }} />
                    {/* 返回按钮 */}
                    <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Ionicons name='chevron-back-outline' color={'white'} size={25} style={{ paddingLeft: 15 }} />
                        <Feather name='more-horizontal' color={"white"} size={25} style={{ paddingRight: 20 }} />
                    </View>
                    {/* 头像及用户信息 */}
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ flex: 1 }} />
                        <View style={{ flex: 5,justifyContent:'center' }}>
                            <Avatar rounded size={80} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 80, width: 80 }} />
                        </View>
                        <View style={{ paddingLeft: 20, flex: 16,justifyContent:'center' }}>
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 25 }}>
                                {targetUserInfo.userName ? targetUserInfo.userName : ""}
                            </Text>
                            <Text style={{ color: '#c4c5cb', paddingTop: 10, fontSize: 12,width:280 }}>
                                用户id: {userId} <Ionicons name="qr-code" size={10} />
                            </Text>
                        </View>
                    </View>
                    {/* 关注、粉丝、获赞及关注按钮、聊天按钮 */}
                    <View style={{ paddingTop: 25, paddingLeft: 25 }}>
                        <Text style={{ color: 'white', width: windowSet.width * 0.84, maxHeight: 80, height: 80 }}>For the sake of that distant place, you have to work hard.</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.countText}>0</Text>
                                    <Text style={styles.countText}>关注</Text>
                                </View>
                                <View style={{ paddingLeft: 20, alignItems: 'center' }}>
                                    <Text style={styles.countText}>0</Text>
                                    <Text style={styles.countText}>粉丝</Text>
                                </View>
                                <View style={{ paddingLeft: 20, alignItems: 'center' }}>
                                    <Text style={styles.countText}>0</Text>
                                    <Text style={styles.countText}>获赞与收藏</Text>
                                </View>
                            </View>
                            <View style={{ width: windowSet.width * 0.45, alignSelf: 'center', flexDirection: 'row' }}>
                                <Button height={28} backgroundColor='#fe2645' borderRadius={120} width={100}>
                                    <ButtonText fontWeight='400' fontSize={15}>关注</ButtonText>
                                </Button>
                                <TouchableOpacity
                                    style={{ marginLeft: 10, width: 40, height: 28, alignItems: 'center', borderRadius: 15, borderWidth: 1, justifyContent: 'center', borderColor: '#cacbc8', backgroundColor: 'rgba(204,205,202,0.2)' }}
                                >
                                    <Ionicons name='chatbubble-ellipses-outline' size={18} color={'white'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground >
        );
    }

    return (
        <View style={{ backgroundColor: "grey", height: windowSet.height }}>
            <DynamicMiniHead backgroundColor='transparent' component={InfoHeader} maxHeight={400} minHeight={95} scrollY={scrollOffsetY} componentProps={null}
                containerStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, }} />
            <Box style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 40, width: windowSet.width }}>
                <Text style={{ paddingTop: 10, paddingLeft: 30, alignContent: 'center', alignSelf: 'flex-start', fontWeight: 'bold' }}>TA的笔记</Text>
                <AntdIcon size={17} name='search1' style={{ alignSelf: 'center', paddingTop: 5, display: searchVisible ? 'none' : 'flex', marginLeft: -20, paddingLeft: 270 }}
                    onPress={PressSearch}
                />
            </Box>
            <ScrollView
                style={{ backgroundColor: 'white' }}
                scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], { useNativeDriver: false })}>
                <MyCollection userId={userId} />
            </ScrollView>
        </View>
    );
}

type BlogInfo = {
    Title: string,//博客标题
    Content: string,//文章内容
    Tags: string, //文章标签
    UserId: string,//作者
    PreviewStr: string //博客预览图
    TimeString: string//创建时间格式为EnglishDate,如:August 18,2024
}



const exampleBlog = [{
    title: "深入了解React Native FlatList",
    content: "在data 道具中,你将输入你想显示的数组。这可以是来自API的JSON数据,keyExtractor 道具将为数组中的每个项目检索一个唯一的键注意,如果你的数组包含一个key 或id 字段,你不需要包括这个道具。默认情况下,FlatList 将寻找key 或id 属性"
        + "renderItem 将告诉React Native如何渲染列表中的项目。",
    tags: ['All', 'React'],
    stars: 2
},
{
    title: "深入了解React Native FlatList222222222222222",
    content: "在data 道具中,你将输入你想显示的数组。这可以是来自API的JSON数据,如果你的数组包含一个key 或id 字段,你不需要包括这个道具。默认情况下,FlatList 将寻找key 或id 属性"
        + "renderItem 将告诉React Native如何渲染列表中的项目。",
    tags: ['All', 'React', '.Net'],
    stars: 0
},
{
    title: "深入了解React Native FlatList",
    content: "在data 道具中,你将输入你想显示的数组。这可以是来自API的JSON数据,keyExtractor 道具将为数组中的每个项目检索一个唯一的键注意,如果你的数组包含一个key 或id 字段,你不需要包括这个道具。默认情况下,FlatList 将寻找key 或id 属性"
        + "renderItem 将告诉React Native如何渲染列表中的项目。",
    tags: ['All', 'React'],
    stars: 2
},
{
    title: "深入了解React Native FlatList2",
    content: "在data 道具中,你将输入你想显示的数组。这可以是来自API的JSON数据,如果你的数组包含一个key 或id 字段,你不需要包括这个道具。默认情况下,FlatList 将寻找key 或id 属性"
        + "renderItem 将告诉React Native如何渲染列表中的项目。",
    tags: ['All', 'React', '.Net'],
    stars: 0
}
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        margin: 0
    },
    scrollText: {
        fontSize: 19,
        textAlign: 'center',
        padding: 20,
        color: '#000'
    },
    headerText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    countText: {
        color: 'white',
        fontSize: 13
    }
});