import React, {useEffect, useState, useRef} from 'react';

import {Table, Row, Rows} from 'react-native-table-component';
import {Alert} from 'react-native';

import axios from 'axios';

import {
  ScrollView,
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Storage } from 'aws-amplify';
import { RNS3 } from 'react-native-aws3';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { ComputeOptimizer, S3, Textract } from 'aws-sdk';
import { TextractClient, GetDocumentAnalysisCommand } from '@aws-sdk/client-textract';
import { Document } from '@scribelabsai/amazon-trp';
import { Word } from '@scribelabsai/amazon-trp';
// import cv from 'react-native-opencv3';
import {Image} from 'react-native';
import type { BlockStruct } from '@scribelabsai/amazon-trp';

import type { Line } from '@scribelabsai/amazon-trp';


import {Buffer} from "buffer"
const _ = require("lodash");

var RNFS = require('react-native-fs');
const photoName = 'pasta-1.jpg'; 

const getTextractAnalysis1 = async (imageURI:any, callbackTract?: (result: []) => void) => {
  // console.log('asd');
  // console.log("reture:");

}



const OCR = ({ navigation, route }: { navigation: any, route: any }) => {
  const [ocr, setOcr] = useState<Document>(null);
  const [ocr1, setOcr1] = useState<{ [key: string]: string } | null>(null);
  const [err, setError] = useState(false);
  const [loading, setLoading] = useState(true);


  const [imageURI, setImageURI] = useState("file://"+route.params.path);

  // const processImage = async () => {
  //   let img = await cv.imread(imageURI);
  //   let gray = await cv.cvtColor(img, cv.COLOR_BGR2GRAY);
  //   let thresh_for_black_dots = await cv.threshold(gray, 100, 255, cv.THRESH_BINARY_INV)[1];
  //   let thresh_for_white_dots = await cv.threshold(gray, 200, 255, cv.THRESH_BINARY)[1];

  //   let cnts_for_black_dots = await cv.findContours(thresh_for_black_dots, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  //   let cnts_for_white_dots = await cv.findContours(thresh_for_white_dots, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  //   let black_dots = [];
  //   let white_dots = [];

  //   await processContours(cnts_for_white_dots, img, white_dots);
  //   await processContours(cnts_for_black_dots, img, black_dots);

  //   console.log("Black Dots Count is:", black_dots.length);
  //   console.log("White Dots count is:", white_dots.length);

  //   setImageURI(await cv.imshow(img));
  //   setLoading(false);
  // };

  // const processContours = async (contours, img, dotsList) => {
  //   for (let i = 0; i < contours.length; i++) {
  //     let area = await cv.contourArea(contours[i]);
  //     if (area > 1) {
  //       await cv.drawContours(img, contours, i, (36, 255, 12), 2);
  //       dotsList.push(contours[i]);
  //     }
  //   }
  // };

  // const getData = async (path:any) => {
  //   try{

  //       const blocks = await getTextractAnalysis("file://"+path, (doc)=>{
  //         //  console.log(doc);
  //       getTextractAnalysis1("file://"+path,(doc)=>{        
  //       setOcr1(doc);

  //       })
  //          setOcr(doc);
  //       });

    
  //   }
  //   catch {
  //       // console.log('err');
  //       setError(true);
  //     }
  // };
  useEffect(() => {
    console.log(route.params.path);
    getData(route.params.path);
  }, []);
  // console.log(res.status, res.data.message, res.data.data);
  const tableData_temp = [];

  if (err == true)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something went wrong while interacting OCR APIs.</Text>
        <Button
          title="back"
          onPress={() => {
            setError(false);
            //setProcess(false);
          }}></Button>
      </View>
    );

    useEffect(() => {
      processImage().catch(console.error);
    }, []);
  

  return (
    <>
      {loading != true && (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'rgb(252, 232, 243)',
            overflow: 'scroll',
          }}>
          <View style={styles1.container}>
            <Text style={styles1.text}>
              Analyzed Result
            </Text>
          </View>

  

          <Image source={{uri: imageURI}} />
          
        </ScrollView>
      )}

      
      {loading && (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'absolute',
            backgroundColor: 'white',
            justifyContent: 'center',
            opacity: 0.8,
          }}>
          <ActivityIndicator size="large" />
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>Processing ..</Text>
          </View>
        </View>
      )}

    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 50,
//   },
//   text: {
//     fontSize: 10,
//   },
//   red: {
//     color: '#0000aa',
//     fontSize: 12,
//   },
// });
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  tableBorder: { borderWidth: 2, borderColor: '#c8e1ff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
  row: { height: 80, backgroundColor: '#f1f8ff' },
  firstRow: {height: 80, backgroundColor: '#21f8ff' }
});
const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  container_polly: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  container_small: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  text: {
    color: 'green',
    fontSize: 24,
    alignItems: 'center',
  },
  editBox_border:
  {
    borderWidth: 1,
    borderColor: 'black',
    padding: 1,
    fontSize: 15,
    width: 50,
  },
  big: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  big1: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  small1: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
   leftContainer: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  leftspContainer:{
    flex: 1,
    marginLeft: 2,
    marginRight: 18,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 30,
  },
  normal: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  small: {
    fontSize: 15,
    textAlign: 'center',
  },
  editBox: {
    borderBottomWidth: 2,
    borderColor: 'black',
    padding: 1,
    fontSize: 15,
  },

  
});

const styles_table = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 1,
  },
  cellText: {
    textAlign: 'center',
  },
});
export default OCR;


