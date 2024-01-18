import { StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login';
import Test from './screens/Test';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Login></Login> */}
      <Test></Test>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
