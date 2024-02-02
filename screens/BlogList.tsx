import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dimensions, View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Avatar, ListItem, Card } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollTabView } from 'react-native-scroll-head-tab-view';
import { SearchBar } from '@rneui/themed';



const windowSet = Dimensions.get('window');

function TabView1(props) {
    const exampleBlog: Array<BlogInfo> = [{
        title: "深入了解React Native FlatList",
        content: "在data 道具中,你将输入你想显示的数组。这可以是来自API的JSON数据,keyExtractor 道具将为数组中的每个项目检索一个唯一的键注意,如果你的数组包含一个key 或id 字段,你不需要包括这个道具。默认情况下,FlatList 将寻找key 或id 属性"
            + "renderItem 将告诉React Native如何渲染列表中的项目。",
        tags: ['All', 'React'],
        stars: 2
    },
    {
        title: "深入了解React Native FlatList2",
        content: "在data 道具中,你将输入你想显示的数组。这可以是来自API的JSON数据,如果你的数组包含一个key 或id 字段,你不需要包括这个道具。默认情况下,FlatList 将寻找key 或id 属性"
            + "renderItem 将告诉React Native如何渲染列表中的项目。",
        tags: ['All', 'React', '.Net'],
        stars: 0
    }
    ];

    const pressBlog = ()=>{
        props.navigation.navigate("Blog");
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={pressBlog}>
                <View style={{ height: 15}} />
                <ListItem containerStyle={{ borderRadius: 20,width:windowSet.width*0.98, backgroundColor: 'white', display: 'flex',alignSelf:'center'}} >
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar size={20} rounded title='An' containerStyle={{ backgroundColor: '#b999e3' }} />
                            <Text style={{ paddingLeft: 5, fontWeight: 'bold', color: 'grey' }}>AnAn</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', width: windowSet.width * 0.75 }}>
                                <FlatList horizontal={true} data={item.tags} style={{ height: 15, flexDirection: 'row-reverse' }}
                                    renderItem={({ item }) => {
                                        const color = item == 'All' ? '#66a1ff' : (item == '.Net' ? '#ff5819' : '#8566ff');
                                        return (
                                            <View style={{ display: 'flex', flexDirection: 'row', height: 15 }}>
                                                <View style={{ backgroundColor: color, borderRadius: 3, width: 35, alignItems: 'center' }}>
                                                    <ListItem.Title style={{ color: 'white', fontSize: 10, fontWeight: 'bold', lineHeight: 15 }}>
                                                        {item}
                                                    </ListItem.Title>
                                                </View>
                                                <View style={{ paddingLeft: 5 }} />
                                            </View>
                                        );
                                    }} />
                            </View>
                        </View>
                        <View style={{ height: 8 }} />
                        <ListItem.Content>
                            <ListItem.Title>
                                <Card.Title>{item.title}</Card.Title>
                            </ListItem.Title>
                            <View style={{ height: 5, width: 200, alignContent: 'center' }} />
                            {/* <Card.Divider /> */}
                            <Text>{item.content.length > 50 ? item.content.slice(0, 60) + '...' : item.content}</Text>
                            <View style={{ height: 5 }} />
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <AntDesign name='staro' color={'grey'}></AntDesign>
                                <Text style={styles.bottomActionText}>10</Text>
                                <Text style={{ paddingLeft: 15, color: '#e6e6e6', marginTop: -2 }}>|</Text>
                                <AntDesign name='like2' style={[styles.bottomActionIcon, { paddingLeft: 15 }]} />
                                <Text style={styles.bottomActionText}>6</Text>
                                <Text style={{ paddingLeft: 15, color: '#e6e6e6', marginTop: -2 }}>|</Text>
                                <AntDesign name='message1' style={[styles.bottomActionIcon, { paddingLeft: 15 }]} />
                                <Text style={styles.bottomActionText}>6</Text>
                            </View>
                        </ListItem.Content>
                    </View>
                </ListItem>
            </TouchableOpacity>
        );
    };
    return (<FlashList data={exampleBlog} renderItem={renderItem} estimatedItemSize={10}/>);
}

function TabView2(props) {
    return <Text>aaa</Text>
}

export default function BlogList({navigation}) {

    const [headerHeight, setHeaderHeight] = useState(200);
    const headerOnLayout = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    }, []);
    const [searchVal, setSearchVal] = useState("");
    const windowSet = Dimensions.get('window');

    const _renderScrollHeader = useCallback(() => {
        return (
            <View onLayout={headerOnLayout}>
                <View style={{ backgroundColor: 'pink' }}>
                </View>
            </View>
        );
    }, []);


    return (
        <View style={{ height: windowSet.height, width: windowSet.width, backgroundColor: '#eff0f1', alignItems: 'center' }}>
            <View style={{ height: 50 }}/>
            <SearchBar platform='ios'
            style={{borderColor:'blue'}}
                containerStyle={{ height: 30, width: windowSet.width * 0.95, backgroundColor: '#eff0f1' }}
                inputContainerStyle={{ maxHeight: 30,backgroundColor: 'white' }}
                inputStyle={{fontSize:16,fontWeight:'400'}}
                showLoading={true}
                placeholder='seach ...'
                value={searchVal}
            />
            <ScrollTabView headerHeight={30}
                tabBarPosition='top'
                tabBarTextStyle={{ fontWeight: 'bold' }}
            >
                <TabView1 tabLabel="推荐" navigation={navigation}/>
                <TabView2 tabLabel="关注" />
            </ScrollTabView>
        </View>
    );
}


type BlogInfo = {
    title: string,
    content: string,
    tags: Array<string>,
    stars: number
}

const styles = StyleSheet.create({
    bottomActionIcon: {
        color: 'grey'
    },
    bottomActionText: {
        color: 'grey',
        paddingLeft: 8
    }
});
