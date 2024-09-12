import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions, View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Avatar, ListItem, Card } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollTabView } from 'react-native-scroll-head-tab-view';
import { SearchBar } from '@rneui/themed';
import { GetRecommendBlogs, GetUniqueBlog } from '../services/services';
import { Image, Skeleton } from '@rneui/base';
import { AddIcon, Box, Fab, FabIcon, FabLabel, Spinner, Input, InputField } from '@gluestack-ui/themed';
import { Path, Svg } from 'react-native-svg';
import { EasyLoading, Loading } from '../components/Loading';
import Feather from 'react-native-vector-icons/Feather';
import SkeletonImage from 'react-native-skeleton-image';



const windowSet = Dimensions.get('window');

function TabView1(props) {
    const page = useRef(1);//当前数据的展示页数
    const [blogs, setBlogs] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const waitingCount = [1, 2, 3, 4];
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // 刷新状态

    useEffect(() => {
        (async () => {
            await getBlogs();
        })();
    }, []);

    //到达底部时逻辑
    const reachEnd = async () => {
        //如果条数本来就小于4条，不需要加载
        if (!isLoadMore) { return; }
        setIsLoading(true);
        try {
            const response = await GetRecommendBlogs(page.current, 4);
            const { data, status } = { data: response.data, status: response.status };
            console.log(data);
            if (status < 299) {
                if (data.StatusCode >= 299) {
                    setIsLoading(false);
                    return;
                }
                const blog = data.Data;
                setBlogs([...blogs, ...blog]);
                page.current = ++page.current;
                if (data.Data.length < 4) {
                    setIsLoadMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    //请求博客列表
    const getBlogs = async () => {
        setIsLoading(false);
        try {
            const response = await GetRecommendBlogs(1, 4);
            const { data, status } = { data: response.data, status: response.status };
            if (status < 299) {
                if (data.StatusCode >= 299) {
                    setBlogs(undefined);
                } else {
                    const blog = data.Data;
                    setBlogs([...blog]);
                    //是否有下一页
                    if (data.Data.length < 4) {
                        setIsLoadMore(false);
                    } else {
                        page.current = ++page.current;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isNearTop = contentOffset.y <= 10; // 10是阈值，可以根据需要调整
        const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10; // 10是阈值，可以根据需要调整
        //上拉操作
        if (isNearTop && refreshing === false) {
            //   getBlogs();
        }
        //下拉加载操作
        if (isNearBottom && isLoadMore === true && isloading === false) {
            reachEnd();
        }
    };


    //博客列表画面
    const renderItem = ({ item }) => {
        //点击博客
        const pressBlog = async () => {
            EasyLoading.show();
            try {
                const { data, status } = await GetUniqueBlog(item.Id);
                console.log({
                    blogId: item.Id,
                    blogTitle: item.Title,
                    blogContent: data.Data.Content.replaceAll("preview_", ""),
                    userId: item.UserId,
                    userName: item.UserName,
                    avatarUrl: item.AvatarUrl
                });
                props.navigation.navigate("Blog", {
                    blogId: item.Id,
                    blogTitle: item.Title,
                    blogContent: data.Data.Content.replaceAll("preview_", ""),
                    userId: item.UserId,
                    userName: item.UserName,
                    avatarUrl: item.AvatarUrl
                });

            } catch (error) {
                console.log(error);
            }
            EasyLoading.dismiss();
        }
        return (
            <TouchableOpacity activeOpacity={1} onPress={pressBlog} style={{ height: windowSet.height * 0.22 }}>
                <View style={{ height: 10 }} />
                <ListItem containerStyle={{ borderRadius: 20, width: windowSet.width * 0.98, backgroundColor: 'white', display: 'flex', alignSelf: 'center', height: windowSet.height * 0.2 }} >
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar size={20} rounded source={{ uri: item.AvatarUrl }} containerStyle={{ backgroundColor: '#b999e3' }} />
                            <Text style={{ paddingLeft: 5, fontWeight: 'bold', color: 'grey' }}>{item.UserName}</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', width: windowSet.width * 0.75 }}>
                                <FlatList horizontal={true} data={item.Tags} style={{ height: 15, flexDirection: 'row-reverse' }}
                                    renderItem={({ item }) => {
                                        const color = item == 1 ? '#66a1ff' : (item == 2 ? '#ff5819' : '#8566ff');
                                        return (
                                            <View style={{ display: 'flex', flexDirection: 'row', height: 15 }}>
                                                <View style={{ backgroundColor: color, borderRadius: 3, width: 35, alignItems: 'center' }}>
                                                    <ListItem.Title style={{ color: 'white', fontSize: 10, fontWeight: 'bold', lineHeight: 15 }}>
                                                        {item == 1 ? "All" : (item == 2 ? ".Net" : "JS")}
                                                    </ListItem.Title>
                                                </View>
                                                <View style={{ paddingLeft: 5 }} />
                                            </View>
                                        );
                                    }} />
                            </View>
                        </View>
                        <View style={{ height: 8 }} />
                        <ListItem.Content>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                {/* 标题、内容、点赞数 */}
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                    <ListItem.Title>
                                        <Card.Title>{item.Title}</Card.Title>
                                    </ListItem.Title>
                                    <Text style={{ width: item.PreviewPhoto ? windowSet.width * 0.62 : windowSet.width * 0.9, paddingTop: 10 }}>
                                        {item.Content.length > 50 ? item.Content.slice(0, 60) + '...' : item.Content}
                                    </Text>
                                    <View style={{ height: 5 }} />
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                        <AntDesign name='staro' color={'grey'}></AntDesign>
                                        <Text style={styles.bottomActionText}>10</Text>
                                        <Text style={{ paddingLeft: 15, color: '#e6e6e6', marginTop: -2 }}>|</Text>
                                        <AntDesign name='like2' style={[styles.bottomActionIcon, { paddingLeft: 15 }]} />
                                        <Text style={styles.bottomActionText}>6</Text>
                                        <Text style={{ paddingLeft: 15, color: '#e6e6e6', marginTop: -2 }}>|</Text>
                                        <AntDesign name='message1' style={[styles.bottomActionIcon, { paddingLeft: 15 }]} />
                                        <Text style={styles.bottomActionText}>6</Text>
                                    </View>
                                </View>
                                {/* 预览图 */}
                                {
                                    item.PreviewPhoto && item.PreviewPhoto != "" ?
                                        <Image
                                            resizeMode='stretch'
                                            source={{ uri: item.PreviewPhoto }}
                                            style={{ width: windowSet.width * 0.28, height: windowSet.width * 0.28, borderRadius: 20, marginLeft: 5 }}
                                        />
                                        :
                                        <View />
                                }
                            </View>
                        </ListItem.Content>
                    </View>
                </ListItem>
            </TouchableOpacity>
        );
    };

    //请求数据时的展示画面
    const renderWaiting = () => {
        return (
            <View style={{ backgroundColor: 'white', width: windowSet.width * 0.98, height: windowSet.height * 0.147, borderRadius: 20, marginBottom: 5, marginTop: 5, alignSelf: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10, paddingLeft: windowSet.width * 0.05 - 5 }}>
                    <Skeleton circle animation='pulse' style={{ height: 35, width: 35 }} />
                    <Skeleton animation='pulse' style={{ height: 35, width: windowSet.width * 0.9 - 40, marginLeft: 5, borderRadius: 10 }} />
                </View>
                <Skeleton animation='pulse' style={{ borderRadius: 10, height: windowSet.height * 0.04, width: windowSet.width * 0.9, marginTop: 5, alignSelf: 'center' }} />
                <Skeleton animation='pulse' style={{ borderRadius: 10, height: windowSet.height * 0.04, width: windowSet.width * 0.9, marginTop: 2.5, alignSelf: 'center' }} />
            </View>
        );
    }

    //无数据的展示画面
    const Nodata = () => {
        return (
            <View style={{ height: windowSet.height * 0.6, alignItems: 'center', justifyContent: 'center' }}>
                <Svg viewBox="0 0 1706 1024" width="150" height="150">
                    <Path d="M899.4816 78.165333l32.034133 44.885334 81.544534 114.210133h9.216l56.6272-111.069867 22.784-44.680533 22.784 44.680533 56.6272 111.069867H1427.797333l4.437334 19.5584c34.645333 152.917333-6.6048 265.250133-123.050667 330.615467l-1.809067 0.989866 0.068267 0.512 10.018133 80.9984 0.5632 4.522667 11.093334 89.634133 0.699733 5.802667 0.3584 2.8672 0.7168 5.7344 0.699733 5.717333 0.7168 5.768534 23.927467 193.536-50.5856 6.024533-24.234667-196.027733-0.750933-6.144-0.7168-5.7344-0.699733-5.7344-11.793067-95.4368-7.5776-61.2352-0.631467-5.051734-3.549866-28.791466-0.341334-2.816-0.648533-5.12-2.1504-17.476267 16.042667-7.867733c101.888-49.937067 141.124267-135.202133 118.459733-261.973334l-0.546133-2.901333h-236.885334l-7.031466-13.824-40.9088-80.213333-40.891734 80.213333-7.048533 13.824h-67.208533l-7.611734-10.666667-57.122133-80.0256-113.8176 446.395734-2.850133-0.699734 41.659733 353.928534-50.602667 5.717333-70.775466-601.2928-90.6752 80.0256-7.253334 6.417067H262.229333l57.173334 72.072533 5.973333 7.509333-0.648533 9.489067-12.7488 187.306667-50.824534-3.310934 12.0832-177.834666-83.2-104.874667-31.965866-40.311467H607.914667l120.098133-105.984 36.693333-32.375466 5.649067 48.0768 19.1488 162.645333 96.426667-378.129067 13.533866-53.128533zM452.1472 586.922667c21.0944 0 38.1952 16.776533 38.1952 37.461333 0 20.701867-17.1008 37.461333-38.1952 37.461333-21.111467 0-38.229333-16.759467-38.229333-37.461333 0-20.6848 17.117867-37.461333 38.229333-37.461333z m152.832 0c21.0944 0 38.212267 16.776533 38.212267 37.461333 0 20.701867-17.117867 37.461333-38.229334 37.461333-21.0944 0-38.1952-16.759467-38.1952-37.461333 0-20.6848 17.1008-37.461333 38.212267-37.461333z m394.820267-237.2608c21.111467 0 38.212267 16.776533 38.212266 37.461333 0 20.6848-17.1008 37.461333-38.212266 37.461333-21.0944 0-38.212267-16.776533-38.212267-37.461333 0-20.6848 17.117867-37.461333 38.229333-37.461333z m152.832 0c21.111467 0 38.229333 16.776533 38.229333 37.461333 0 20.6848-17.117867 37.461333-38.229333 37.461333-21.0944 0-38.1952-16.776533-38.1952-37.461333 0-20.6848 17.1008-37.461333 38.1952-37.461333z" p-id="9107" fill="#8a8a8a"></Path>
                    <Path d="M624.0768 0c17.578667 0 31.8464 14.250667 31.8464 31.8464V93.013333a31.8464 31.8464 0 1 1-63.6928 0V31.8464c0-17.578667 14.267733-31.8464 31.8464-31.8464z m0 199.799467c17.578667 0 31.8464 14.267733 31.8464 31.8464v61.201066a31.8464 31.8464 0 1 1-63.6928 0v-61.201066c0-17.578667 14.267733-31.8464 31.8464-31.8464z m-38.212267-37.461334a31.232 31.232 0 0 1-31.214933 31.232h-64.9216a31.232 31.232 0 0 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.214933 31.232h-64.9216a31.232 31.232 0 0 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m751.445334 337.169067c17.578667 0 31.8464 14.267733 31.8464 31.8464v61.201067a31.8464 31.8464 0 1 1-63.675734 0v-61.201067c0-17.578667 14.250667-31.8464 31.8464-31.8464z m0 199.816533c17.578667 0 31.8464 14.250667 31.8464 31.829334v61.201066a31.8464 31.8464 0 1 1-63.675734 0v-61.201066c0-17.578667 14.250667-31.829333 31.8464-31.829334zM1502.890667 661.845333a31.232 31.232 0 0 1-31.232 31.232h-64.9216a31.232 31.232 0 1 1 0-62.446933h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.232 31.232h-64.904534a31.232 31.232 0 1 1 0-62.446933h64.9216c17.237333 0 31.214933 13.994667 31.214934 31.232zM165.563733 699.323733c17.578667 0 31.8464 14.250667 31.8464 31.829334v61.201066a31.8464 31.8464 0 0 1-63.675733 0v-61.201066c0-17.578667 14.250667-31.829333 31.829333-31.829334z m0 199.799467c17.578667 0 31.8464 14.250667 31.8464 31.8464v61.184a31.8464 31.8464 0 0 1-63.675733 0V930.986667c0-17.578667 14.250667-31.8464 31.829333-31.8464z m-38.1952-37.461333a31.232 31.232 0 0 1-31.232 31.232H31.232a31.232 31.232 0 1 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.232 31.232H235.008a31.232 31.232 0 1 1 0-62.464h64.9216c17.237333 0 31.214933 13.994667 31.214933 31.232z" p-id="9108" fill="#8a8a8a"></Path>
                </Svg>
                <Text style={{ fontWeight: 'bold', color: '#b0b1b7', fontSize: 18 }}>啊哦，没有数据哦~</Text>
                <View style={{ height: 5 }} />
                <Button title='重新加载' onPress={getBlogs} />
            </View>
        );
    }

    return (
        <View style={{ height: windowSet.height * 0.76 }}>
            <ScrollView onScroll={onScroll}>
                {blogs ? (
                    blogs?.length ?
                        <FlatList scrollEnabled={false} data={blogs} renderItem={renderItem} />
                        : <FlatList scrollEnabled={false} data={waitingCount} renderItem={renderWaiting} />
                )
                    : <Nodata />
                }
                <Spinner style={{ display: isloading ? 'flex' : 'none' }} color="grey" />
                <Loading style={{ backgroundColor: 'transparent' }} />
            </ScrollView>
        </View>
    );
}

function TabView2(props) {
    return <Text>aaa</Text>
}

export default function BlogList({ navigation }) {

    const [headerHeight, setHeaderHeight] = useState(200);
    const headerOnLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    }, []);
    const [searchVal, setSearchVal] = useState("");
    const windowSet = Dimensions.get('window');


    return (
        <View style={{ height: windowSet.height, width: windowSet.width, backgroundColor: '#eff0f1', alignItems: 'center' }}>
            <View style={{ height: 50 }} />
            <Input style={{ backgroundColor: 'white', width: windowSet.width * 0.95, height: 30, borderWidth: 0, borderRadius: 10 }} >
                <Feather name='search' size={20} color={'grey'} style={{ alignSelf: 'center', paddingLeft: 5 }} />
                <InputField />
            </Input>

            <Box>
                <ScrollTabView
                    headerHeight={30}
                    tabBarPosition='top'
                    tabBarTextStyle={{ fontWeight: 'bold' }}
                >
                    <TabView1 tabLabel="推荐" navigation={navigation} />
                    <TabView2 tabLabel="关注" />
                </ScrollTabView>
                <Fab bg="$pink600" size="lg" right="$4" bottom="$20"
                    style={{ marginBottom: windowSet.height * 0.18, backgroundColor: '#ff0000' }}
                    isPressed={false}
                    onPress={() => navigation.navigate("BlogEditor")}
                >
                    <FabIcon as={AddIcon} h="$4" w="$4" />
                </Fab>
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomActionIcon: {
        color: 'grey'
    },
    bottomActionText: {
        color: 'grey',
        paddingLeft: 8
    }
});
