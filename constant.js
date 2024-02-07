import { Dimensions } from "react-native";

global.gwidth = Dimensions.get('window').width;
global.gheight = Dimensions.get('window').height;

global.windowSet={
    height:gheight,
    width:gwidth
}