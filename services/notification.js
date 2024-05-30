import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default async function schedulePushNotification({msg}) {
    console.log("message:"+msg);
    //权限
    //查看通知权限
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    //目前无通知权限
    if (existingStatus !== 'granted') {
        //请求授权
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    //最终状态仍未授权
    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
    }
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "您有一条新消息 📬",
            body: msg,
            data: {data:msg},
        },
        trigger: { seconds: 1 }, // Schedule the notification after 2 seconds
    });
}