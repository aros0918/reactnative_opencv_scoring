import React, {useEffect, useState, useRef} from 'react';

import {Table, Row, Rows} from 'react-native-table-component';

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

import type { BlockStruct } from '@scribelabsai/amazon-trp';

import type { Line } from '@scribelabsai/amazon-trp';

import { decode } from 'base64-js';
import {Buffer} from "buffer"
const _ = require("lodash");

var RNFS = require('react-native-fs');
const photoName = 'pasta-1.jpg'; 


const Detail = ({ navigation, route }: { navigation: any, route: any }) => {
  const [ocr, setOcr] = useState<Document>(null);
  const [ocr1, setOcr1] = useState<{ [key: string]: string } | null>(null);
  const [err, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [val_c1, setval_c1] = useState('Initial Value');

  const [NameValue, setNameValue] = useState('');
  const [CodeValue, setCodeValue] = useState('');

  const [tableData2, setTableData2] = useState<Array<string[]>>([
    ["RANGE OF 100 BOOKLETS", "RANGE OF 50 BOOKLETS", "RANGE OF 25 BOOKLETS", "RANGE OF 10 BOOKLETS"],
    ["", "", "", ""],
  ]);
  
  // const tableData: Array<Array<string>> = [
  const [tableData, setTableData] = useState<Array<string[]>>([    
    ["S/N", "Name of Candidate", "Party Initials", "Votes Obtained(Figures)", "Votes Obtained(WORDS)"],
    ["1", "", "", "", ""],
    ["2", "", "", "", ""],
    ["3", "", "", "", ""],
    ["4", "", "", "", ""],
    ["5", "", "", "", ""],
    ["6", "", "", "", ""],
    ["7", "", "", "", ""],
    ["8", "", "", "", ""],
    ["A", "TOTAL VALID BALLOTSS", "", "", ""],
    ["B", "TOTAL REJECTED BALLOTS(FROM D ABOVE)", "", "", ""],
    ["C", "TOTAL VOTES CAST", "", "", ""],

  ]);
  const [tableData5, setTableData5] = useState(["","","","","","","",""]);
  const [tableData3, setTableData3] = useState([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [tableData1, setTableData1] = useState<Array<string[]>>([    
    ["S/N", "Name of Candidate", "NAME OF PARTY OR CANDIATE", "SIGNATURE", "REASON, IF REFUESED TO SIGN"],
    ["1", "", "", "", ""],
    ["2", "", "", "", ""],
    ["3", "", "", "", ""],
    ["4", "", "", "", ""],
    ["5", "", "", "", ""],
    ["6", "", "", "", ""],
    ["7", "", "", "", ""],
    ["8", "", "", "", ""],

  ]);

  const handleNameChange = (text:any) => {
    setNameValue(text);
  };

  const handleCodeChange = (text:any) => {
    setCodeValue(text);
  };

  
  const handleSubmit = () => {
    // Implement your code to submit the `textInputValue` to the server here
  
    // Example using fetch:
   
  };

  const handleTableData2 = (newValue, rowIndex, colIndex) => {
    // Implement your code to submit the `textInputValue` to the server here
  
    const newData: Array<string[]> = [...tableData2];
    console.log(rowIndex);
    console.log(colIndex);

    newData[rowIndex][colIndex] = newValue;
    setTableData2(newData);

    console.log(tableData2);
    // Example using fetch:
  };
  
  const getData = async (path:any) => {
    // console.log(path);
    console.log("mother");
    console.log(path);

    try{

      fetch('http://ec2-52-90-105-94.compute-1.amazonaws.com:443/detail/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PSCode: path }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setCodeValue(data.PSCode);
          setNameValue(data.PSName);
          setTableData2(data.TableData2);
          setTableData1(data.TableData1);
          setTableData3(data.TableData3);
          setTableData(data.TableData);
          setTableData5(data.TableData5);

          setError(false);
          setLoading(false);       
        })
        .catch((error) => {
          console.error(error);
          // Handle error if request fails
        });
      // doc.pages.forEach((p) => {
      //   p.tables.forEach((t) => {
      //       t.rows.forEach((r) => {
      //         r.cells.forEach((c) =>{
      //           console.log(c.toString());
      //           console.log(" ");
      //         })
      //         console.log(" ");
      //       });
      //       console.log(t.toString());
      //   });
      // });
      
    
    }
    catch {
        // console.log('err');
        setError(true);
      }
  };
  useEffect(() => {
    //  console.log(route.params.path);
    getData(route.params.path);
  }, []);
  useEffect(() => {
    console.log("fool");
    console.log(tableData2);
  }, [tableData2]);
  // console.log(res.status, res.data.message, res.data.data);
  const tableData_temp = [];

  // const tableData2: Array<Array<string>> = [
  //   ["RANGE OF 100 BOOKLETS", "RANGE OF 50 BOOKLETS", "RANGE OF 25 BOOKLETS", "RANGE OF 10 BOOKLETS"],
  //   ["", "", "", ""],

  // ];

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

  return (
    <>
      {loading != true && (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'rgb(252, 232, 243)',
            overflow: 'scroll',
          }}

        >
          <View style={styles1.container}>
            <Text style={styles1.text}>
              Analyzed Result
            </Text>
          </View>

      

          {/* {tableData_temp?.map((table, index) => (
            <Table key={index} borderStyle={styles.tableBorder}>
              {table.map((rowData, rowIndex) => (
                <Row
                  key={rowIndex}
                  data={rowData}
                  style={rowIndex === 0 ? styles.firstRow : styles.row}
                  textStyle={styles.text}
                />
              ))}
            </Table>
            
          ))} */}


      

<View style={styles1.container}>
            <Text style={styles1.text1}>
              Public Election Regulations,2020
            </Text>
            <Text style={styles1.text1}>
              Form Eight A.
            </Text>
            <Text style={styles1.text1}>
              (regulation32(7) and 39(2))
            </Text>
            <Text style={styles1.big}>
              Statement of Poll for the office of Member of Parliament
            </Text>
          </View>

          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>Polling Station Name</Text>
            </View>
            <View style={styles1.rightContainer}>
              {/* <Text>{NameValue}</Text> */}
              <TextInput value={NameValue} onChangeText={handleNameChange} style={styles1.editBox} />
            </View>
          </View>
          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>Polling Station Code</Text>
            </View>
            <View style={styles1.rightContainer}>
              <TextInput value={CodeValue} onChangeText={handleCodeChange} style={styles1.editBox} />
            </View>
          </View>

          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>A. BALLOT INFORMATION (TO be filled in at START of poll)</Text>
            </View>
          </View>



          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>1.What is the total number of Ballots issued to this polling station?</Text>
            </View>
            <Text>A1</Text>
            <TextInput value={tableData5[6]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,6)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>2.What is the range of serial numbers of the ballot papers issued to the polling station?</Text>
            </View>
            <Text>A2</Text>
            <TextInput value={tableData5[7]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,7)}/>            
          </View>


          <View style={styles1.container}>
          {tableData2.map((rowData, rowIndex) => (
            <View key={rowIndex} style={styles_table.row}>
              {rowData.map((cellData, columnIndex) => (
                <View
                  key={columnIndex}
                  style={[
                    styles_table.cell,
                    columnIndex === 0 ? { flex: 1 } : 
                    columnIndex === 1 ? { flex: 1 } : 
                    columnIndex === 2 ? { flex: 1 } : 
                    { flex: 1 },
                    // (rowIndex === 6 && (columnIndex === 1 || columnIndex === 2 || columnIndex === 3)) && {
                    //   borderWidth:  0, // Only hide the right border of the second column
                    // },
                    // (rowIndex === 6 && (columnIndex === 1 || columnIndex === 2 || columnIndex === 3)) && {
                    //   borderRightWidth:  0, // Only hide the right border of the second column
                    // },
                  ]}
                >
                  {rowIndex === 0 ? (
                  <Text style={styles_table.cellText}>
                  {Array.isArray(cellData) ? cellData.join(' ') : cellData}
                </Text>

                  ):(
                    <TextInput value={Array.isArray(cellData) ? cellData.join(' ') : cellData} style={styles_table.cellText} multiline={true} onChangeText={(text) => handleTableData2(text,rowIndex,columnIndex)}/>            
                  )
                  }      

                </View>
              ))}
            </View>
          ))}
          </View>

          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>B.INFORMATION ABOUT THE REGISTER AND OTHER LISTS AT THE POLLING STATION</Text>
            </View>
          </View>
          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>1.What is the number of voters on the polling station register</Text>
            </View>
            <Text>B1</Text>
            <TextInput  value={tableData5[0]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,0)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>2.What is the number of voters on the Proxy Voters List?</Text>
            </View>
            <Text>B2</Text>
            <TextInput value={tableData5[1]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,1)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>3.What is the number of voters on the Absentee Voters List?</Text>
            </View>
            <Text>B3</Text>
            <TextInput value={tableData5[2]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,2)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftspContainer}>
              <Text style={styles1.small}>4.What is the serial number of the 1st BVD?</Text>
            </View>
            <TextInput value={tableData5[3]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,3)}/>            
          </View>
          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>The serial number of the 2nd BVD</Text>
            </View>

            <TextInput value={tableData5[4]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,4)}/>            

          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>Validating Stamp No.</Text>
            </View>

            <TextInput value={tableData5[5]} style={styles1.editBox_border} onChangeText={(text) => handleTableData5(text,5)}/>            

          </View>


          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>C.BALLOT ACCOUNTING (To be filled in at the END of the poll before counting commences)</Text>
            </View>
          </View>
          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>
                1.What is the number of ballots issued to voters on the polling station register?
              </Text>
            </View>
            <Text>C1</Text>
            <TextInput value={tableData3[0]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,0)}/>             
            
          </View>

        
          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>2.What is the number of ballots issued to voters on the Proxy Voters List?</Text>
            </View>
            <Text>C2</Text>
            <TextInput value={tableData3[1]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,1)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>3.What is the Total numbers of SPOILT ballots</Text>
            </View>
            <Text>C3</Text>
            <TextInput value={tableData3[2]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,2)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>4.What is the Total number of UNUSED ballots</Text>
            </View>
            <Text>C4</Text>
            <TextInput value={tableData3[3]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,3)}/>            
          </View>
          <View style={styles1.container_small}>
            <View style={styles1.leftspContainer}>
              <Text style={styles1.small}>5. Sum up (C1 + C2 + C3 + C4) (This number should equal A.1 above)</Text>
            </View>
            <Text>C5</Text>
            <TextInput value={tableData3[4]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,4)}/>            
          </View>

          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>What is the total number of Persons Manually Verified </Text>
            </View>
            <Text>C6</Text>
            <TextInput value={tableData3[5]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,5)}/>            
          </View>

          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>D.REJECTED BALLOT REPORT (To be filled at the END of the poll after the counting is completed)</Text>
            </View>
          </View>
          <View style={styles1.container_small}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.small}>1.What is the TOTAL number of Rejected Ballots?</Text>
            </View>
            <Text>D</Text>
            <TextInput value={tableData3[6]} style={styles1.editBox_border} onChangeText={(text) => handleTableData3(text,6)}/>            
          </View>

          <View style={styles1.container}>
            <Text style={styles1.big1}>
              PARLIAMENTRAY ELECTION - POLLING STATION RESULTS FORM
            </Text>
          </View>

          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>Polling Station Name</Text>
            </View>
            <View style={styles1.rightContainer}>
              <TextInput value={NameValue} onChangeText={handleNameChange} style={styles1.editBox} />
            </View>
          </View>
          <View style={styles1.container_polly}>
            <View style={styles1.leftContainer}>
              <Text style={styles1.normal}>Polling Station Code</Text>
            </View>
            <View style={styles1.rightContainer}>
              <TextInput value={CodeValue} onChangeText={handleCodeChange} style={styles1.editBox} />
            </View>
          </View>



          <View style={styles1.container}>
          {tableData.map((rowData, rowIndex) => (
            <View key={rowIndex} style={styles_table.row}>
              {rowData.map((cellData, columnIndex) => (
                <View
                  key={columnIndex}
                  style={[
                    styles_table.cell,
                    columnIndex === 0 ? { flex: 2 } : 
                    columnIndex === 1 ? { flex: 15 } : 
                    columnIndex === 2 ? { flex: 6 } : 
                    columnIndex === 3 ? { flex: 8 } : 
                    { flex: 15 },
                    // (rowIndex === 6 && (columnIndex === 1 || columnIndex === 2 || columnIndex === 3)) && {
                    //   borderWidth:  0, // Only hide the right border of the second column
                    // },
                    // (rowIndex === 6 && (columnIndex === 1 || columnIndex === 2 || columnIndex === 3)) && {
                    //   borderRightWidth:  0, // Only hide the right border of the second column
                    // },
                  ]}
                >
                   {rowIndex === 0 ? (
                  <Text style={styles_table.cellText}>
                  {Array.isArray(cellData) ? cellData.join(' ') : cellData}
                </Text>

                  ):(
                    <TextInput value={Array.isArray(cellData) ? cellData.join(' ') : cellData} style={styles_table.cellText} multiline={true} onChangeText={(text) => handleTableData(text,rowIndex,columnIndex)}/>            
                  )
                  }      

                </View>
              ))}
            </View>
          ))}
          </View>

          <View style={styles1.container}>
            <Text style={styles1.big1}>
              DECLARATION
            </Text>
          </View>

          <View style={styles1.container}>
            <Text style={styles1.small1}>
              We, the undesigned, do hereby declare that the results shown above are true and accurate account of the ballot in this polling station
            </Text>
          </View>

          <View style={styles1.container}>
          {tableData1.map((rowData, rowIndex) => (
            <View key={rowIndex} style={styles_table.row}>
              {rowData.map((cellData, columnIndex) => (
                <View
                  key={columnIndex}
                  style={[
                    styles_table.cell,
                    columnIndex === 0 ? { flex: 1 } : 
                    columnIndex === 1 ? { flex: 6 } : 
                    columnIndex === 2 ? { flex: 6 } : 
                    columnIndex === 3 ? { flex: 5 } : 
                    { flex: 6 },

                  ]}
                >
                  {rowIndex === 0 ? (
                  <Text style={styles_table.cellText}>
                  {Array.isArray(cellData) ? cellData.join(' ') : cellData}
                </Text>

                  ):(
                    <TextInput value={Array.isArray(cellData) ? cellData.join(' ') : cellData} style={styles_table.cellText} multiline={true} onChangeText={(text) => handleTableData1(text,rowIndex,columnIndex)}/>            
                  )
                  }      

                </View>
              ))}
            </View>
          ))}
          </View>
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
            opacity: 0.5,
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
export default Detail;


