import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  LogBox,
} from 'react-native';

// ===== Library ===== //
import {createStackNavigator} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import analytics from '@react-native-firebase/analytics';
navigator.geolocation = require('@react-native-community/geolocation');
import CheckBox from '@react-native-community/checkbox';
import * as Animatable from 'react-native-animatable';

// ===== Screens ===== //
import RegistrationForm from './Registration/RegistrationForm';
import UploadDocs from './Registration/UploadDocs';
import PostUploadStatus from './Registration/PostUploadStatus';
import OrderDetails from './Orders/OrderDetails';
import OrdersList from './Orders/OrdersList';
import PaymentScreen from './Payments/PaymentScreen';
import FeatureTest from './FeatureTest';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeScreen = ({navigation}) => {
  const netInfo = useNetInfo();

  // Toggle Switch
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [isLoading, setLoading] = React.useState(true);
  const [kycStatus, setKycStatus] = React.useState('1');
  const [todayOrderData, setTodayOrderData] = React.useState(null);
  const [numberOfOrderToday, setNumberOfOrderToday] = React.useState('0');
  const [numberOfOrderAll, setNumberOfOrderAll] = React.useState('0');
  const [refreshing, setRefreshing] = React.useState(false);
  // Partner
  const [partnerId, setPartnerId] = React.useState('');
  const [partnerStatus, setPartnerStatus] = React.useState('');

  ////////////////onRefresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    changePartnerStatus();
    getPartnerDetails();
    getTodayOrder();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  ///////////get Partner Details
  const getPartnerDetails = async () => {
    let partner_kycStatus = await AsyncStorage.getItem('partner_kycStatus');
    setKycStatus(partner_kycStatus);
    getPartnerDetails();
  };

  // Function to get Partner's Profile
  const getUserProfile = async () => {
    setPartnerId(await AsyncStorage.getItem('partner_id'));
  };

  // Get Orders received today
  const getTodayOrder = async () => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getTodayOrderOfPartner',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partner_id,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        // console.log(result);
        if (result.error == 0) {
          setTodayOrderData(result.todayorderdetails);
          setNumberOfOrderAll(result.allordercount);
          setNumberOfOrderToday(result.todayordercount);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        getTodayOrder();
        setLoading(false);
      });
  };

  // Partner Status
  const changePartnerStatus = async status => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=partnerStatusChange',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partner_id,
          partner_status: status,
        }),
      },
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        // console.log(result);
        getStatus();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Partner Status
  const getStatus = async () => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=checkpartnerStatus',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partner_id,
        }),
      },
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        // console.log(result);
        setPartnerStatus(result.partner_status);
        if (result.partner_status == 1) {
          setToggleCheckBox(true);
        } else {
          setToggleCheckBox(false);
        }
        // getStatus();
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);

    getPartnerDetails();
    getTodayOrder();
    getUserProfile();
    //// Partner Status
    getStatus();
  }, []);

  return (
    <>
      {netInfo.isConnected == true ? (
        <>
          {kycStatus == '1' ? (
            <>
              <View style={styles.kycContainer}>
                <View style={styles.lottieContainer}>
                  <LottieView
                    source={require('../../assets/lottie/waitingNew.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                </View>
                <View style={styles.kycBottomContainer}>
                  <LinearGradient
                    colors={['#cea5d1', '#87548a']}
                    style={styles.kycCard}>
                    <LottieView
                      source={require('../../assets/lottie/documents.json')}
                      autoPlay
                      loop
                      style={styles.bottomKycLottie}
                    />
                    <Text style={styles.kycBottomHeading}>
                      Upload Documents
                    </Text>
                    <Text style={styles.explanation}>
                      Please complete your E-KYC to start your journey with
                      Pantryo
                    </Text>
                    <Pressable
                      onPress={() => navigation.navigate('UploadDocs')}
                      style={styles.kycBtn}>
                      <Text style={styles.kycBtnTxt}>Click here</Text>
                    </Pressable>
                  </LinearGradient>
                </View>
              </View>
            </>
          ) : (
            <>
              <ScrollView
                style={styles.scrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                <View style={styles.container}>
                  {/* ========== Header Section ========== */}
                  <View style={styles.header}>
                    <Text style={styles.screenName}>Dashboard</Text>

                    {/* ========== Status Section ========== */}
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      {partnerStatus == '1' ? (
                        <>
                          <Text style={styles.checkBoxTxt}>Live</Text>
                          <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={newValue =>
                              setToggleCheckBox(newValue)
                            }
                            onChange={() => {
                              changePartnerStatus('2');
                              // setPartnerStatus('2');
                            }}
                          />
                        </>
                      ) : partnerStatus == '2' ? (
                        <>
                          <Text style={styles.checkBoxTxt}>Offline</Text>
                          <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={newValue =>
                              setToggleCheckBox(newValue)
                            }
                            onChange={() => {
                              changePartnerStatus('1');
                              // setPartnerStatus('1');
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Text style={styles.checkBoxTxt}>
                            Fetching Status...
                          </Text>
                        </>
                      )}
                    </View>
                    {/* ========== Status Section ========== */}
                  </View>
                  {/* ========== Header Section ========== */}

                  {/* ========== Overview Section ========== */}
                  <LinearGradient
                    colors={['#b586b8', '#87548a']}
                    style={styles.middleSection}>
                    <View style={styles.row}>
                      <View style={styles.cardOne}>
                        <Text style={styles.cardOneLabel}>Orders Today</Text>
                        <Text style={styles.cardOneResponse}>
                          {numberOfOrderToday ? numberOfOrderToday : '0'}
                        </Text>
                      </View>
                      <Pressable
                        onPress={async () =>
                          await analytics().logEvent('totalorders', {
                            item: 'total orders received',
                            description: ['total orders', 'home screen'],
                          })
                        }
                        style={styles.cardOne}>
                        <Text style={styles.cardOneLabel}>Total Orders</Text>
                        <Text style={styles.cardOneResponse}>
                          {numberOfOrderAll ? numberOfOrderAll : '0'}
                        </Text>
                      </Pressable>
                    </View>
                  </LinearGradient>
                  {/* ========== Overview Section ========== */}

                  {/* ========== Ongoing Orders Section ========== */}
                  <View style={styles.section}>
                    <Text style={styles.tabHeading}>Orders Received Today</Text>

                    {isLoading == true ? (
                      <>
                        {/* ======= Lottie Loader while searching for orders ======= */}
                        <View
                          style={[
                            styles.loader,
                            {
                              paddingVertical: '30%',
                              paddingHorizontal: '35%',
                            },
                          ]}>
                          <LottieView
                            style={{height: 75, width: 75}}
                            source={require('../../assets/lottie/loading.json')}
                            autoPlay
                            loop
                          />
                        </View>
                        {/* ======= Lottie Loader while searching for orders ======= */}
                      </>
                    ) : todayOrderData !== null ? (
                      // ======== Customer Orders ========
                      <FlatList
                        data={todayOrderData}
                        style={{width: '100%'}}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                          />
                        }
                        keyExtractor={item => item.orderId}
                        renderItem={({item}) => (
                          <>
                            <Pressable
                              onPress={() =>
                                navigation.navigate('OrderDetails', {
                                  order_id: item.orderId,
                                })
                              }
                              style={styles.details}>
                              <View style={styles.divOne}>
                                <Text style={styles.detailsTxt}>
                                  {item.customer_name}
                                </Text>
                                <View style={styles.newRow}>
                                  <View style={{flex: 1}}>
                                    <Text style={styles.detailsAddressLabel}>
                                      Address:
                                    </Text>
                                    <Text style={styles.detailsAddress}>
                                      {item.customerDeliveryAddress}
                                    </Text>
                                  </View>
                                  <View style={{flex: 1}}>
                                    <Text style={styles.detailsAddressLabel}>
                                      Your Earning:
                                    </Text>
                                    <Text
                                      style={[
                                        styles.detailsAddress,
                                        {color: 'green', fontSize: 24},
                                      ]}>
                                      ₹ {item.payment_amount}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.newRow2}>
                                  <View
                                    style={{
                                      flex: 1,
                                    }}>
                                    <Text style={styles.addressLabel}>
                                      Order ID:
                                    </Text>
                                    <Text style={styles.addressLabel2}>
                                      {item.orderId}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 1,
                                    }}>
                                    <Text style={styles.addressLabel}>
                                      Status:
                                    </Text>
                                    {item.orderStatus == '1' ? (
                                      <Text style={styles.addressLabel2}>
                                        On Going
                                      </Text>
                                    ) : item.orderStatus == '2' ? (
                                      <Text style={styles.addressLabel2}>
                                        On Going
                                      </Text>
                                    ) : item.orderStatus == '3' ? (
                                      <Text style={styles.addressLabel2}>
                                        On Going
                                      </Text>
                                    ) : item.orderStatus == '4' ? (
                                      <Text style={styles.addressLabel2}>
                                        On Going
                                      </Text>
                                    ) : item.orderStatus == '5' ? (
                                      <Text style={styles.addressLabel2}>
                                        Completed
                                      </Text>
                                    ) : item.orderStatus == '6' ? (
                                      <Text style={styles.addressLabel2}>
                                        Completed
                                      </Text>
                                    ) : item.orderStatus == '7' ? (
                                      <Text style={styles.addressLabel2}>
                                        Completed
                                      </Text>
                                    ) : item.orderStatus == '8' ? (
                                      <Text style={styles.addressLabel2}>
                                        Order Delivered
                                      </Text>
                                    ) : null}
                                  </View>
                                </View>
                                <View style={styles.detailsInnerRow}>
                                  <Text style={styles.detailsDate}>
                                    {item.create_date}
                                  </Text>
                                  <Text style={styles.btnDetails}>
                                    View Order Details
                                  </Text>
                                </View>
                              </View>
                            </Pressable>
                          </>
                        )}
                        // ======== Customer Orders ========
                      />
                    ) : (
                      // ========== Waiting for Orders ==========
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          paddingTop: 20,
                        }}>
                        <LottieView
                          source={require('../../assets/lottie/nodata.json')}
                          autoPlay
                          loop
                          style={{
                            width: 200,
                            height: 200,
                          }}
                        />
                        <Animatable.Text
                          animation="fadeIn"
                          iterationCount="infinite"
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 20,
                            textAlign: 'center',
                            color: '#777',
                          }}>
                          Waiting for customer orders....
                        </Animatable.Text>
                      </View>
                      // ========== Waiting for Orders ==========
                    )}
                  </View>
                  {/* ========== Ongoing Orders Section ========== */}
                </View>
              </ScrollView>
            </>
          )}
        </>
      ) : netInfo.isConnected == false ? (
        <View style={styles.loader}>
          <LottieView
            source={require('../../assets/lottie/noInternet.json')}
            autoPlay
            loop
          />
        </View>
      ) : null}
    </>
  );
};

const Stack = createStackNavigator();

function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UploadDocs"
        component={UploadDocs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="PostUploadStatus" component={PostUploadStatus} />
      <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
      <Stack.Screen
        name="OrderDetails"
        options={{
          title: 'Order Details',
        }}
        component={OrderDetails}
      />
      <Stack.Screen name="OrdersList" component={OrdersList} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="FeatureTest" component={FeatureTest} />
    </Stack.Navigator>
  );
}

export default Home;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#b586b8',
  },
  screenName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    flex: 1,
    color: '#fff',
  },
  tabContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  activityBtn: {
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  activityBtnTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  tabHeading: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#5E3360',
    marginBottom: 15,
  },
  div: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  section: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  details: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  detailsTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    flex: 1,
    color: '#5E3360',
  },
  detailsDate: {
    fontFamily: 'OpenSans-Regular',
    marginTop: 5,
    fontSize: 16,
    flex: 1,
  },
  divOne: {
    flex: 1,
  },
  divTwo: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  middleSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#5E3360',
    paddingVertical: 30,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOne: {
    flex: 1,
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  cardOneLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000000',
  },
  cardOneResponse: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
    color: '#000000',
  },
  detailsAddressLabel: {
    fontFamily: 'OpenSans-Regular',
    marginTop: 15,
    fontSize: 16,
  },
  detailsAddress: {
    fontFamily: 'OpenSans-Bold',
    marginBottom: 15,
    fontSize: 18,
  },
  detailsInnerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  btnDetails: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 5,
    color: 'blue',
  },
  kycContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeddf0',
  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#eeddf0',
  },
  kycSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 400,
    height: 400,
    backgroundColor: '#eeddf0',
  },
  kycBottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  kycCard: {
    width: '50%',
    marginRight: 30,
    marginBottom: 30,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: '#cea5d1',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    backgroundColor: '#cea5d1',
  },
  bottomKycLottie: {
    width: 150,
    height: 150,
  },
  kycBottomHeading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 30,
    color: '#fff',
  },
  explanation: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#fff',
  },
  kycBtn: {
    width: 150,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
  },
  kycBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  btnTxtToggle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  checkBoxTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#fff',
  },
  newRow: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  newRow2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 15,
    flexDirection: 'row',
  },
  addressLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  addressLabel2: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#000',
  },
});
