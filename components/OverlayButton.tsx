import { View,StyleSheet } from "react-native";

export default function OverlayButton(){
    return(
        <View style={styles.container}>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      width: 60,
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"grey"
    },
  });