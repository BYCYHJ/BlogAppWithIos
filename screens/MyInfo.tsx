import React, { useState, useRef, useEffect } from 'react';
import DynamicHeader from '../components/DynamicHeader';
import { SafeAreaView, ScrollView, View, Animated, StyleSheet, Dimensions, Image } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Box, VStack, HStack, Heading, Text, Link, Button, ButtonText } from '@gluestack-ui/themed';
import { SearchBar } from '@rneui/themed';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { GetPersonalBlogs, getUniqueUserInfo } from '../services/services';
import SkeletonImage from 'react-native-skeleton-image';
import { Skeleton } from '@rneui/base';
import LottieView from 'lottie-react-native';
import Svg, { Path } from 'react-native-svg';

const windowSet = Dimensions.get('window');
const AnimatedSearchBar = Animated.createAnimatedComponent(SearchBar);

function BlogItem({ item }) {
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
                    source={item.PreviewStr ? {uri:item.PreviewStr} : require('./logo.png')}
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
            <Text style={{ paddingTop: 20, fontWeight: '500' }}>分享你的收获&nbsp;&nbsp; 👀</Text>
            <Button style={{ backgroundColor: 'transparent', borderWidth: 1, borderRadius: 15, marginTop: 20, borderColor: '#dbdbdb' }}>
                <ButtonText style={{ color: '#515151' }}>去发布</ButtonText>
            </Button>
        </View>
    );

}

function MyCollection({ blogs }) {

    return (
        <View>
            {
                blogs.length < 1 ?
                    <EmptyScreen /> :
                    <View>
                        <FlashList data={blogs} numColumns={2} renderItem={object => <BlogItem item={object.item} />} estimatedItemSize={200} />
                        <Text style={{ alignSelf: 'center', color: '#c4c5cb', fontWeight: 'bold', marginBottom: 20 }}>已经到底啦~</Text>
                    </View>
            }
        </View>
    );
}

export default function MyInfo({ showMenu, pressAvatar, closeAvatar }) {
    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const searchBarWidth = useRef(new Animated.Value(10)).current;
    const [searchVal, setSearchVal] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);
    const [userInfo, setUserInfo] = useState(getUniqueUserInfo());
    const [blogs, setBlogs] = useState<Array<BlogInfo | undefined>>([]);

    //获取个人所有博客
    useEffect(() => {
        (async () => {
            const { data, status } = await GetPersonalBlogs(userInfo.userId, 1, 5);
            if (status < 299) {
                console.log(data.Data);
                setBlogs(data.Data);
            }
        })();
    }, []);

    const PressSearch = () => {
        setSearchVisible(true);
        Animated.spring(searchBarWidth, {
            toValue: 200,
            speed: 4,
            useNativeDriver: true
        }).start();
    }

    return (
        <View style={{ backgroundColor: '#707381', height: windowSet.height * 0.9 }}>
            <DynamicHeader animateHeaderValue={scrollOffsetY} pressAvatar={pressAvatar} openMenu={showMenu} />
            <Box style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 40, width: windowSet.width }}>
                <Text style={{ paddingTop: 10, paddingLeft: 30, alignContent: 'center', alignSelf: 'flex-start', fontWeight: 'bold' }}>我的笔记</Text>
                <AntdIcon size={17} name='search1' style={{ alignSelf: 'center', paddingTop: 5, display: searchVisible ? 'none' : 'flex', marginLeft: -20, paddingLeft: 270 }}
                    onPress={PressSearch}
                />
            </Box>
            <ScrollView
                style={{ backgroundColor: 'white' }}
                scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], { useNativeDriver: false })}>
                <MyCollection blogs={blogs} />
            </ScrollView>
        </View>
    );
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

type BlogInfo = {
    Title: string,//博客标题
    Content: string,//文章内容
    Tags: string, //文章标签
    UserId: string,//作者
    //HeartCount: number,//点赞数
    //StartCount: number,//收藏数
    PreviewStr: string //博客预览图
    TimeString: string//创建时间格式为EnglishDate,如:August 18,2024
}

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