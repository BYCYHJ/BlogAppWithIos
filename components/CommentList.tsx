import { ButtonText, Divider, Button, Modal, Menu } from "@gluestack-ui/themed";
import { Avatar, Card } from "@rneui/base";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, StyleSheet, ScrollView, useAnimatedValue, TouchableOpacity, FlatList, Keyboard } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Dialog, PanningProvider, StackAggregator, Text, FeatureHighlight } from "react-native-ui-lib";
import React from "react";
import AnimateIcon from "./AnimateIcon";
import Entypo from 'react-native-vector-icons/Entypo';
import { AddCommentLike, GetChildrenComments, PublishComment, RemoveCommentLike } from "../services/services";
import LottieView from "lottie-react-native";

const AvatarImg = require("../screens/logo.png");
const heartAnimate = require('../lottie/heartBeat.json');//喜欢点击动画

const windowSet = Dimensions.get('screen');

function CommentList({ data, replyName, replyId, setVisible, commentEditorHeight, replyCommentId, highestCommentId, newData }) {

    return (
        <FlatList
            //extraData={data}
            scrollEnabled={true}
            keyExtractor={item => item.id}
            style={{ width: windowSet.width, paddingTop: 15, maxHeight: windowSet.height * 0.55 }}
            renderItem={object => <HighestComment item={object.item} replyName={replyName} replyId={replyId} setVisible={setVisible}
                commentEditorHeight={commentEditorHeight} replyCommentId={replyCommentId} highestCommentId={highestCommentId} newData={newData}
            />}
            data={data}
        />
    );
}

//单条评论
function HighestComment({ item, replyName, replyId, setVisible, commentEditorHeight, replyCommentId, highestCommentId, newData }) {
    const [loadMoreVisible, setLoadMoreVisible] = useState(true);
    const [childrenComment, setChildrenComment] = useState([]);
    const pageIndex = useRef(1);//子评论页数
    const loadingAnimation = useRef(null);//加载评论时的动画
    const [commentLoading, setCommentLoading] = useState(false);//是否加载
    const [_showTip, setShowTip] = useState(false);
    const [like, setLike] = useState(item.isLike);//是否为喜欢
    const [likeCount, setLikeCount] = useState(item.starCount);//被喜欢数量

    useEffect(() => {
        console.log(newData);
        if (newData && newData.highestCommentId == item.id) {
            console.log(newData);
            setChildrenComment([...childrenComment, newData]);
        }
    }, [newData]);

    //点击评论进行回复
    const replyComment = () => {
        setVisible();
        replyId.current = item.id;
        replyName.current = item.userName;
        replyCommentId.current = item.id;
        highestCommentId.current = item.id;
        commentEditorHeight.value = 420;
    };

    //获取该评论的子评论
    const getChildren = async () => {
        setCommentLoading(true);
        const { data, status } = await GetChildrenComments(item.id, pageIndex.current, 5);
        console.log(data.Data);
        if (data.StatusCode < 299) {
            //条数小于5说明无新评论
            if (data.Data.length < 5) {
                //隐藏“加载更多”按钮
                setLoadMoreVisible(false);
            } else {
                //index + 1
                pageIndex.current += 1;
            }
            setChildrenComment([...childrenComment, ...data.Data]);
        } else {
            //隐藏“加载更多”按钮
            setLoadMoreVisible(false);
        }
        setCommentLoading(false);
    }

    //添加喜欢
    const addLikeHighest = async () => {
        setLike(true);
        setLikeCount(likeCount + 1);
        const { data, status } = await AddCommentLike(item.id);
        try {
            if (status < 299) {
                if (data.StatusCode < 299) {
                    //请求成功但数据库未作出更改
                    if (data.Data <= 0) {
                        setLike(false);
                    } else {
                        //重新赋值喜欢数量
                        setLikeCount(data.Data);
                    }
                } else {
                    //未请求成功
                    setLike(false);
                }
            } else {
                //出现错误
                setLike(false);
            }
        } catch (ex) {
            setLike(false);
            console.log(ex);
        }
    }
    //移除喜欢
    const RemoveHighest = async () => {
        setLike(false);
        setLikeCount(likeCount - 1 > 0 ? likeCount - 1 : 0);
        const { data, status } = await RemoveCommentLike(item.id);
        try {
            if (status < 299) {
                if (data.StatusCode < 299) {
                    //请求成功但数据库未作出更改
                    if (data.Data < 0) {
                        setLike(true);
                    } else {
                        setLikeCount(data.Data);
                    }
                } else {
                    //未请求成功
                    setLike(true);
                }
            } else {
                //出现错误
                setLike(true);
            }
        } catch (ex) {
            setLike(true);
            console.log(ex);
        }
    }

    return (
        <TouchableOpacity style={{ paddingTop: 20 }} onPress={() => { replyComment(); }}>
            <View style={{ flexDirection: 'row', width: windowSet.width }}>
                <Avatar size={36} rounded source={AvatarImg} containerStyle={{ marginLeft: 10 }} avatarStyle={{ resizeMode: 'stretch', height: 45, width: 45 }} />
                <View style={{ paddingLeft: 10, justifyContent: 'center', width: windowSet.width * 0.72 }}>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#a9a9ab' }}>{item.userName}</Text>
                    <Text style={{ lineHeight: 19, paddingTop: 5 }}>{item.content}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5 }}>
                        <Text style={{ lineHeight: 19, color: 'grey', fontSize: 13 }}>{item.publishDate}</Text>
                        <Text style={{ lineHeight: 19, fontSize: 12 }}> 回复</Text>
                    </View>
                    {/* 子评论区域 */}
                    <FlatList data={childrenComment} scrollEnabled={false}
                        renderItem={object =>
                            <Children item={object.item} setVisible={setVisible} replyId={replyId} replyName={replyName} replyCommentId={replyCommentId}
                                highestCommentId={highestCommentId} commentEditorHeight={commentEditorHeight}
                            />}
                    />
                    {
                        !commentLoading ?
                            <TouchableOpacity style={{ display: loadMoreVisible ? 'flex' : 'none', flexDirection: 'row', alignItems: 'center', marginTop: 15 }} onPress={getChildren} >
                                <Text style={{ color: 'rgba(111,111,111,0.2)' }}>——</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'grey', paddingLeft: 5 }}>展开其余回复</Text>
                                <Entypo size={15} name="chevron-down" color="grey" />
                            </TouchableOpacity> :
                            <LottieView
                                autoPlay={true}
                                loop={true}
                                ref={loadingAnimation}
                                style={{
                                    width: 50, height: 50,
                                    alignSelf: 'center'
                                }}
                                source={require("../lottie/loadComments.json")}
                            />
                    }
                </View>
                <View style={{ alignItems: 'flex-end', alignSelf: 'flex-start', width: windowSet.width * 0.1 }}>
                    <View style={{ alignItems: 'center', paddingTop: 2 }}>
                        <AnimateIcon lottiePath={heartAnimate} iconName="hearto" width={20} height={20} isPressed={like} setIsPressed={setLike}
                            onPress={async () => { addLikeHighest(); }} onCancle={() => { RemoveHighest(); }}
                        />
                        <Text>{likeCount}</Text>
                    </View>
                </View>
            </View>
            <Divider width={windowSet.width * 0.8} my='$0.5' marginTop={10} backgroundColor="#f2f2f4" style={{ alignSelf: 'center' }} />
        </TouchableOpacity>
    );
}

//子评论区域
const Children = ({ item, setVisible, replyId, replyName, replyCommentId, highestCommentId, commentEditorHeight }) => {
    const [childLike, setChildLike] = useState(item.isLike);
    const [likeCount, setLikeCount] = useState(item.starCount);

    //点击子评论进行回复
    const pressChild = () => {
        setVisible();
        replyId.current = item.id;
        replyName.current = item.userName;
        replyCommentId.current = item.id;
        highestCommentId.current = item.highestCommentId;
        commentEditorHeight.value = 420;
    }

    //添加喜欢
    const addLikeChhild = async () => {
        setChildLike(true);
        const { data, status } = await AddCommentLike(item.id);
        try {
            if (status < 299) {
                if (data.StatusCode < 299) {
                    //请求成功但数据库未作出更改
                    if (data.Data < 0) {
                        setChildLike(false);
                    } else {
                        setLikeCount(data.Data);
                    }
                } else {
                    //未请求成功
                    setChildLike(false);
                }
            } else {
                //出现错误
                setChildLike(false);
            }
        } catch (ex) {
            setChildLike(false);
            console.log(ex);
        }
    }
    //移除喜欢
    const RemoveLikeChild = async () => {
        setChildLike(false);
        const { data, status } = await RemoveCommentLike(item.id);
        try {
            if (status < 299) {
                if (data.StatusCode < 299) {
                    //请求成功但数据库未作出更改
                    if (data.Data < 0) {
                        setChildLike(true);
                    } else {
                        setLikeCount(data.Data);
                    }
                } else {
                    //未请求成功
                    setChildLike(true);
                }
            } else {
                //出现错误
                setChildLike(true);
            }
        } catch (ex) {
            setChildLike(true);
            console.log(ex);
        }
    }


    return (
        <TouchableOpacity style={{ flexDirection: 'row', width: windowSet.width, paddingTop: 20 }}
            onPress={() => {
                pressChild();
            }}
        >
            <Avatar size={30} rounded source={AvatarImg} containerStyle={{}} avatarStyle={{ resizeMode: 'stretch', height: 45, width: 45 }} />
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
            <View style={{ alignItems: 'center', alignSelf: 'flex-start', width: windowSet.width * 0.1 }}>
                <View style={{ alignItems: 'center', paddingTop: 2, paddingLeft: 16 }}>
                    <AnimateIcon lottiePath={heartAnimate} iconName="hearto" width={20} height={20} isPressed={childLike} setIsPressed={setChildLike}
                        onCancle={async () => { RemoveLikeChild(); }} onPress={async () => { addLikeChhild(); }}
                    />
                    <Text>{likeCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}


export default memo(CommentList);