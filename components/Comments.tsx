import { ButtonText, Divider, Button, Modal } from "@gluestack-ui/themed";
import { Avatar, Card } from "@rneui/base";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, StyleSheet, ScrollView, useAnimatedValue, TouchableOpacity, FlatList, Keyboard } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Dialog, PanningProvider, StackAggregator, Text } from "react-native-ui-lib";
import Overlay from "./Overlay";
import React from "react";
import AnimateIcon from "./AnimateIcon";
import Svg, { Path } from "react-native-svg";
import TextAreaResizable from 'react-native-textarea-resizable'
import CommentEditor from "./CommentEditor";
import CommentList from "./CommentList";


const windowSet = Dimensions.get('window');
const example = [];
// const exampleComments = [{
//     id: '1',
//     content: `太厉害了连续空间区域上的问题转化为在离散网格点上进行计算，从而更容易在计算机上实现数值求解。</div><div>差分格式方法有多种，如显式与隐式算法。显式算法相对简单，但有时为了满足计算稳定的条件，需要取很小的步`,
//     ParentId: '',
//     userId: '',
//     userName: 'AnAn',
//     AvatarUrl: '',
//     publishDate: '2天前',
//     ChildrenComments: [{
//         id: '2',
//         Content: "什么很厉害吗?",
//         userId: '',
//         userName: 'BaiBai',
//         AvatarUrl: '',
//         ReplyName: "AnAn"
//     }, {
//         id: '4',
//         Content: "你很厉害咯?",
//         userId: '',
//         userName: 'Emo',
//         AvatarUrl: '',
//         ReplyName: "BaiBai"
//     },
//     ]
// },
// {
//     id: '3',
//     content: "楼主很棒",
//     ParentId: '',
//     userId: '',
//     userName: '哈枇',
//     AvatarUrl: '',
//     ChildrenComments: [],
//     publishDate: '2天前',
// },
// {
//     id: '5',
//     content: "楼主很棒",
//     ParentId: '',
//     userId: '',
//     userName: '哈枇',
//     AvatarUrl: '',
//     publishDate: '2天前',
//     ChildrenComments: []
// },
// {
//     id: '6',
//     content: `太厉害了连续空间区域上的问题转化为在离散网格点上进行计算，从而更容易在计算机上实现数值求解。</div><div>差分格式方法有多种，如显式与隐式算法。显式算法相对简单，但有时为了满足计算稳定的条件，需要取很小的步`,
//     ParentId: '',
//     userId: '',
//     userName: 'AnAn',
//     AvatarUrl: '',
//     publishDate: '2天前',
// },
// {
//     id: '7',
//     content: `太厉害了连续空间区域上的问题转化为在离散网格点上进行计算，从而更容易在计算机上实现数值求解。</div><div>差分格式方法有多种，如显式与隐式算法。显式算法相对简单，但有时为了满足计算稳定的条件，需要取很小的步`,
//     ParentId: '',
//     userId: '',
//     userName: 'AnAn',
//     AvatarUrl: '',
//     publishDate: '2天前',
// }
// ];

const CommentListMemo = memo(CommentList);

export default function Comments(props: commentProps) {
    const commentEditorHeight = useSharedValue(0);//动画高度
    const replyId = useRef();
    const replyName = useRef("");
    const replyCommentId = useRef("");
    const highestCommentId = useRef("");
    const [commentEditorVisible, setEditorVisible] = useState(false);//输入评论组件可见性
    const editorValue = React.createRef();
    const [comments, setComments] = useState([...props.data]);
    const [newData, setNewData] = useState<comment|undefined|null>();//新评论

    useEffect(() => {
        setComments(props.data);
    }, [props.data]);

    useEffect(() => {
        if (newData != undefined && newData != null && newData.highestCommentId == "") {
            setComments([...comments, newData]);
        }
    }, [newData])

    return (
        <Overlay
            height={props.height}
            setVisible={function (): void {
                props.onHide();
            }}
            visible={props.visibale}
            backgroundColor='rgba(111,111,111,0.5)'>
            <View style={styles.containerStyle}>
                <View style={{ height: 40, backgroundColor: 'white', width: windowSet.width, borderTopStartRadius: 15, borderTopEndRadius: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 40, textAlign: 'center' }}>全部20条评论</Text>
                </View>
                <Divider backgroundColor="#f2f2f4" />
                {
                    comments.length == 0 ?
                        <TouchableOpacity onPress={() => { }} style={{ backgroundColor: 'white' }} activeOpacity={1}>
                            <View style={{ height: windowSet.height * 0.55, alignItems: 'center', justifyContent: 'center' }}>
                                <Svg viewBox="0 0 1706 1024" width="150" height="150">
                                    <Path d="M899.4816 78.165333l32.034133 44.885334 81.544534 114.210133h9.216l56.6272-111.069867 22.784-44.680533 22.784 44.680533 56.6272 111.069867H1427.797333l4.437334 19.5584c34.645333 152.917333-6.6048 265.250133-123.050667 330.615467l-1.809067 0.989866 0.068267 0.512 10.018133 80.9984 0.5632 4.522667 11.093334 89.634133 0.699733 5.802667 0.3584 2.8672 0.7168 5.7344 0.699733 5.717333 0.7168 5.768534 23.927467 193.536-50.5856 6.024533-24.234667-196.027733-0.750933-6.144-0.7168-5.7344-0.699733-5.7344-11.793067-95.4368-7.5776-61.2352-0.631467-5.051734-3.549866-28.791466-0.341334-2.816-0.648533-5.12-2.1504-17.476267 16.042667-7.867733c101.888-49.937067 141.124267-135.202133 118.459733-261.973334l-0.546133-2.901333h-236.885334l-7.031466-13.824-40.9088-80.213333-40.891734 80.213333-7.048533 13.824h-67.208533l-7.611734-10.666667-57.122133-80.0256-113.8176 446.395734-2.850133-0.699734 41.659733 353.928534-50.602667 5.717333-70.775466-601.2928-90.6752 80.0256-7.253334 6.417067H262.229333l57.173334 72.072533 5.973333 7.509333-0.648533 9.489067-12.7488 187.306667-50.824534-3.310934 12.0832-177.834666-83.2-104.874667-31.965866-40.311467H607.914667l120.098133-105.984 36.693333-32.375466 5.649067 48.0768 19.1488 162.645333 96.426667-378.129067 13.533866-53.128533zM452.1472 586.922667c21.0944 0 38.1952 16.776533 38.1952 37.461333 0 20.701867-17.1008 37.461333-38.1952 37.461333-21.111467 0-38.229333-16.759467-38.229333-37.461333 0-20.6848 17.117867-37.461333 38.229333-37.461333z m152.832 0c21.0944 0 38.212267 16.776533 38.212267 37.461333 0 20.701867-17.117867 37.461333-38.229334 37.461333-21.0944 0-38.1952-16.759467-38.1952-37.461333 0-20.6848 17.1008-37.461333 38.212267-37.461333z m394.820267-237.2608c21.111467 0 38.212267 16.776533 38.212266 37.461333 0 20.6848-17.1008 37.461333-38.212266 37.461333-21.0944 0-38.212267-16.776533-38.212267-37.461333 0-20.6848 17.117867-37.461333 38.229333-37.461333z m152.832 0c21.111467 0 38.229333 16.776533 38.229333 37.461333 0 20.6848-17.117867 37.461333-38.229333 37.461333-21.0944 0-38.1952-16.776533-38.1952-37.461333 0-20.6848 17.1008-37.461333 38.1952-37.461333z" p-id="9107" fill="#8a8a8a"></Path>
                                    <Path d="M624.0768 0c17.578667 0 31.8464 14.250667 31.8464 31.8464V93.013333a31.8464 31.8464 0 1 1-63.6928 0V31.8464c0-17.578667 14.267733-31.8464 31.8464-31.8464z m0 199.799467c17.578667 0 31.8464 14.267733 31.8464 31.8464v61.201066a31.8464 31.8464 0 1 1-63.6928 0v-61.201066c0-17.578667 14.267733-31.8464 31.8464-31.8464z m-38.212267-37.461334a31.232 31.232 0 0 1-31.214933 31.232h-64.9216a31.232 31.232 0 0 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.214933 31.232h-64.9216a31.232 31.232 0 0 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m751.445334 337.169067c17.578667 0 31.8464 14.267733 31.8464 31.8464v61.201067a31.8464 31.8464 0 1 1-63.675734 0v-61.201067c0-17.578667 14.250667-31.8464 31.8464-31.8464z m0 199.816533c17.578667 0 31.8464 14.250667 31.8464 31.829334v61.201066a31.8464 31.8464 0 1 1-63.675734 0v-61.201066c0-17.578667 14.250667-31.829333 31.8464-31.829334zM1502.890667 661.845333a31.232 31.232 0 0 1-31.232 31.232h-64.9216a31.232 31.232 0 1 1 0-62.446933h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.232 31.232h-64.904534a31.232 31.232 0 1 1 0-62.446933h64.9216c17.237333 0 31.214933 13.994667 31.214934 31.232zM165.563733 699.323733c17.578667 0 31.8464 14.250667 31.8464 31.829334v61.201066a31.8464 31.8464 0 0 1-63.675733 0v-61.201066c0-17.578667 14.250667-31.829333 31.829333-31.829334z m0 199.799467c17.578667 0 31.8464 14.250667 31.8464 31.8464v61.184a31.8464 31.8464 0 0 1-63.675733 0V930.986667c0-17.578667 14.250667-31.8464 31.829333-31.8464z m-38.1952-37.461333a31.232 31.232 0 0 1-31.232 31.232H31.232a31.232 31.232 0 1 1 0-62.464h64.9216c17.237333 0 31.232 13.994667 31.232 31.232z m203.776 0a31.232 31.232 0 0 1-31.232 31.232H235.008a31.232 31.232 0 1 1 0-62.464h64.9216c17.237333 0 31.214933 13.994667 31.214933 31.232z" p-id="9108" fill="#8a8a8a"></Path>
                                </Svg>
                                <Text style={{ fontWeight: 'bold', color: '#b0b1b7', fontSize: 18 }}>还没有评论哦~</Text>
                                <View style={{ height: 5 }} />
                            </View>
                        </TouchableOpacity>
                        :
                        <CommentListMemo commentEditorHeight={commentEditorHeight} replyName={replyName} highestCommentId={highestCommentId}
                            replyId={replyId} data={comments} setVisible={() => { setEditorVisible(true); }} replyCommentId={replyCommentId} newData={newData}
                        />
                }
                <FakeEditor commentEditorVisible={commentEditorVisible} commentEditorHeight={commentEditorHeight}
                    editorValue={editorValue} replyCommentId={replyCommentId} highestCommentId={highestCommentId}
                    setEditorVisible={setEditorVisible} replyId={replyId} replyName={replyName} blogId={props.blogId} setNewData={setNewData}
                />
            </View>
        </Overlay>
    );
}

function FakeEditor({ commentEditorVisible, setEditorVisible, commentEditorHeight, editorValue, replyId,
    replyName, blogId, replyCommentId, highestCommentId, setNewData }) {
    return (
        <TouchableOpacity
            style={{ height: windowSet.height * 0.15 - 40, backgroundColor: 'white' }}
            activeOpacity={0.5}
            onPress={() => {
                setEditorVisible(true);
                commentEditorHeight.value = 420;
                replyId.current = "";
                replyName.current = "";
                highestCommentId.current = "";
            }}
        >
            <Divider backgroundColor="#f2f2f4" />
            <View style={{ paddingTop: 15, flexDirection: 'row' }}>
                <View style={styles.fakeTextArea}>
                    <Text style={{ color: 'grey', fontWeight: '400', lineHeight: 35, paddingLeft: 10 }}>说点什么吧~</Text>
                </View>
                <Button style={{ width: '18%', backgroundColor: 'orangered', marginLeft: 20, height: 35, borderRadius: 10 }}>
                    <ButtonText style={{ fontSize: 14 }}>发布</ButtonText>
                </Button>
            </View>
            <Modal isOpen={commentEditorVisible}>
                <CommentEditor ref={editorValue} visible={commentEditorVisible}
                    setVisible={function (): void {
                        setEditorVisible(false);
                    }}
                    animateHeight={commentEditorHeight}
                    replyId={replyId.current}
                    replyName={replyName.current}
                    blogId={blogId}
                    replyCommentId={replyCommentId.current}
                    highestCommentId={highestCommentId.current}
                    setNewData={setNewData}
                />
            </Modal>
        </TouchableOpacity>
    );
}

type commentProps = {
    visibale: boolean,
    onHide: () => void,
    height: SharedValue<number>,
    data: Array<object>,
    blogId?: string
}

type comment = {
    id: string,
    content: string,
    parentId?: string,
    publishDate: string,
    userId: string,
    userName: string,
    avatarUrl?: string,
    starCount: number,
    replyUserName?: string,
    highestCommentId: string,
    isLike: boolean
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'white',
        height: windowSet.height * 0.7,
        width: windowSet.width,
        alignSelf: 'center',
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        maxHeight: windowSet.height * 0.7,
    },
    fakeTextArea: {
        width: windowSet.width * 0.7,
        backgroundColor: "#f2f2f4",
        height: 35,
        borderRadius: 10,
        marginLeft: 20,
    },
    textAreaStyle: {
        borderWidth: 1
    }
});