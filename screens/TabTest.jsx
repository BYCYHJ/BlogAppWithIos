import { Button, Divider } from "@gluestack-ui/themed";
import { Input } from "@rneui/themed";
import { Dimensions, SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Avatar } from '@rneui/base';
import { ButtonText } from "@gluestack-ui/themed";
import { useRef, useState } from "react";


const example = {
    html: `<h2><strong>贪心算法介绍</strong></h2>

<p>什么是贪心算法呢？</p>

<p>首先，我们需要知道<a href="https://so.csdn.net/so/search?q=%E8%B4%AA%E5%BF%83%E7%AD%96%E7%95%A5&amp;spm=1001.2101.3001.7020" target="_blank">贪心策略</a>，即解决问题的策略，将局部最优转变为全局最优；</p>

<ul>
	<li>把解决问题的过程分为若干步；</li>
	<li>解决每一步的时候，都选择当前看起来&quot;最优的&quot;解法；</li>
	<li>&quot;希望&quot;得到全局最优解</li>
</ul>

<p>贪心算法的特点：</p>

<ol>
	<li>提出贪心策略，但是贪心策略的提出是没有标准和模板的，可能每一道题的贪心策略都是不同的；</li>
	<li>贪心策略的正确性没有保障，因为我们提出的&quot;贪心策略&quot;有可能是错误的，正确的贪心策略是需要&quot;证明的&quot;；常用的证明方法是我们学过的数学中见过的证明方法。</li>
</ol>

<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<img alt="" src="https://free.wzznft.com/i/2024/02/01/nr2t38.png" style="height:200px; width:200px" /></p>

<p>&nbsp;</p>
`
}

const windowSet = Dimensions.get('window');
const AnimatedAntdIcon = Animated.createAnimatedComponent(Icon);

export default function ReadOnlyBlog(props) {
    const AvatarImg = require("../screens/logo.png");
    const heartOpacityAnim = useRef(new Animated.Value(0)).current;
    const [heartName, setHeartName] = useState("hearto");
    const [heartColor, setHeartColor] = useState("grey");
    const [spinAnim, setSpinAnim] = useState(new Animated.Value(0));
    const [iconPressed,setIconPressed] = useState(false);

    //点击动画
    const heartOpacity = heartOpacityAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.5, 1],
    });
    const spin = spinAnim.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: ['0deg', '15deg', '0deg', '-15deg', '0deg'],
    });

    function pressHeartIcon(isPressed) {
        Animated.parallel([
            Animated.timing(heartOpacityAnim, {
                toValue: isPressed ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(spinAnim, {
                toValue: isPressed ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        console.log('inner:'+isPressed);
        setHeartName(isPressed ? 'heart' : 'hearto');
        setHeartColor(isPressed ? '#FE007F' : 'grey');
    };



    return (
        <SafeAreaView>
            {/* Header */}
            <View style={{ height: 55, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Entypo size={20} name="chevron-thin-left" style={{ paddingLeft: 12, paddingRight: 20 }} />
                <Avatar rounded size={30} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 30, width: 30 }} />
                <Text style={{ fontSize: 18, paddingLeft: 15, width: windowSet.width * 0.4 }}>jun_anananan</Text>
                <View style={{ width: windowSet.width * 0.3 }}>
                    <Button backgroundColor="transparent" borderColor="#e5e6e8" borderWidth={1} borderRadius={20} height={28} alignSelf="flex-end">
                        <ButtonText size='sm' color="#a5a7af">关注</ButtonText>
                    </Button>
                </View>
            </View>
            {/* Content */}
            <ScrollView style={{ width: windowSet.width * 0.93, alignSelf: 'center', height: windowSet.height * 0.76 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                {/* BlogHeader:Title、Avatar */}
                <View>
                    <Avatar rounded size={60} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 60, width: 60 }} />
                </View>
                <RenderHtml contentWidth={windowSet.width * 0.9} source={example} tagsStyles={tagsStyles} />
                <Text style={{ color: 'grey', alignSelf: 'center' }}>—— 2023-12-30 09:40:22 ——</Text>
                <Divider my='$0.5' marginTop={20} backgroundColor="#f2f2f4" />
                {/* Comments */}
                <View>

                </View>
            </ScrollView>
            <View style={{}}>
                <Divider width={windowSet.width * 0.9} alignSelf="center" backgroundColor="#f2f2f4" />
                <View style={{ height: windowSet.height * 0.08, backgroundColor: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.bottomReadOnlyInput}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Icon size={15} name="edit" color={'grey'} />
                            <Text style={styles.bottomInputText}>说点什么...</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: windowSet.width * 0.6 }}>
                        <View style={styles.allIconArea}>
                            <TouchableOpacity activeOpacity={1} style={styles.bottomIconArea}
                                onPress={() => {
                                    setIconPressed(!iconPressed);
                                    setIconPressed(preState => {
                                        pressHeartIcon(preState);
                                        return preState;
                                    });
                                    //pressHeartIcon();
                                }}>
                                <AnimatedAntdIcon size={27} name={heartName} color={heartColor} style={{ transform: [{ rotate: spin }], opacity: heartOpacity}}/>
                                <Text style={styles.bottomIconText}>3万</Text>
                            </TouchableOpacity>
                            <View style={styles.bottomIconArea}>
                                <AnimatedAntdIcon name="star" color={'#ff8c00'} size={27}/>
                                <Text style={styles.bottomIconText}>1024</Text>
                            </View>
                            <View style={styles.bottomIconArea}>
                                <Icon size={27} name="message1" color={'grey'} />
                                <Text style={styles.bottomIconText}>50</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

//html样式
const tagsStyles = {
    p: {
        fontSize: 16,
        lineHeight: 25,
    },
    a: {
        color: '#ff4500',
        textDecorationLine: 'none'
    },
    ul: {
        fontSize: 16,
        lineHeight: 25,
    },
    ol: {
        fontSize: 16,
        lineHeight: 25,
    }
};

const styles = StyleSheet.create({
    bottomReadOnlyInput: {
        width: windowSet.width * 0.3,
        backgroundColor: '#f2f2f4',
        height: 33,
        alignSelf: 'center',
        marginLeft: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    bottomInputText: {
        lineHeight: 30,
        fontSize: 15,
        color: 'grey',
        paddingLeft: 5,
        fontWeight: '500'
    },
    allIconArea: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    bottomIconArea: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15
    },
    bottomIconText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'grey',
        paddingLeft: 4
    }
});
