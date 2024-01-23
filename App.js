import { StyleSheet, View } from 'react-native';
import Login from './screens/Login';
import Test from './screens/Test';
import RootStack from './RootStack';
import BlogList from './screens/BlogList';
import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import BasicTabBarExample from './screens/TabTest';


export default function App() {
  return (
    // <NativeBaseProvider initialWindowMetrics={inset}>
    //   {/* <BlogList/> */}
    //   {/* <Login></Login> */}
    //   <Test></Test>
    // </NativeBaseProvider>
    <GluestackUIProvider config={config}>
      <BasicTabBarExample/>
    </GluestackUIProvider>

    // <RootStack></RootStack>
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
