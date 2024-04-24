import Realm from 'realm';

export const chatListTableName = "chatList";
export const chatHistoryTableName = "ChatHistory";

//表定义
//对话列表
const chatListSchema = {
    name: 'chatList',
    primaryKey: 'targetId',
    properties: {
        targetId: 'string',//聊天对象
        targetName: 'string',//聊天对象名称
        targetAvatr: 'string?',//聊天对象头像
        ownerId: 'string',//当前用户
    }
}
//聊天记录
const chatHistorySchema = {
    name: 'ChatHistory',
    primaryKey: 'id',
    properties: {
        id: 'string',
        type: 'string', // 文件类型
        senderId: 'string', // 发送者 ID
        recipientId: 'string', // 接收者 ID
        sendTime: 'date', // 发送时间
        sendMsg: 'string?', // 发送的文本内容 (可为空)
        dataRoute: 'string?', // 文件路径 (照片、文件) (可为空)
        hasRead: 'bool', // 是否已读
    }
}

export const instance = new Realm({
    schema: [
        chatHistorySchema,
        chatListSchema
    ],
    deleteRealmIfMigrationNeeded: true,
    inMemory: false
});

//表操作方法
//插入
export function writeToRealm(obj, tableName) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            instance.create(tableName, obj, true);
            resolve(true);
        });
    });
}

//表中数据全部删除
export function deleteAll(tableName) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects(tableName);
            instance.delete(arrays);
            resolve(true);
        });
    });
}

//获取表中全部
export function getAll(tableName) {
    return new Promise((resolve, reject) => {
        let arrays = instance.objects(tableName);
        return resolve(arrays);
    });
}


//获取部分聊天记录
export function getHistory(senderId, recipientId) {
    return new Promise((resolve, reject) => {
        let arrays = instance.objects(chatHistoryTableName)
            .filter('senderId IN ["' + senderId + '","' + recipientId + '"]' + 'AND recipientId IN ["' + recipientId + '","' + senderId + '"]')
            .sort('sendTime', true)
            .slice(0, 20);
        resolve(arrays);
    });
}
