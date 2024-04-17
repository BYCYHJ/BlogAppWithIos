import { StyleSheet, View } from 'react-native';
import Login from './screens/Login';
import RootStack from './RootStack';
// import BlogList from './screens/BlogList';
import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
// import Home from './screens/Home';
// import ReadOnlyBlog from './screens/BlogDetail';
// import BlogChat from './screens/BlogChat';
import MyInfo from './screens/MyInfo';
import './constant';
import UpdateAvatar from './components/UpdateAvatar';
import Home from './screens/Home';
import BlogEditor from './screens/BlogEditor';
import Test from './screens/Test';
import OtherInfo from './screens/OtherInfo';



export default function App() {
  return (
    <GluestackUIProvider config={config}>
      {/* <Home></Home> */}
      {/* <ReadOnlyBlog/> */}
      {/* <RootStack/> */}
      {/* <UpdateAvatar/> */}
      {/* <BlogChat/> */}
      {/* <MyInfo/> */}
      {/* <BlogEditor/> */}
      {/* <Test/> */}
      <OtherInfo/>
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
