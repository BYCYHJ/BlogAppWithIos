import React, { useState, useRef } from 'react';
import DynamicHeader from '../components/DynamicHeader';
import { SafeAreaView, ScrollView, View, Animated, StyleSheet, Dimensions, Image } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Box, VStack, HStack, Heading, Text, Link } from '@gluestack-ui/themed';
import { SearchBar } from '@rneui/themed';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import DynamicMiniHead from '../components/DynamicMiniHead';
import * as Animatable from 'react-native-animatable';
import SideMenu from '@rexovolt/react-native-side-menu';


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

    return (<FlashList data={exampleBlog} numColumns={2} renderItem={renderItem} estimatedItemSize={4} />);

}


export default function MyInfo() {
    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const searchBarWidth = useRef(new Animated.Value(10)).current;
    const [searchVal, setSearchVal] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);

    const PressSearch = () => {
        setSearchVisible(true);
        Animated.spring(searchBarWidth, {
            toValue: 200,
            speed: 4,
            useNativeDriver: true
        }).start();
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#707381', height: windowSet.height * 0.89 }}>
            <DynamicHeader animateHeaderValue={scrollOffsetY}></DynamicHeader>
            {/* <DynamicMiniHead backgroundColor='white' component={InnerHeader} maxHeight={40} minHeight={40} scrollY={scrollOffsetY} componentProps={null}
            containerStyle={{borderTopLeftRadius: 20, borderTopRightRadius: 20,}} /> */}
            <Box style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 40, width: windowSet.width }}>
                <Text style={{ paddingTop: 10, paddingLeft: 30, alignContent: 'center', alignSelf: 'flex-start', fontWeight: 'bold' }}>我的收藏</Text>
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
            </ScrollView>
        </SafeAreaView>
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
    }
});