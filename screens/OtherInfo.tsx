import React, { useState, useRef, useEffect } from 'react';
import DynamicHeader from '../components/DynamicHeader';
import { SafeAreaView, ScrollView, View, Animated, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Box, VStack, HStack, Heading, Text, Link, Button, ButtonText } from '@gluestack-ui/themed';
import { Avatar, SearchBar } from '@rneui/themed';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { getUniqueUserInfo } from '../services/services';
import DynamicMiniHead from '../components/DynamicMiniHead';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const windowSet = Dimensions.get('window');
const AnimatedSearchBar = Animated.createAnimatedComponent(SearchBar);

function MyCollection(props) {

    const renderItem = ({ item }) => {
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
                    <Image
                        source={require('./logo.png')}
                        resizeMode='stretch'
                        style={{ height: 180, width: windowSet.width * 0.48 }}
                    />
                </Box>
                <VStack style={{ width: '100%' }}>
                    <Text $dark-color="$textLight200" fontSize="$sm" my="$1.5" width={windowSet.width * 0.45} paddingLeft={5}>
                        August 16, 2023
                    </Text>
                    <Heading $dark-color="$textLight200" size="sm" width={windowSet.width * 0.45} alignSelf='center'>
                        {item.title}
                    </Heading>
                    <Text my="$1.5" $dark-color="$textLight200" fontSize="$xs" width={windowSet.width * 0.45} alignSelf='center'>
                        {item.content.length > 50 ? item.content.slice(0, 49) + "..." : item.content}
                    </Text>
                    <Link href="https://gluestack.io/" isExternal>
                        <Text fontSize="$sm" color="$pink600" alignSelf='center' paddingRight={5}>
                            Find out more
                        </Text>
                    </Link>
                </VStack>
            </Box>
        );
    };

    return (<FlatList data={exampleBlog} numColumns={2} renderItem={renderItem} scrollEnabled={false} />);

}

export default function OtherInfo({ showMenu, pressAvatar, closeAvatar }) {
    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const searchBarWidth = useRef(new Animated.Value(10)).current;
    const [searchVal, setSearchVal] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);
    //const [userInfo, setUserInfo] = useState(getUniqueUserInfo());
    const AvatarImg = require("../screens/logo.png");
    const [colors, setColors] = useState(null)

    // getColors(AvatarImg, {
    //     fallback: '#228B22',
    //     cache: true,
    //     key: AvatarImg,
    // }).then(setColors({
    //     colorOne: { value: result.background, name: 'background' },
    //     colorTwo: { value: result.detail, name: 'detail' },
    //     colorThree: { value: result.primary, name: 'primary' },
    //     colorFour: { value: result.secondary, name: 'secondary' },
    //     rawResult: JSON.stringify(result),
    //   }));

    useEffect(() => {
        console.log(colors);
    }, [colors]);



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
            // <View style={{ height: 350,backgroundColor:'transparent'}}>
            /* <LinearGradient colors={['#424a73', '#64677d', '#707381']} style={{ height: 350 }} > */
            < ImageBackground source={require('../sources/Bg1.jpg')} style={{ height: 360}} blurRadius={10} >
                <View style={{ height: 60 }} />
                {/* 返回按钮 */}
                <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Ionicons name='chevron-back-outline' color={'white'} size={25} style={{ paddingLeft: 15 }} />
                    <Feather name='more-horizontal' color={"white"} size={25} style={{ paddingRight: 20 }} />
                </View>
                {/* 头像及用户信息 */}
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ width: 20 }} />
                    <Avatar rounded size={80} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 80, width: 80 }} onPress={pressAvatar} />
                    <View style={{ paddingLeft: 20, paddingTop: 25 }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 25 }}>AnAn</Text>
                        <Text style={{ color: '#c4c5cb', paddingTop: 10, fontSize: 12, width: 200 }}>用户id: 0001-0001-0001-0001 🪧</Text>
                    </View>
                </View>
                {/* 关注、粉丝、获赞及关注按钮、聊天按钮 */}
                <View style={{ paddingTop: 10, paddingLeft: 25 }}>
                    <Text style={{ color: 'white', width: windowSet.width * 0.84, maxHeight: 80, height: windowSet.height * 0.08 }}>For the sake of that distant place, you have to work hard.</Text>
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
                                style={{ marginLeft: 10, width: 40, height: 28, alignItems: 'center', borderRadius: 15, borderWidth: 1, justifyContent: 'center', borderColor: '#cacbc8' }}
                            >
                                <Ionicons name='chatbubble-ellipses-outline' size={18} color={'white'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground >
        );
    }

    return (
        // <ImageBackground source={require('../sources/Bg1.jpg')} style={{width:windowSet.width,height:windowSet.height}} >
        <View style={{ backgroundColor: '#707381', height: windowSet.height }}>
            {/* <DynamicHeader animateHeaderValue={scrollOffsetY} pressAvatar={pressAvatar} openMenu={showMenu}></DynamicHeader> */}
            <DynamicMiniHead backgroundColor='transparent' component={InfoHeader} maxHeight={350} minHeight={95} scrollY={scrollOffsetY} componentProps={null}
                containerStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, }} />
            <Box style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 40, width: windowSet.width }}>
                <Text style={{ paddingTop: 10, paddingLeft: 30, alignContent: 'center', alignSelf: 'flex-start', fontWeight: 'bold' }}>TA的笔记</Text>
                <Animatable.View style={{ alignSelf: 'center' }} animation={searchVisible ? 'flipInY' : ''} duration={500} >
                    <AnimatedSearchBar platform='ios' value={searchVal} onChangeText={(val) => { setSearchVal(val) }}
                        containerStyle={{ height: 25, alignSelf: 'center', width: windowSet.width * 0.7, display: searchVisible ? 'flex' : 'none' }}
                        inputContainerStyle={{ height: 25, width: windowSet.width * 0.68, backgroundColor: '#f0f0f2', borderRadius: 15 }}
                        onCancel={() => { setSearchVisible(false) }}
                        round={true}
                    />
                </Animatable.View>
                <AntdIcon size={17} name='search1' style={{ alignSelf: 'center', paddingTop: 5, display: searchVisible ? 'none' : 'flex', marginLeft: -20, paddingLeft: 270 }}
                    onPress={PressSearch}
                />
            </Box>
            <ScrollView
                style={{ backgroundColor: 'white' }}
                scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], { useNativeDriver: false })}>
                <MyCollection />
                <Text style={{ alignSelf: 'center', color: '#c4c5cb', fontWeight: 'bold' }}>已经到底啦~</Text>
                <View style={{ height: 120 }} />
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