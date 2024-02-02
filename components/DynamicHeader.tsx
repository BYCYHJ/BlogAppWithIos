import * as React from 'react';
import { Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, ButtonText } from '@gluestack-ui/themed';
import { Avatar } from '@rneui/base';
import { SpeedDial } from '@rneui/themed';
import Entryo from 'react-native-vector-icons/Entypo';

const windowSet = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const DynamicHeader = ({ animateHeaderValue }) => {
  const Max_Header_Height = 300;
  const Min_Header_Height = 85;
  const Scroll_Distance = Max_Header_Height - Min_Header_Height;
  const AvatarImg = require("../screens/logo.png");

  const Header = ({ scrollOffsetY }) => {
    return null
  };

  const AnimatedHeaderHeight = animateHeaderValue.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Max_Header_Height, Min_Header_Height],
    extrapolate: 'clamp'
  });

  const animateHeaderBackgroundColor = animateHeaderValue.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ['blue', 'red'],
    extrapolate: 'clamp'
  })

  return (
    <AnimatedLinearGradient colors={['#424a73', '#64677d', '#707381']}
      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      style={{ width: '100%', height: AnimatedHeaderHeight, marginTop: -50 }}>
      <Box height={50}></Box>
      <View style={{ height: 40 }}>
        <Entryo name='list' size={30} color={'white'} style={{ paddingLeft: windowSet.width * 0.85 }} />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={{ width: 20 }} />
        <Avatar rounded size={100} source={AvatarImg} avatarStyle={{ resizeMode: 'stretch', height: 100, width: 100 }} />
        <View style={{ paddingLeft: 25, paddingTop: 25 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 25 }}>Jun-Anananan</Text>
          <Text style={{ color: '#c4c5cb', paddingTop: 10, fontSize: 12 }}>用户id: 18895729806 🪧</Text>
        </View>
      </View>
      <View style={{ paddingTop: 10, paddingLeft: 25 }}>
        <Text style={{ color: 'white', width: windowSet.width * 0.85, height: windowSet.height * 0.04 }}>For the sake of that distant place, you have to work hard.</Text>
        <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.countText}>0</Text>
            <Text style={styles.countText}>关注</Text>
          </View>
          <View style={{ paddingLeft: 20, alignItems: 'center' }}>
            <Text style={styles.countText}>0</Text>
            <Text style={styles.countText}>粉丝</Text>
          </View>
          <View style={{ paddingLeft: 20, alignItems: 'center' }}>
            <Text style={styles.countText}>0</Text>
            <Text style={styles.countText}>获赞与收藏</Text>
          </View>
          <View style={{paddingLeft:90,alignSelf:'center'}}>
            <Button height={30} backgroundColor='#7f818d' borderColor='white' borderWidth={1} borderRadius={120}>
              <ButtonText fontWeight='400' fontSize={15}>编辑资料</ButtonText>
            </Button>
          </View>
        </View>
      </View>
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
  countText:{
    color:'white',
    fontSize:13
  }
});