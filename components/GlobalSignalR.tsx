import { useContext, createContext, useEffect } from 'react';
import signalr from '@microsoft/signalr';
import { useUser } from '../UserContext';
import { View } from 'react-native-animatable';
import getSharedConnection from '../services/connection';
import { Dimensions } from 'react-native';
import schedulePushNotification from '../services/notification';
import { writeToRealm, chatHistoryTableName, instance, chatListTableName } from '../services/realmTable';
import { getUniqueUser, getUniqueUserInfo } from '../services/services';

const windowSet = Dimensions.get('screen');

//全局signalR组件，负责全局signalR连接
export default function GlobalSignalR({ component }) {
    const {userInfo, setUserInfo} = useUser();

    const initialSignalR = async () => {
        const connection = await getSharedConnection();
        connection.start();
        //监听对话消息，将消息存放至数据库中
        connection.on("ReceiveMessage",async (message)=>{
            writeToRealm(message,chatHistoryTableName);//存入realm
            //判断对话列表中是否含有该对话
            const chat = instance.objectForPrimaryKey(chatListTableName,message.senderId);
            if(!chat){
                //请求拿到用户信息
                const {data,status} =await getUniqueUser(message.senderId);
                const sender = data.Data;
                //如果不包含则添加
                await writeToRealm({
                    ownerId:userInfo.userId,
                    targetId: sender.Id,
                    targetName: sender.UserName,
                    targetAvatr: sender.AvatarUrl,
                },chatHistoryTableName);
            }

        });
        //监听服务端消息推送
        connection.on("ReceiveNotification", (notification) => {
            const msg = JSON.parse(notification);
            //推送消息
            schedulePushNotification({msg:msg.message});
            console.log(msg);
        });
    }

    useEffect(() => {
        //无用户信息时直接返回不进行连接
        if (userInfo == null || userInfo == undefined) {
            console.log("no user");
            return;
        }
        //进行signalR连接
        console.log(userInfo.userId);
        (async () => {
            await initialSignalR();
        })();
    }, [userInfo]);

    return (
        <View style={{ width: windowSet.width, height: windowSet.height }}>
            {component}
        </View>
    );
}