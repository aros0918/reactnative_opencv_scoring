import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/core';

import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import {
  Camera,
  useFrameProcessor,
  useCameraDevices,
} from 'react-native-vision-camera';



const Home = ({navigation}) => {
  const isFocused = useIsFocused();     

  const dimensions = useWindowDimensions();
  const devices = useCameraDevices();
  const camera = useRef(null);
  const device = devices.back;
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status === 'authorized');
    };
    checkPermissions();
  }, []);

  if (device == null) {
    return null;
  }

  const takePicture = async () => {
    // setTakePicture(true);
    if(camera.current == null) return;
   
    const photo = await camera.current.takePhoto();

    console.log(photo.path, photo.width, photo.height);

    const imageURI = photo.path;


    navigation.push('ImageEdit', {path: imageURI});
    
  };

  
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <View style={{flex: 1, position: 'relative'}}>
        {device != null && permission == true ? (
          <>
            {isFocused && (
              <Camera                
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                ref={camera}
                photo={true}
                enableZoomGesture={true}
                focusable={true}
              />
            )}
          </>
        ) : (
          <Text></Text>
        )}    
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            alignItems: 'center',
          }}>
          <TouchableHighlight
            style={{
              width: 50,
              height: 50,
              backgroundColor: 'white',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={takePicture}>
            <View
              style={{
                backgroundColor: 'red',
                width: 40,
                height: 40,
                borderRadius: 50,
              }}></View>
          </TouchableHighlight>
        </View>
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
export default Home;
