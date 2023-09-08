import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Home';
import ImageEdit from './src/ImageEdit';
import DashBoard from './src/DashBoard';
import OCR from './src/OCRView';
import Detail from './src/Detail'
import {LogBox} from 'react-native'
import ViewResults from './src/ViewResults'
LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell']);
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DashBoard">
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="DashBoard"
          component={DashBoard}
        />
        <Stack.Screen
          name="ImageEdit"
          component={ImageEdit}
          options={{
            title: 'ImageEdit',
            headerStyle: {
              backgroundColor: '#2288ee',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ViewResults"
          component={ViewResults}
          options={{
            title: 'ViewResults',
            headerStyle: {
              backgroundColor: '#2288ee',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="OCR"
          component={OCR}
          options={{
            title: 'OCR',
            headerStyle: {
              backgroundColor: '#2288ee',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{
            title: 'Detail',
            headerStyle: {
              backgroundColor: '#2288ee',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell']);