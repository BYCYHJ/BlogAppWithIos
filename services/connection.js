import { HubConnectionBuilder } from '@microsoft/signalr';
import { getStorage } from './services';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';


let signalRConnection = null;

export default getSharedConnection = async () => {
    //如果为空则重新赋值
    if (!signalRConnection || signalRConnection == undefined) {
        const user = await getStorage('userInfo'); // 从 AsyncStorage 获取 userId
        const userId = JSON.parse(user).userId;
        signalRConnection = new HubConnectionBuilder()
            .withUrl("http://192.168.2.117:5130/messageHub?userId=" + userId)
            .withAutomaticReconnect()
            .build();
    }
    //不为空直接返回，保证全局使用的signalR连接唯一
    return signalRConnection;
};

//映射message
export function mapMsg(message) {
    return {
        id: message.Id,
        type: message.Type,
        senderId: message.SenderId,
        recipientId: message.RecipientId,
        sendTime: message.SendTime,
        sendMsg: message.SendMsg,
        dataRoute: message.DataRoute,
    }
}

//反映射message
export function demapMsg(chatMsg, senderId, recipientId) {
    return {
        id: uuidv4(),
        type: chatMsg.type,
        sendMsg: chatMsg.text,
        recipientId: recipientId,
        senderId: senderId,
        dataRoute: "",
        sendTime: new Date().toLocaleTimeString(Date.now())
    }
}