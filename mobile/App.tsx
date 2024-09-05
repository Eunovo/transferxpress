/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigationStack } from './src/navigation';
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FlashMessage from 'react-native-flash-message';
import { CustomFlashbar } from '@/_components/Flashbar';

// create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 300000,
    },
  },
})
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const flashbarRef = useRef<FlashMessage | null>(null);
  return (
    <View style={{flex: 1}} className='bg-white' >
      <QueryClientProvider client={queryClient}>
       <Provider store={store}>
       <PersistGate persistor={persistor}>
      <NavigationContainer>
<MainNavigationStack/>
      </NavigationContainer>
      </PersistGate>
      </Provider>
      </QueryClientProvider>
      <FlashMessage
                ref={flashbarRef}
                MessageComponent={CustomFlashbar}
              />
    </View>
  );
}
export default App;
