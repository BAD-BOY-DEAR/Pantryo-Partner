import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  LogBox,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
navigator.geolocation = require('@react-native-community/geolocation');
import {showToast} from './functions';

// ===== Images ===== //
import mascot from '../../assets/logo/mascot.png';

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
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
  const netInfo = useNetInfo();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [kycStatus, setKycStatus] = React.useState('1');
  const [todayOrderData, setTodayOrderData] = React.useState('');
  const [numberOfOrderToday, setNumberOfOrderToday] = React.useState('0');
  const [numberOfOrderAll, setNumberOfOrderAll] = React.useState('0');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lat, setLat] = React.useState('');
  const [long, setLong] = React.useState('');
  const [currentLocation, setCurrentLocation] = React.useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setLoading(true);
    getPartnerDetails();
    getTodayOrder();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Request user permission to access location
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs access to your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          showToast('Permission Denied');
          requestLocationPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Get Longitude and Latitude
  const getOneTimeLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        let fromLoc = position.coords;
        let coordinate = {
          latitude: fromLoc.latitude,
          longitude: fromLoc.longitude,
        };
        // console.log(coordinate.latitude);
        // console.log(coordinate.longitude);
        setLat(coordinate.latitude);
        setLong(coordinate.longitude);
        setCurrentLocation(coordinate);
      },
      error => {
        if (error.code === NO_LOCATION_PROVIDER_AVAILABLE) {
          showToast('Error 404');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000,
      },
    );
  };

  // Getting Partner Details
  const getPartnerDetails = async () => {
    let partner_kycStatus = await AsyncStorage.getItem('partner_kycStatus');
    setKycStatus(partner_kycStatus);
    getPartnerDetails();
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
        if (result.error == 0) {
          setTodayOrderData(result.todayorderdetails);
          setNumberOfOrderAll(result.allordercount);
          setNumberOfOrderToday(result.todayordercount);
        }
        getTodayOrder();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);

    requestLocationPermission();
    getPartnerDetails();
    getTodayOrder();
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
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'OpenSans-SemiBold',
                          fontSize: 18,
                          color: '#fff',
                        }}>
                        Go Live
                      </Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#5E3360'}}
                        thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{marginTop: 5}}
                      />
                    </View>
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
                          {numberOfOrderToday}
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
                        <Text style={styles.cardOneLabel}>
                          Total Orders Received
                        </Text>
                        <Text style={styles.cardOneResponse}>
                          {numberOfOrderAll}
                        </Text>
                      </Pressable>
                    </View>
                  </LinearGradient>
                  {/* ========== Overview Section ========== */}

                  {/* ========== Ongoing Orders Section ========== */}
                  <View style={styles.section}>
                    <Text style={styles.tabHeading}>Orders Received Today</Text>
                    {isLoading == true ? (
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
                    ) : todayOrderData !== '' ? (
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
                                  customer_name: item.customer_name,
                                  totalItem: item.TodayOrderOneIdWise,
                                  orderStatus: item.orderStatus,
                                  customerToken: item.customer_token,
                                })
                              }
                              style={styles.details}>
                              <View style={styles.divOne}>
                                <Text style={styles.detailsTxt}>
                                  {item.customer_name}
                                </Text>
                                <Text style={styles.detailsAddressLabel}>
                                  Address:
                                </Text>
                                <Text style={styles.detailsAddress}>
                                  {item.customerDeliveryAddress}
                                </Text>
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
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          // paddingVertical: '45%',
                          // paddingHorizontal: '50%',
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
                            width: 100,
                            height: 100,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 20,
                            textAlign: 'center',
                            color: '#777',
                          }}>
                          Waiting for customer orders. You will receive a
                          notification as soon as a customer places their order
                        </Text>
                      </View>
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
    paddingVertical: 10,
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
    height: '70%',
    marginRight: 30,
    marginBottom: 30,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
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
});
