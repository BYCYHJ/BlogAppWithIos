import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import React, { useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Avatar } from '@rneui/base';

// For the testing purposes, you should probably use https://github.com/uuidjs/uuid
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  })
}

const BlogChat = () => {
  const AvatarImg = require("../screens/logo.png");
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const turnMessages = useRef<MessageType.Any[]>([]);
  const user = {
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
    firstName: 'AnAn',
    lastName: '',
    imageUrl: 'https://i.postimg.cc/7br8STM5/logo2.png'
  };
  const user2 = {
    id: '06c33e8b-e835-4736-80f4-63f44b66666a',
    firstName: 'AnAn',
    lastName: '',
    imageUrl: 'https://i.postimg.cc/7br8STM5/logo2.png'
  }

  const addMessage = (message:MessageType.Any) => {
    setMessages(pre => [message, ...pre]);
  }
  // const addRefMsg = (message:MessageType.Any) => {
  //   var a = turnMessages.current;
  //   var b = message;
  //   turnMessages.current = [...(turnMessages.current),message];
  // }

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    const textMessage2: MessageType.Text = {
      author: user2,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    }
    // addRefMsg(textMessage);
    // addRefMsg(textMessage2);
    addMessage(textMessage);
    setTimeout(() => {addMessage(textMessage2);},5000);
  }

  return (
    // Remove this provider if already registered elsewhere
    // or you have React Navigation set up
    <SafeAreaProvider>
      <View style={styles.TopHeader}>
        <Entypo size={20} name="chevron-thin-left" style={[styles.HeaderContent,{ paddingLeft: 12, paddingRight: 20 }]} />
        <Avatar rounded size={30} source={AvatarImg} containerStyle={{marginBottom:5 }}  avatarStyle={{ resizeMode: 'stretch', height: 30, width: 30}} />
        <Text style={[styles.HeaderContent,{ fontSize: 18, paddingLeft: 15, width: global.windowSet.width * 0.4 }]}>jun_anananan</Text>
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
  HeaderContent:{
    paddingBottom:10
  }
});