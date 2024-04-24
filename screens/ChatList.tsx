import { Box, Text, Divider } from "@gluestack-ui/themed";
import { Avatar, Badge } from "@rneui/base";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path } from 'react-native-svg';
import getSharedConnection from '../services/connection';

const windowSet = Dimensions.get('window');

//顶端功能栏
const topList = [{
    backgroundColor: '#fddede',
    svgCode: () => {
        return (
            <Svg viewBox="0 0 1024 1024" p-id="1488" width="30" height="30">
                <Path d="M512 901.746939c-13.583673 0-26.122449-4.179592-37.093878-13.061225-8.881633-7.314286-225.697959-175.020408-312.424489-311.379592C133.746939 532.37551 94.040816 471.24898 94.040816 384.522449c0-144.718367 108.146939-262.269388 240.326531-262.269388 67.395918 0 131.657143 30.82449 177.632653 84.636735 45.453061-54.334694 109.191837-84.636735 177.110204-84.636735 132.702041 0 240.326531 117.55102 240.326531 262.269388 0 85.159184-37.093878 143.673469-67.395919 191.216327l-1.044898 1.567346c-86.726531 136.359184-303.542857 304.587755-312.424489 311.379592-10.44898 8.359184-22.987755 13.061224-36.571429 13.061225z" fill="#fd5e5b" p-id="1489"></Path>
            </Svg>
        );
    },
    text: '赞和收藏',
    clickEvent: ({ navigation }) => {
    }
},
{
    backgroundColor: '#e7f0ff',
    svgCode: () => {
        return (
            <Svg viewBox="0 0 1024 1024" p-id="2466" width="30" height="30">
                <Path d="M512 329.728m-201.728 0a201.728 201.728 0 1 0 403.456 0 201.728 201.728 0 1 0-403.456 0Z" fill="#CCDAFF" p-id="2467"></Path>
                <Path d="M819.2 761.856c0 15.872-2.56 31.232-14.336 45.568-43.008 51.712-157.696 89.088-292.864 89.088-134.656 0-249.856-36.864-292.864-89.088-11.776-14.336-14.336-29.696-14.336-45.568 0-15.872 2.56-31.232 14.336-45.568 43.008-51.712 157.696-89.088 292.864-89.088 134.656 0 249.856 36.864 292.864 89.088 11.776 13.824 14.336 29.184 14.336 45.568z" fill="#7A7AF9" p-id="2468"></Path>
            </Svg>
        );
    },
    text: '新增关注',
    clickEvent: ({ navigation }) => {
    }
},
{
    backgroundColor: '#e7fbf3',
    svgCode: () => {
        return (
            <Svg viewBox="0 0 1024 1024" p-id="5295" width="30" height="30">
                <Path d="M796.444444 568.888889a227.555556 227.555556 0 0 1 227.555556 227.555555v170.666667a56.888889 56.888889 0 0 1-56.888889 56.888889h-170.666667a227.555556 227.555556 0 1 1 0-455.111111z" fill="#04BABE" p-id="5296"></Path>
                <Path d="M512 0a512 512 0 0 1 0 1024H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V512a512 512 0 0 1 512-512z" fill="#33da98" p-id="5297" data-spm-anchor-id="a313x.search_index.0.i3.7d543a81Q06h05" ></Path>
                <Path d="M341.333333 512m-56.888889 0a56.888889 56.888889 0 1 0 113.777778 0 56.888889 56.888889 0 1 0-113.777778 0Z" fill="#FFFFFF" p-id="5298">
                </Path><Path d="M682.666667 512m-56.888889 0a56.888889 56.888889 0 1 0 113.777778 0 56.888889 56.888889 0 1 0-113.777778 0Z" fill="#FFFFFF" p-id="5299"></Path>
            </Svg>
        );
    },
    text: '评论和@',
    clickEvent: ({ navigation }) => {
    }
}];

const exampleData = [{
    avatarUrl: 'https://i.postimg.cc/7br8STM5/logo2.png',
    userName: 'BaiBai',
    userId: '3ca669c9-e901-4f54-af94-f12d49da8ecf',
    lastMsg: '记得早睡早起',
    lastDate: '03-05',
},
{
    avatarUrl: 'https://i.postimg.cc/7br8STM5/logo2.png',
    userName: 'AnAn',
    userId: 'd6a2126a-1a11-4c01-ada3-076d2be2a123',
    lastMsg: '有龙则灵!🐉',
    lastDate: '03-05',
}];

export default function ChatList({ navigation, userInfo }) {
    const [haventReadList, setHaventReadList] = useState([]);

    const initialSignalR = async () =>{
        const connection = await getSharedConnection();
        connection.start();
        connection.on("getHaventRead", (sendersJson) => {
            const senders = JSON.parse(sendersJson);
            setHaventReadList(senders);
            console.log(haventReadList[0]);
        });
    }
    initialSignalR();

    // const connection =  signalRconnection();
    // connection.start();
    // connection.invoke("BindUser",userInfo.userId);
    // connection.on("getHaventRead", (sendersJson) => {
    //     const senders = JSON.parse(sendersJson);
    //     setHaventReadList(senders);
    //     console.log(haventReadList[0]);
    // });

    const topToolList = ({ item }) => {
        return (
            <Box alignItems="center" width={windowSet.width * 0.33} height={70}>
                <Box backgroundColor={item.backgroundColor} width={48} height={48} borderRadius={17} justifyContent="center" alignItems="center">
                    <item.svgCode />
                </Box>
                <Text style={{ fontSize: 15, fontWeight: '600', paddingTop: 10 }}>{item.text}</Text>
            </Box>
        );
    }

    const chatList = ({ item }) => {
        //点击事件，跳转
        const onClickItem = () => {
            //移除未读状态
            const newList = haventReadList.filter(sender => sender != item.userId);
            setHaventReadList(newList);

            navigation.navigate("BlogChat", {
                //接收者信息
                recipientId: item.userId,
                recipientAvatar: item.avatarUrl,
                recipientName: item.userName,
                //发送者信息
                senderId: userInfo.userId,
                senderName: userInfo.userName,
            });
        }
        return (
            <TouchableOpacity style={{ height: 70, backgroundColor: "white", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={onClickItem}>
                <Avatar size={50} rounded source={{ uri: item.avatarUrl }} />
                <Badge status="error" containerStyle={{ position: 'absolute', top: 10, left: 45, display: haventReadList.includes(item.userId) ? 'flex' : 'none' }} />
                <Box height={50} width={windowSet.width * 0.8} backgroundColor="white" marginLeft={10}>
                    <Box display="flex" flexDirection="row" height={'$1/2'} backgroundColor="white" alignItems="center">
                        <Text fontWeight="bold" fontSize={17} width={'$4/5'}>{item.userName}</Text>
                        <Text color="grey" fontSize={13}>{item.lastDate}</Text>
                    </Box>
                    <Text color="grey" fontSize={15}>{item.lastMsg}</Text>
                </Box>
            </TouchableOpacity>
        );
    }

    return (
        <View>
            <Box style={{ backgroundColor: 'white', height: windowSet.height * 0.25 }}>
                <Box style={styles.topTextBox}>
                    <Text style={{ fontWeight: '600', alignSelf: 'center', lineHeight: 50 }}>消息</Text>
                </Box>
                <Box style={styles.topListBox}>
                    <FlashList estimatedItemSize={3} data={topList} renderItem={topToolList} numColumns={3}></FlashList>
                </Box>
            </Box>
            <Box style={{ backgroundColor: 'white', height: windowSet.height * 0.64, paddingTop: 20 }}>
                <FlashList data={exampleData} renderItem={chatList} estimatedItemSize={10}></FlashList>
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    topTextBox: {
        width: windowSet.width,
        height: 50,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 50
    },
    topListBox: {
        height: windowSet.height * 0.25 - 100,
        paddingTop: 15,
        backgroundColor: 'white',
    },
});