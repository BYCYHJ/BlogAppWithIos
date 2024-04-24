import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Avatar } from '@rneui/base';
import getSharedConnection, { demapMsg, mapMsg } from '../services/connection';
import { chatHistoryTableName, getHistory, writeToRealm } from '../services/realmTable';


const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  })
}

const BlogChat = ({ navigation, route }) => {
  const AvatarImg = require("../screens/logo.png");
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const turnMessages = useRef<MessageType.Any[]>([]);
  const user = {
    id: route.params.senderId,
    firstName: route.params.senderName,
    lastName: '',
    imageUrl: 'https://i.postimg.cc/7br8STM5/logo2.png'
  };
  const user2 = {
    id: route.params.recipientId,
    firstName: route.params.recipientName,
    lastName: '',
    imageUrl: 'https://i.postimg.cc/7br8STM5/logo2.png'
  }

  const initialSignalR = async () => {
    const connection = await getSharedConnection();
    connection.on("ReceiveMessage", (message) => {
      const parseMsg = JSON.parse(message);
      const receiveMsg = mapMsg(parseMsg);
      if (receiveMsg.type == 1) {
        const newMsg: MessageType.Text = {
          author: user.id == parseMsg.SenderId ? user : user2,
          createdAt: parseMsg.SendTime,
          text: parseMsg.SendMsg,
          id: parseMsg.Id,
          type: 'text'
        };
        addMessage(newMsg);
      }
    });
  }

  initialSignalR();

  //获取历史消息
  useEffect(() => {
    async () => {
      try {
        let arrays = await getHistory(route.params.senderId, route.params.recipientId);
        console.log(arrays);
        if (arrays.count != 0) {
          const msgArr = arrays.forEach(message => {
            return mapMsg(message);
          });
          setMessages([...msgArr,...messages]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages]);
  }

  //发送按钮，调用signalR的SendMessage方法
  const handleSendPress = async (message) => {
    const sendMsg = demapMsg(message, user.id, user2.id);//传入后端的msg
    console.log("messageId:" + sendMsg.id);
    var contentMsg: MessageType.Any;
    if (message.type == 'text') {
      contentMsg = {
        author: user,
        createdAt: Date.now(),
        id: sendMsg.id,
        text: message.text,
        type: 'text',
      };//前端展示的msg
    }
    addMessage(contentMsg);//加入展示的Msg
    writeToRealm(sendMsg, chatHistoryTableName);//存入realm
    const connection = await getSharedConnection();
    connection.invoke("SendMessage", JSON.stringify(sendMsg));
  }



  return (
    // Remove this provider if already registered elsewhere
    // or you have React Navigation set up
    <SafeAreaProvider>
      <View style={styles.TopHeader}>
        <Entypo size={20} name="chevron-thin-left" style={[styles.HeaderContent, { paddingLeft: 12, paddingRight: 20 }]} />
        <Avatar rounded size={30} source={AvatarImg} containerStyle={{ marginBottom: 5 }} avatarStyle={{ resizeMode: 'stretch', height: 30, width: 30 }} />
        <Text style={[styles.HeaderContent, { fontSize: 18, paddingLeft: 15, width: global.windowSet.width * 0.4 }]}>jun_anananan</Text>
      </View>
      <Chat
        showUserNames={true}
        showUserAvatars={true}
        messages={messages}
        onSendPress={handleSendPress}
        onAttachmentPress={() => { }}
        user={user}
      />
    </SafeAreaProvider>
  )
}

export default BlogChat;

const windowSet = Dimensions.get('window');

const styles = StyleSheet.create({
  TopHeader: {
    height: windowSet.height * 0.1,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 20
  },
  HeaderContent: {
    paddingBottom: 10
  }
});