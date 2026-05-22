import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/app/store';
import { hideMessage } from './src/app/features/messageSlice';
import CustomMessage from './src/components/CustomMessage';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

const GlobalMessageWrapper = () => {
  const { visible, text, type } = useSelector(state => state.message);
  console.log(visible, text, type, 'message++++++++++++++++++++')
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App Connected to Metro - Bundle Loaded!');
    // Yeh log-android mein dikhega
  }, []);

  return (
    <>
      <RootNavigator />
      <CustomMessage
        visible={visible}
        text={text}
        type={type}
        onHide={() => dispatch(hideMessage())}
      />
    </>
  );
};

function App() {

  return (
    <SafeAreaProvider >
      <StatusBar barStyle="dark-content" />
      <Provider store={store} >
        <NavigationContainer style={{ backgroundColor: '#F9FAFB' }}>
          <GlobalMessageWrapper />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
