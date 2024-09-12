import { Icon } from '@rneui/base';
import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Pressable,Image } from 'react-native';
import { Tip, showTip } from 'react-native-tip';
import OverlayButton from '../components/OverlayButton';
import { Button, FeatureHighlight } from 'react-native-ui-lib';

const windowSet = Dimensions.get('window');

export default function Test() {
    const [_showTip, setShowTip] = React.useState(true)

    return (
        <View style={{ height: windowSet.height, justifyContent: 'center',alignItems:'center' }}>
            <Image style={{width:200,height:200}} resizeMode='stretch' source={{uri:'https://ananbaibai.cn/test.png'}} />
            <Text>aaa</Text>
        </View>
    )
}


function TextComponent({ item }) {
    const [foo, setFoo] = useState("bar");
    return <Text>{foo}</Text>;
}
