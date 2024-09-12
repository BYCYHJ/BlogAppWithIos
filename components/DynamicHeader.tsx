import * as React from 'react';
import { Text, View, StyleSheet, Animated, Dimensions, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, ButtonText } from '@gluestack-ui/themed';
import { Avatar } from '@rneui/base';
import { SpeedDial } from '@rneui/themed';
import Entryo from 'react-native-vector-icons/Entypo';
import { getUniqueUserInfo } from '../services/services';
import Ionicons from "react-native-vector-icons/Ionicons";

const windowSet = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const DynamicHeader = ({ animateHeaderValue, pressAvatar, openMenu }) => {
  const Max_Header_Height = 320;
  const Min_Header_Height = 180;
  const Scroll_Distance = Max_Header_Height - Min_Header_Height;
  const userInfo = getUniqueUserInfo();
  const AvatarImg = userInfo && userInfo.avatarUrl != null && userInfo.avatarUrl != "" ? { uri: userInfo.avatarUrl } : require("../screens/logo.png");

  const Header = ({ scrollOffsetY }) => {
    return null
  };

  const AnimatedHeaderHeight = animateHeaderValue.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Max_Header_Height, Min_Header_Height],
    extrapolate: 'clamp'
  });

  return (
    <AnimatedLinearGradient colors={['#424a73', '#64677d', '#707381']}
      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      style={{ width: '100%', height: AnimatedHeaderHeight }}>
      <SafeAreaView>
        {/* 列表Icon */}
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ height: 40, paddingRight: 10 }}>
            <Entryo name='list' size={30} color={'white'} style={{}} onPress={openMenu} />
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {/* 头像 */}
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <View style={{ paddingLeft: 20 }} />
            <Avatar rounded size={100} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 100, width: 100 }} onPress={pressAvatar} />
          </View>
          {/* 个人信息 */}
          <View style={{ paddingTop: 25, flex: 4 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 25, paddingLeft: 10 }}>{userInfo.userName}</Text>
            <Text style={{ color: '#c4c5cb', paddingTop: 10, fontSize: 12, width: 200, paddingLeft: 10 }}>
              用户id: {userInfo.userId} <Ionicons name="qr-code" size={10} />
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 10, width: windowSet.width * 0.95, alignSelf: 'center' }}>
          <Text style={{ color: 'white', width: windowSet.width * 0.9, height: windowSet.height * 0.04, alignSelf: 'center' }}>For the sake of that distant place, you have to work hard.</Text>
          <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }}>
            <View style={{ flex: 2, flexDirection: 'row', paddingLeft: 10 }}>
              <View style={{ flex: 2, alignItems: 'flex-start' }}>
                <View>
                  <Text style={styles.countText}>0</Text>
                  <Text style={styles.countText}>关注</Text>
                </View>
              </View>
              <View style={{ flex: 2, alignItems: 'flex-start' }}>
                <View>
                  <Text style={styles.countText}>0</Text>
                  <Text style={styles.countText}>粉丝</Text>
                </View>
              </View>
              <View style={{ flex: 3, alignItems: 'flex-start' }}>
                <View>
                  <Text style={styles.countText}>0</Text>
                  <Text style={styles.countText}>获赞与收藏</Text>
                </View>
              </View>
              <View style={{ flex: 4 }} />
            </View>
            <View style={{ alignSelf: 'center', flex: 1 }}>
              <Button height={30} backgroundColor='#7f818d' borderColor='white' borderWidth={1} borderRadius={120}>
                <ButtonText fontWeight='400' fontSize={15}>编辑资料</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </AnimatedLinearGradient>
  );
};

export default DynamicHeader;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  countText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center'
  }
});