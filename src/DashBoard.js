import React, {useEffect, useState, useRef} from 'react';
// import {useIsFocused} from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome';

import {launchImageLibrary} from 'react-native-image-picker';
import {
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import {
  Camera,
  useFrameProcessor,
  useCameraDevices,
} from 'react-native-vision-camera';

const Dashboard = ({navigation}) => {
  // const isFocused = useIsFocused();     
  const [resource,setResource] = useState("");
  // const dimensions = useWindowDimensions();
  // const devices = useCameraDevices();
  // const camera = useRef(null);
  // const device = devices.back;
  // const [permission, setPermission] = useState(false);

  // useEffect(() => {
  //   const checkPermissions = async () => {
  //     const status = await Camera.requestCameraPermission();
  //     setPermission(status === 'authorized');
  //   };
  //   checkPermissions();
  // }, []);
  // if (device == null) {
  //   return null;
  // }
  // const takePicture = async () => {
  //   // setTakePicture(true);
  //   if(camera.current == null) return;
  //   const photo = await camera.current.takePhoto();
  //   console.log(photo.path, photo.width, photo.height);
  //   const imageURI = photo.path;

  //   navigation.push('ImageEdit', {path: imageURI});
    
  // };

  const changePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, (response) => {
      if(!response.didCancel)
      {
      var str=response.assets[0].uri;
      str.replace(/[file:///]/g,'')
      navigation.push('ImageEdit', { path: str});
      }
    });
  };
    // ImagePicker.launchImageLibrary(options, response => {
    //   //console.log('Response = ', response);

    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {z
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     const image = response.uri;
    //     console.log('image', image);
    //     // You can also display the image using data:
    //     // const source = {uri: 'data:image/jpeg;base64,' + response.data};
    //     const source = {uri: response.data};
    //     // onImagePicked(source.uri);
    //   }


  return (
    <View style={{flex: 1, position: 'relative'}}>
      <View style={{flex: 1, position: 'relative'}}>
      <TouchableOpacity>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSofnotGYgIHp-eaoxLJ4IsW82bO0tbdxJwjPK1hkLUZlZ3TSIiNeEIWVp5h3egTxjgwD8&usqp=CAU' }}
          style={{ width: 350, height: 350, margin:30, marginBottom: 10 }}
        />
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Welcome to the Election App!
        </Text>
        {/* <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 10 }}>
          This app provides real-time information about Election's Results.
        </Text> */}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 32,
          width: 160,
          height: 45,
          backgroundColor: 'lightseagreen',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
        }}
        onPress={() => {
          navigation.push('Home');
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 152,
          width: 160,
          height: 45,
          backgroundColor: 'green',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
        }}
        onPress={() => {
          navigation.push('ViewResults');
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>View Results</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 92,
          width: 160,
          height: 45,
          backgroundColor: 'lightseagreen',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
        }}
        onPress={changePhoto}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Pick a Image</Text>
      </TouchableOpacity>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  text: {
    fontSize: 10,
  },
  red: {
    color: '#0000aa',
    fontSize: 12,
  },
});
export default Dashboard;
