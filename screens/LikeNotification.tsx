import { Badge, BadgeIcon } from "@gluestack-ui/themed";
import { Avatar, Divider, Image } from "@rneui/base";
import React, { useEffect, useRef, useState } from "react";
import { Button, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { Dimensions, SafeAreaView, StyleSheet, View, Text } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Svg, { Path } from "react-native-svg";
import { GetAllPersonalNotification } from "../services/services";
import LottieView from "lottie-react-native";
import { EasyLoading, Loading } from "../components/Loading";

const windowSet = Dimensions.get('window');
const AvatarImg = require("../screens/logo.png");

export default function LikeNotification({navigation}) {
    const loadingAnimation = useRef(null);//加载记录时的动画
    const [records, setRecords] = useState<Array<LikeRecord>>([]);
    const index = useRef<number>(1);
    const pageSize = 5;
    const [loading,setLoading] = useState<boolean>(false);

    const exampleData = [{
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    },
    {
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    }
        ,
    {
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    }
        ,
    {
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    }
        ,
    {
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    }
        ,
    {
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    }
        ,
    {
        SubscriberName: 'BaiBai',
        AvatarUrl: AvatarImg,
        PreviewUrl: 'http://132.232.108.176/2fd48399-06c2-4271-813d-254e4620c6a3.png',
        Content: "真不戳呀",
        BlogId: 'ce990000-9030-d493-2cbf-08dc5bbe941c',
        HaveRead: false
    }];

    const exampleEmpty = [];

    //获取初始记录
    const getInitialRecord = async () => {
        setLoading(true);
        EasyLoading.show();
        const { data, status } = await GetAllPersonalNotification(index.current, pageSize);
        console.log(data);
        if (status > 299) return;//请求未成功直接返回
        if (data.StatusCode > 299) return;
        setRecords([...data.Data]);
        EasyLoading.dismiss();
        setLoading(false);
    }

    //页面加载初始化被点赞记录
    useEffect(() => {
        (async () => {
            await getInitialRecord();
        })()
    }, []);

    //列表渲染
    const RecordRender = ({ item }) => {
        //点击头像跳转
        const pressAvatar = () =>{
            navigation.navigate("OtherInfo");
        }

        return (
            <View style={{ alignItems: 'center', paddingTop: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={pressAvatar} style={{ flex: 2, alignItems: 'center', height: '100%', paddingTop: 5 }}>
                        <View>
                            <Avatar rounded source={AvatarImg} size={60} avatarStyle={{ width: 60, height: 60, resizeMode: 'stretch' }} />
                            <View style={{ width: 25, height: 25, backgroundColor: 'white', borderRadius: 25, position: 'absolute', marginTop: 35, marginLeft: 35, justifyContent: 'center' }}>
                                <Badge size="lg" style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
                                    <View style={{ width: 22, height: 22, backgroundColor: '#fd6d62', alignItems: 'center', justifyContent: 'center', borderRadius: 11 }}>
                                        <BadgeIcon as={
                                            () => <AntDesign name="heart" size={15} style={{ backgroundColor: '#fd6d62', width: 15, height: 15, color: 'white' }} />
                                        } />
                                    </View>
                                </Badge>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', flex: 5, paddingLeft: 10 }}>
                        <View style={styles.textArea}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.SubscriberName}</Text>
                            <Text style={{ marginLeft: 10, backgroundColor: '#f2f3f4', fontWeight: '400', fontSize: 12, color: 'grey', borderRadius: 5 }}> 关注 </Text>
                        </View>
                        <View style={[styles.textArea, { paddingTop: 8 }]}>
                            <Text style={styles.text}>赞了你的评论</Text>
                            <Text style={[styles.text, { paddingLeft: 10 }]}>{item.CreateOnTime}</Text>
                        </View>
                        <View style={[styles.textArea, { paddingTop: 8 }]}>
                            <View style={{ height: 20, backgroundColor: '#e9ebec', width: 5, borderRadius: 2 }}></View>
                            <Text style={[styles.text, { paddingLeft: 10 }]}>{item.Content}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 3, alignItems: 'center' }}>
                        <Image borderRadius={8} source={{ uri: item.PreviewUrl }} containerStyle={{ height: 80, width: 80 }} />
                    </View>
                </View>
                <Divider width={0.5} color="rgba(9,34,68,0.1)" style={{ width: windowSet.width * 0.8, paddingBottom: 15 }} />
            </View>
        );
    }

    //空数据页面
    const EmptyData = () => {
        return (
            <View style={{ height: windowSet.height * 0.6, alignItems: 'center', justifyContent: 'center' }}>
                <Svg viewBox="0 0 1706 1024" width="150" height="150">
                    <Path d="M899.4816 78.165333l32.034133 44.885334 81.544534 114.210133h9.216l56.6272-111.069867 22.784-44.680533 22.784 44.680533 56.6272 111.069867H1427.797333l4.437334 19.5584c34.645333 152.917333-6.6048 265.250133-123.050667 330.615467l-1.809067 0.989866 0.068267 0.512 10.018133 80.9984 0.5632 4.522667 11.093334 89.634133 0.699733 5.802667 0.3584 2.8672 0.7168 5.7344 0.699733 5.717333 0.7168 5.768534 23.927467 193.536-50.5856 6.024533-24.234667-196.027733-0.750933-6.144-0.7168-5.7344-0.699733-5.7344-11.793067-95.4368-7.5776-61.2352-0.631467-5.051734-3.549866-28.791466-0.341334-2.816-0.648533-5.12-2.1504-17.476267 16.042667-7.867733c101.888-49.937067 141.124267-135.202133 118.459733-261.973334l-0.546133-2.901333h-236.885334l-7.031466-13.824-40.9088-80.213333-40.891734 80.213333-7.048533 13.824h-67.208533l-7.611734-10.666667-57.122133-80.0256-113.8176 446.395734-2.850133-0.699734 41.659733 353.928534-50.602667 5.717333-70.775466-601.2928-90.6752 80.0256-7.253334 6.417067H262.229333l57.173334 72.072533 5.973333 7.509333-0.648533 9.489067-12.7488 187.306667-50.824534-3.310934 12.0832-177.834666-83.2-104.874667-31.965866-40.311467H607.914667l120.098133-105.984 36.693333-32.375466 5.649067 48.0768 19.1488 162.645333 96.426667-378.129067 13.533866-53.128533zM452.1472 586.922667c21.0944 0 38.1952 16.776533 38.1952 37.461333 0 20.701867-17.1008 37.461333-38.1952 37.461333-21.111467 0-38.229333-16.759467-38.229333-37.461333 0-20.6848 17.117867-37.461333 38.229333-37.461333z m152.832 0c21.0944 0 38.212267 16.776533 38.212267 37.461333 0 20.701867-17.117867 37.461333-38.229334 37.461333-21.0944 0-38.1952-16.759467-38.1952-37.461333 0-20.6848 17.1008-37.461333 38.212267-37.461333z m394.820267-237.2608c21.111467 0 38.212267 16.776533 38.212266 37.461333 0 20.6848-17.1008 37.461333-38.212266 37.461333-21.0944 0-38.212267-16.776533-38.212267-37.461333 0-20.6848 17.117867-37.461333 38.229333-37.461333z m152.832 0c21.111467 0 38.229333 16.776533 38.229333 37.461333 0 20.6848-17.117867 37.461333-38.229333 37.461333-21.0944 0-38.1952-16.776533-38.1952-37.461333 0-20.6848 17.1008-37.461333 38.1952-37.461333z" p-id="9107" fill="#8a8a8a"></Path>
                    <Path d="M624.0768 0c17.578667 0 31.8464 14.250667 31.8464 31.8464V93.013333a31.8464 31.8464 0 1 1-63.6928 0V31.8464c0-17.578667 14.267733-31.8464 31.8464-31.8464z m0 199.799467c17.578667 0 31.8464 14.267733 31.8464 31.8464v61.201066a31.8464 31.8464 0 1 1-63.6928 0v-61.201066c0-17.578667 14.267733-31.8464 31.8464-31.8464z m-38.212267-37.461334a31.232 31.232 0 0 1-31.214933 31.232h-64.9216a31.232 31.232 0 0 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.214933 31.232h-64.9216a31.232 31.232 0 0 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m751.445334 337.169067c17.578667 0 31.8464 14.267733 31.8464 31.8464v61.201067a31.8464 31.8464 0 1 1-63.675734 0v-61.201067c0-17.578667 14.250667-31.8464 31.8464-31.8464z m0 199.816533c17.578667 0 31.8464 14.250667 31.8464 31.829334v61.201066a31.8464 31.8464 0 1 1-63.675734 0v-61.201066c0-17.578667 14.250667-31.829333 31.8464-31.829334zM1502.890667 661.845333a31.232 31.232 0 0 1-31.232 31.232h-64.9216a31.232 31.232 0 1 1 0-62.446933h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.232 31.232h-64.904534a31.232 31.232 0 1 1 0-62.446933h64.9216c17.237333 0 31.214933 13.994667 31.214934 31.232zM165.563733 699.323733c17.578667 0 31.8464 14.250667 31.8464 31.829334v61.201066a31.8464 31.8464 0 0 1-63.675733 0v-61.201066c0-17.578667 14.250667-31.829333 31.829333-31.829334z m0 199.799467c17.578667 0 31.8464 14.250667 31.8464 31.8464v61.184a31.8464 31.8464 0 0 1-63.675733 0V930.986667c0-17.578667 14.250667-31.8464 31.829333-31.8464z m-38.1952-37.461333a31.232 31.232 0 0 1-31.232 31.232H31.232a31.232 31.232 0 1 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.232 31.232H235.008a31.232 31.232 0 1 1 0-62.464h64.9216c17.237333 0 31.214933 13.994667 31.214933 31.232z" p-id="9108" fill="#8a8a8a"></Path>
                </Svg>
                <Text style={{ fontWeight: 'bold', color: '#b0b1b7', fontSize: 18 }}>暂时没有获赞哦~</Text>
                <View style={{ height: 5 }} />
                <Button title='重新加载' onPress={async () => { await getInitialRecord(); }} />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* Header部分 */}
            <SafeAreaView style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: windowSet.width * 0.12 }}>
                    <MaterialIcons name='arrow-back-ios' size={24} style={{ paddingLeft: 20, position: 'absolute', color: 'black' }} />
                    <View style={{ justifyContent: 'center', width: windowSet.width }}>
                        <Text style={{ alignSelf: 'center', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>收获的小心心</Text>
                    </View>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        ref={loadingAnimation}
                        style={{
                            width: 50, height: 50,
                            alignSelf: 'center',
                            position:'absolute',
                            marginLeft:windowSet.width - 60,
                            display:loading ? 'flex' :'none'
                        }}
                        source={require("../lottie/loadComments.json")}
                    />
                </View>
            </SafeAreaView>
            {/* List列表 */}
            <ScrollView style={styles.content}>
                {
                    records.length > 0 ?
                        <View style={{ alignItems: 'center' }}>
                            <FlatList scrollEnabled={false} data={records} renderItem={RecordRender} style={{ width: windowSet.width }} />
                            <Text style={{ paddingTop: 40, fontWeight: '500', color: '#a9a9a8' }}>找不到更多啦~</Text>
                        </View>
                        :
                        <EmptyData />
                }
            </ScrollView>
            <Loading />
        </View>
    );
}

type LikeRecord = {
    OwnerId: string,
    SubscriberId: string,
    SubscriberName: string,
    AvatarUrl: string,
    PreviewUrl: string,
    Content: string,
    BlogId: string,
    HaveRead: boolean,
    CreateOnTime: string
}

const styles = StyleSheet.create({
    screen: {
        width: windowSet.width,
        height: windowSet.height,
    },
    header: {
        height: windowSet.height * 0.12,
        backgroundColor: 'white',
    },
    content: {
        borderWidth: 1,
        borderColor: 'rgba(9,34,68,0.1)',
        // borderTopStartRadius: 20,
        // borderTopEndRadius: 20,
        backgroundColor: 'white',
        height: windowSet.height * 0.88
    },
    textArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: '#545657',
    }
});