import React, {useEffect, useState, useRef} from 'react';

import {Table, Row, Rows } from 'react-native-table-component';

import {TouchableHighlight} from 'react-native';
import axios from 'axios';

import SelectDropdown from 'react-native-select-dropdown'
import {SafeAreaView, StatusBar, Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const {width} = Dimensions.get('window');

import {
  ScrollView,
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';



const ViewResults = ({navigation}) => {
  const [ocr, setOcr] = useState<Document>(null);
  const [err, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // const [tableData, setTableData] = useState<string[][]>([]);
  const [tableData, setTableData] = useState<Array<string>>([]);  
  const [PSName, setPSName] = useState<Array<string>>([]);  
  const [region, setRegion] = useState<Array<string>>([]);
  const [district, setDistrict] = useState<Array<string>>([]);
  const [constituency, setConstituency] = useState<Array<string>>([]);
  const [winner,setWinner] = useState<Array<string>>([]);

  const table_header = ["PSCode","PSName","Region","District","Constituency","Winner","detail"]

  const [countries, setCountries] = useState([]);
  const [CountrySel, SetCountrySel] = useState("");
  const [SearchRegion, SetSearchRegion] = useState([]);
  const [RegionSel, SetRegionSel] = useState("");
  const [SearchDistrict, SetSearchDistrict] = useState([]);
  const [DistrictSel, SetDistrictSel] = useState("");

  const [SearchContituency, SetSearchContituency] = useState([]);
  const [ContituencySel, SetContituencySel] = useState("");

  const [currentPage,setCurrentPage] = useState(1);
  const citiesDropdownRef = useRef();

  const [filterstatus,SetFilterStatus] = useState(0);
  const Get_Country = async () => {
   
    const apiUrl="http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_country/";

  

    axios.post(apiUrl)
      .then(response => {
        const data=response.data;

        setCountries(data);  
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const Get_Region = async () => {
   
    // const apiUrl="http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_Region/";

    // console.log(CountrySel);

    fetch('http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_Region/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Country:  CountrySel}),
      })
      .then((response) => response.json())
      .then((data) => {

        SetSearchRegion(data);  
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const Get_District = async () => {
   
    // const apiUrl="http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_Region/";

    // console.log(CountrySel);

    fetch('http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_District/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Region:  RegionSel}),
      })
      .then((response) => response.json())
      .then((data) => {

        SetSearchDistrict(data);  
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const Get_Constituency = async () => {
   
    // const apiUrl="http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_Region/";

    // console.log(CountrySel);

    fetch('http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search_Constituency/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Region:  RegionSel}),
      })
      .then((response) => response.json())
      .then((data) => {

        SetSearchContituency(data);  
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {

    Get_Country();
  }, []);
  useEffect(() => {
    Get_Region();
  }, [CountrySel]);


  useEffect(() => {
    Get_District();
    Get_Constituency();
  }, [RegionSel]);

  const getData = async (nextPage) => {

      fetch('http://ec2-52-90-105-94.compute-1.amazonaws.com:443/read/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Page:  nextPage}),
        })
        .then((response) => response.json())
        .then((data) => {

            data.forEach((item) => {
              //  console.log(item.PSCode);
              
               setTableData((prevState) => [...prevState, item.PSCode?item.PSCode: ""]);
               setPSName((prevState) => [...prevState, item.PSName?item.PSName: ""]);
               setRegion((prevState) => [...prevState, item.Region?item.Region: ""]);
               setDistrict((prevState) => [...prevState, item.District?item.District: ""]);
               setConstituency((prevState) => [...prevState, item.Constituency?item.Constituency: ""]);
               setWinner((prevState) => [...prevState, item.Winner?item.Winner: ""]);
               
              // setPsCode(prevPsCode => {
              //   const updatedPsCode = [...prevPsCode];
              //   updatedPsCode[index] = item.PSCode;
              //   return updatedPsCode;
              // });

              // console.log(tableData);              
              // console.log(psCode) ;  
                // console.log(item.PSCode);
                // console.log(item.PSName);
                // console.log(item.TableData2);
                
                // console.log(psCode);
                // const newData1: Array<string> = [...psName];
                // newData1[index] = item.PSName;
                // setPsName(newData1);
            })     
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
   
  };

  const getFilter = async (nextPage) => {

    // console.log(SearchDistrict);
    //   console.log(SearchRegion);

    fetch('http://ec2-52-90-105-94.compute-1.amazonaws.com:443/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({ Country: CountrySel ,Region: RegionSel, District: DistrictSel, Page:  nextPage}),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        data.forEach((item) => {
          //  console.log(item.PSCode);
          
           setTableData((prevState) => [...prevState, item.PSCode?item.PSCode: ""]);
           setPSName((prevState) => [...prevState, item.PSName?item.PSName: ""]);
           setRegion((prevState) => [...prevState, item.Region?item.Region: ""]);
           setDistrict((prevState) => [...prevState, item.District?item.District: ""]);
           setConstituency((prevState) => [...prevState, item.Constituency?item.Constituency: ""]);
           setWinner((prevState) => [...prevState, item.Winner?item.Winner: ""]);
        })     
        setLoading(false);
        // Handle response from server
      })
      .catch((error) => {
        console.error(error);
        // Handle error if request fails
      });


  };
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
        // console.log();
       getData();
     }, []);
 useEffect(() => {
      // console.log(tableData);
    }, [tableData]);
  return (
    <>
      {/* {loading != true && (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'white',
            overflow: 'scroll',
          }}>
          <View style={styles1.container}>
            <Text style={styles1.text}>
              Analyzed Result
            </Text>
          </View>

      

          {tableData?.map((table, index) => (
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
            
          ))}

       
        </ScrollView>
      )} */}

       <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'rgb(252, 232, 243)',
            overflow: 'scroll',
          }}
          onScroll={({ nativeEvent }) => {
            // Check if the user has reached the bottom of the scroll view
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isScrollEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height;
        
            // If the user has reached the bottom, fetch the next page
            if (isScrollEnd) {
              setCurrentPage(prevPage => {
                const nextPage = prevPage + 1;
                if(filterstatus === 0)
                  getData(nextPage);
                else
                  getFilter(nextPage);
                return nextPage;
              });
              setLoading(true);
            }
          }}
          >
          <View style={styles1.container}>
            <Text style={styles1.text}>
              Analyzed Result
            </Text>
          </View>
          {/* <Text> {tableData}</Text> */}

          <View style={styles_combo.viewContainer}>
  
            <ScrollView
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={false}
              contentContainerStyle={styles_combo.scrollViewContainer}>
              <View style={styles_combo.dropdownsRow}>
                <SelectDropdown
                  data={countries}
                  onSelect={(selectedItem, index) => {
                    citiesDropdownRef.current.reset();                    
                    // console.log(selectedItem.title);
                    SetCountrySel(selectedItem.title);
                    console.log(CountrySel);

                  }}
                  defaultButtonText={'Select Country'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // console.log(selectedItem.title);
                    // SetCountrySel(selectedItem.title);
                    return selectedItem.title;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.title;
                  }}
                  buttonStyle={styles_combo.dropdown1BtnStyle}
                  buttonTextStyle={styles_combo.dropdown1BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles_combo.dropdown1DropdownStyle}
                  rowStyle={styles_combo.dropdown1RowStyle}
                  rowTextStyle={styles_combo.dropdown1RowTxtStyle}
                />
                <View style={styles_combo.divider} />
                <SelectDropdown
                  ref={citiesDropdownRef}
                  data={SearchRegion}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem.title);
                    SetRegionSel(selectedItem.title);
                  }}
                  defaultButtonText={'Select Region'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.title;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.title;
                  }}
                  buttonStyle={styles_combo.dropdown2BtnStyle}
                  buttonTextStyle={styles_combo.dropdown2BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles_combo.dropdown2DropdownStyle}
                  rowStyle={styles_combo.dropdown2RowStyle}
                  rowTextStyle={styles_combo.dropdown2RowTxtStyle}
                />
                <View style={styles_combo.divider} />
                <SelectDropdown
                  ref={citiesDropdownRef}
                  data={SearchDistrict}
                  onSelect={(selectedItem, index) => {
                   
                    SetDistrictSel(selectedItem.title);
                  }}
                  defaultButtonText={'Select District'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.title;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.title;
                  }}
                  buttonStyle={styles_combo.dropdown2BtnStyle}
                  buttonTextStyle={styles_combo.dropdown2BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles_combo.dropdown2DropdownStyle}
                  rowStyle={styles_combo.dropdown2RowStyle}
                  rowTextStyle={styles_combo.dropdown2RowTxtStyle}
                />
                <View style={styles_combo.divider} />
                <SelectDropdown
                  ref={citiesDropdownRef}
                  data={SearchContituency}
                  onSelect={(selectedItem, index) => {
                    SetContituencySel(selectedItem.title);
                  }}
                  defaultButtonText={'Select Constituency'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.title;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.title;
                  }}
                  buttonStyle={styles_combo.dropdown2BtnStyle}
                  buttonTextStyle={styles_combo.dropdown2BtnTxtStyle}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles_combo.dropdown2DropdownStyle}
                  rowStyle={styles_combo.dropdown2RowStyle}
                  rowTextStyle={styles_combo.dropdown2RowTxtStyle}
                />

                <View style={{ padding: 10 }}>
                  <Button
                    
                    title="Filter"
                    onPress={() => {
                      SetFilterStatus(1);
                      setCurrentPage(1);
                        setTableData([]);
                        setPSName([]);
                        setRegion([]);
                        setDistrict([]);
                        setConstituency([]);
                        setWinner([]);
                        setLoading(true);

                      getFilter(1);
                    }}
                  />
                </View>
              </View>

            </ScrollView>

            
          </View>
          
          <View style={styles1.container}>
 
            <View  style={styles_table.row}>
                {
                table_header.map((rowData,rowIndex)=>(
                  <View
                  key={rowIndex}
                  style={[
                    styles_table.cell,
                    { flex: 1 },
                  ]}
                >
                  <Text style={styles_table.cellText}>
                    {rowData}
                  </Text>  
                  </View>
                ))
                }
            </View> 
            {tableData.map((rowData, rowIndex) => (

              <View key={rowIndex} style={styles_table.row}>
                  <View
                    key={rowIndex}
                    style={[
                      styles_table.cell,
                      { flex: 1 },
                    ]}
                  >
                    <Text style={styles_table.cellText}>
                      {rowData}
                    </Text>  
                </View>
                <View
                    style={[
                      styles_table.cell,
    
                      { flex: 1 },
                    ]}
                  >
                    <Text style={styles_table.cellText}>
                      {PSName[rowIndex]}
                    </Text>  
                </View>

                <View
                    style={[
                      styles_table.cell,
    
                      { flex: 1 },
                    ]}
                  >
                    <Text style={styles_table.cellText}>
                      {region[rowIndex]}
                    </Text>  
                </View>
                <View
                    style={[
                      styles_table.cell,
    
                      { flex: 1 },
                    ]}
                  >
                    <Text style={styles_table.cellText}>
                      {district[rowIndex]}
                    </Text>  
                </View>
                <View
                    style={[
                      styles_table.cell,
    
                      { flex: 1 },
                    ]}
                  >
                    <Text style={styles_table.cellText}>
                      {constituency[rowIndex]}
                    </Text>  
                </View>
                <View
                    style={[
                      styles_table.cell,
    
                      { flex: 1 },
                    ]}
                  >
                    <Text style={styles_table.cellText}>
                      {winner[rowIndex]}
                    </Text>  
                </View>
                
                <View
                    style={[
                      styles_table.cell,
    
                      { flex: 1 },
                    ]}
                  >
                    <Button
                      title="detail"
                      onPress={() => {
                        navigation.push('Detail', { path: rowData });
                      }}
                    />
                </View>
              </View>

              
            ))}
         </View>
           
            {loading && (
          <View
            style={{
              display: 'flex',
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
        </ScrollView>
       
    </>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    tableBorder: { borderWidth: 2, borderColor: '#c8e1ff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, textAlign: 'center' },
    row: { height: 80, backgroundColor: '#f1f8ff' },
    firstRow: {height: 80, backgroundColor: '#21f8ff' },
    headerRow: {height: 80, backgroundColor: '#41f8ff' },
    headerText: { backgroundColor: '#22222'}
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

  const styles_combo = StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      width,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F6F6F6',
    },
    headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
    saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
    viewContainer: {flex: 1, width, backgroundColor: '#c3c3c3'},
    scrollViewContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: '3%',
    },
    dropdownsRow: {flexDirection: 'row', width: '100%', paddingHorizontal: '5%'},
  
    dropdown1BtnStyle: {
      flex: 1,
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
    divider: {width: 12},
    dropdown2BtnStyle: {
      flex: 1,
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdown2BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown2DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown2RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {color: '#444', textAlign: 'left'},
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

export default ViewResults;


