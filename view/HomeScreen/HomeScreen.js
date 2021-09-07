import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  LogBox,
  Switch,
  TouchableOpacity,
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
import RazorpayCheckout from 'react-native-razorpay';

// ===== Screens ===== //
import RegistrationForm from './Registration/RegistrationForm';
import UploadDocs from './Registration/UploadDocs';
import PostUploadStatus from './Registration/PostUploadStatus';
import OrderDetails from './Orders/OrderDetails';
import OrdersList from './Orders/OrdersList';
import PaymentScreen from './Payments/PaymentScreen';
import FeatureTest from './FeatureTest';
import Banners from './Others/Banners';
import InventoryScreen from '../Inventory/InventoryScreen';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeScreen = ({navigation}) => {
  const netInfo = useNetInfo();

  // Toggle Switch
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [isLoading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('2');
  const [todayOrderData, setTodayOrderData] = useState(null);
  const [numberOfOrderToday, setNumberOfOrderToday] = useState('0');
  const [numberOfOrderAll, setNumberOfOrderAll] = useState('0');
  const [refreshing, setRefreshing] = useState(false);

  // Partner
  const [partnerId, setPartnerId] = useState('');
  const [partnerStatus, setPartnerStatus] = useState('');
  const [partnerVerificationStatus, setPartnerVerificationStatus] =
    useState('1');
  const [earning, setEarning] = useState('');
  const [inventoryUpdate, setInventoryUpdate] = useState(false);

  // onRefresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    changePartnerStatus();
    getPartnerDetails();
    getTodayOrder();
    getPartnerEarning();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Get Partner Details
  async function getPartnerDetails() {
    let partner_kycStatus = await AsyncStorage.getItem('partner_kycStatus');
    let partner_paymentStatus = await AsyncStorage.getItem(
      'partner_paymentStatus',
    );
    let user_verification = await AsyncStorage.getItem('user_verification');
    let user_inventory = await AsyncStorage.getItem('user_inventory');
    // console.log(partner_paymentStatus);
    setKycStatus(partner_kycStatus);
    setPaymentStatus(partner_paymentStatus);
    setPartnerVerificationStatus(user_verification);
    if (user_inventory == 'true') {
      setInventoryUpdate(true);
    }
    getPartnerDetails();
  }

  // Function to get Partner's Profile
  async function getUserProfile() {
    setPartnerId(await AsyncStorage.getItem('partner_id'));
    setPaymentStatus(await AsyncStorage.getItem('partner_paymentStatus'));
    // console.log(await AsyncStorage.getItem('partner_paymentStatus'));
  }

  // Get Orders received today
  async function getTodayOrder() {
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/getTodayOrderOfPartner.php',
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
        return Promise.resolve();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        getTodayOrder();
        setLoading(false);
      });
  }

  // Partner Status
  async function changePartnerStatus(status) {
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/partnerStatusChange.php',
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
        if (result.error == 0) {
          let partner_status = result.partner_status;
          setPartnerStatus(partner_status);
          if (partner_status == '1') {
            setToggleCheckBox(true);
          }
          if (partner_status == '2') {
            setToggleCheckBox(false);
          }
        }
        return Promise.resolve();
        getStatus();
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Partner Status
  async function getStatus() {
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/checkpartnerStatus.php',
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
        if (result.error == 0) {
          let partner_status = result.partner_status;
          setPartnerStatus(partner_status);
          if (partner_status == '1') {
            setToggleCheckBox(true);
          }
          if (partner_status == '2') {
            setToggleCheckBox(false);
          }
        }
        return Promise.resolve();
        // getStatus();
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Partner Status
  async function getPartnerEarning() {
    // setLoading(true);
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartnerCountHistroy.php?flag=gettodayearning',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: partner_id,
        }),
      },
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        if (result.error == 0) {
          setEarning(result.earn);
        }
        return Promise.resolve();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        // getPartnerEarning();
      });
  }

  // RazorpayFunction Payment APi
  async function RazorpayFunction() {
    let partner_contactNumber = await AsyncStorage.getItem(
      'partner_contactNumber',
    );
    let partner_shopName = await AsyncStorage.getItem('partner_shopName');

    var options = {
      description: '',
      image: 'https://gizmmoalchemy.com/api/pantryo/Logo/PantryoLogo.png',
      currency: 'INR',
      key: 'rzp_live_TpcwwZklv2yFyL',
      amount: '100',
      name: 'Pantryo',
      prefill: {
        email: 'support@pantryo.com',
        contact: partner_contactNumber,
        name: partner_shopName,
      },
      theme: {color: '#6a3091'},
    };

    RazorpayCheckout.open(options)
      .then(data => {
        let payment_id = `${data.razorpay_payment_id}`;
        getPaymentStatus(payment_id);
      })
      .catch(error => {
        console.log(
          'Error: ' + JSON.stringify(`${error.code} | ${error.description}`),
        );
      });
  }

  // Check Payment Status
  async function getPaymentStatus(payment_id) {
    let partner_id = await AsyncStorage.getItem('partner_id');
    let partner_category = await AsyncStorage.getItem('partner_category');
    setPaymentLoading(true);
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/paymentdetails.php?flag=partner_transaction',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: payment_id,
          partner_id: partner_id,
          partner_category: partner_category,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.payment_status === 'authorized') {
          let partner_paymentStatus = result.partner_payment_status;
          AsyncStorage.setItem('partner_paymentStatus', partner_paymentStatus);
          AsyncStorage.setItem('user_inventory', 'true');
          getPartnerDetails();
        } else {
          showToast('Status of Payment' + ' ' + JSON.stringify(result));
        }
        return Promise.resolve();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setPaymentLoading(false));
  }

  // Check Verification Status
  async function getPartnerVarificationStatus() {
    let partner_id = await AsyncStorage.getItem('partner_id');
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/checkVerificationStatus.php',
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
          let user_verification = result.verificationStatus;
          AsyncStorage.setItem('user_verification', user_verification);
          getPartnerDetails();
        }
        getPartnerVarificationStatus();
        return Promise.resolve();
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);

    getPartnerDetails();
    getTodayOrder();
    getUserProfile();
    getPartnerEarning();
    getPartnerVarificationStatus();
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
                        marginRight: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      {partnerStatus == '1' ? (
                        <>
                          <Text style={styles.checkBoxTxt}>You are live</Text>
                          <CheckBox
                            disabled={false}
                            tintColors={{true: 'green', false: 'black'}}
                            value={toggleCheckBox}
                            onValueChange={newValue => {
                              setToggleCheckBox(newValue);
                              changePartnerStatus('2');
                            }}
                            onChange={() => {
                              changePartnerStatus('2');
                            }}
                          />
                        </>
                      ) : partnerStatus == '2' ? (
                        <>
                          <Text style={styles.checkBoxTxt}>
                            You are Offline
                          </Text>
                          <CheckBox
                            disabled={false}
                            tintColors={{true: 'green', false: 'black'}}
                            value={toggleCheckBox}
                            onValueChange={newValue => {
                              setToggleCheckBox(newValue);
                              changePartnerStatus('1');
                            }}
                            onChange={() => {
                              changePartnerStatus('1');
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Text style={styles.checkBoxTxt}>
                            Fetching Status, Pull down to refresh...
                          </Text>
                        </>
                      )}
                    </View>
                    {/* ========== Status Section ========== */}
                  </View>
                  {/* ========== Header Section ========== */}

                  {/* ========== Status ========== */}
                  {partnerStatus !== '1' ? (
                    <TouchableOpacity style={styles.notificationBtn}>
                      <View
                        style={[
                          styles.notificationTab,
                          {backgroundColor: '#bf3d5e'},
                        ]}>
                        <Text style={styles.notifHeading}>
                          You are Offline!
                        </Text>
                        <Text style={styles.notifTxt}>
                          Pantryo customers will not be able to order from your
                          shop.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {/* ========== Status ========== */}

                  {/* ========== Products Added in Inventory ========== */}
                  {inventoryUpdate == true ? (
                    <TouchableOpacity
                      onPress={() => {
                        setInventoryUpdate(false);
                        AsyncStorage.setItem('user_inventory', 'false');
                        navigation.navigate('InventoryScreen');
                      }}
                      style={styles.notificationBtn}>
                      <View
                        style={[
                          styles.notificationTab,
                          {backgroundColor: '#eb9310'},
                        ]}>
                        <Text style={styles.notifHeading}>
                          Inventory Updated
                        </Text>
                        <Text style={styles.notifTxt}>
                          We have added products in your inventory. Customers
                          will be able to order these products from your shop.
                          Click here to check them out
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {/* ========== Products Added in Inventory ========== */}

                  {/* ========== Verification Notification Start ========== */}
                  {partnerVerificationStatus == '2' ? (
                    <TouchableOpacity style={styles.notificationBtn}>
                      <View
                        style={[
                          styles.notificationTab,
                          {backgroundColor: '#4677ab'},
                        ]}>
                        <Text style={styles.notifHeading}>
                          Profile Under Verification!
                        </Text>
                        <Text style={styles.notifTxt}>
                          Please wait while we look at your documents. You may
                          receive a call from our side to confirm the details
                          provided by you.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {/* ========== Verification Notification End ========== */}

                  {/* ========== Payment Notification Start ========== */}
                  {paymentStatus == '1' ? (
                    <TouchableOpacity
                      onPress={RazorpayFunction}
                      style={styles.notificationBtn}>
                      <View style={styles.notificationTab}>
                        <Text style={styles.notifHeading}>
                          Payment Unsuccessful!
                        </Text>
                        <Text style={styles.notifTxt}>
                          Please make a payment of ₹1 to complete your
                          registration
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {/* ========== Payment Notification End ========== */}

                  {/* ==== Banner Section ==== */}
                  {/* <Banners /> */}
                  {/* ==== Banner Section ==== */}

                  {/* ========== Overview Section ========== */}
                  <LinearGradient
                    colors={['#fff', '#fff']}
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
                          await analytics().logEvent(
                            'totalorders',
                            {
                              item: numberOfOrderAll,
                            },
                            navigation.navigate('OrdersList'),
                          )
                        }
                        style={styles.cardOne}>
                        <Text style={styles.cardOneLabel}>Total Orders</Text>
                        <Text style={styles.cardOneResponse}>
                          {numberOfOrderAll ? numberOfOrderAll : '0'}
                        </Text>
                      </Pressable>
                    </View>

                    {earning !== '' ? (
                      <View style={styles.row}>
                        <View style={styles.cardOne}>
                          <Text style={styles.cardOneLabel}>
                            Earnings for today
                          </Text>
                          <Text style={styles.cardOneResponse}>₹{earning}</Text>
                          <Text style={styles.cardOneLabel}>
                            will be credited by 6:00 PM today
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </LinearGradient>
                  {/* ========== Overview Section ========== */}

                  {/* ========== Ongoing Orders Section ========== */}
                  <View style={styles.section}>
                    <Text style={styles.tabHeading}>New orders</Text>

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
                        // refreshControl={
                        //   <RefreshControl
                        //     refreshing={refreshing}
                        //     onRefresh={onRefresh}
                        //   />
                        // }
                        keyExtractor={item => item.orderId}
                        renderItem={({item}) => (
                          <>
                            {item.orderStatus == '8' ||
                            item.orderStatus == '7' ||
                            item.orderStatus == '6' ||
                            item.orderStatus == '5' ? (
                              <View
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
                                  {/* <View style={styles.detailsInnerRow}>
                                <Text style={styles.detailsDate}>
                                  {item.create_date}
                                </Text>
                                <Text style={styles.btnDetails}>
                                  View Order Details
                                </Text>
                              </View> */}
                                </View>
                              </View>
                            ) : (
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
                                        <Text
                                          style={styles.detailsAddressLabel}>
                                          Address:
                                        </Text>
                                        <Text style={styles.detailsAddress}>
                                          {item.customerDeliveryAddress}
                                        </Text>
                                      </View>
                                      <View style={{flex: 1}}>
                                        <Text
                                          style={styles.detailsAddressLabel}>
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
                            width: 100,
                            height: 100,
                          }}
                        />
                        <Animatable.Text
                          animation="fadeIn"
                          iterationCount="infinite"
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 20,
                            textAlign: 'center',
                            color: '#000',
                          }}>
                          Searching for customer orders...
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
      <Stack.Screen
        name="OrdersList"
        component={OrdersList}
        options={{
          title: 'Total Orders',
        }}
      />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="FeatureTest" component={FeatureTest} />
      <Stack.Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{
          headerShown: false,
        }}
      />
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
    backgroundColor: '#fff',
  },
  screenName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    flex: 1,
    color: '#000',
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
    paddingVertical: 5,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardOne: {
    flex: 1,
    borderRadius: 5,
    shadowColor: '#000',
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
    marginTop: 20,
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
    color: '#000',
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
  notificationBtn: {
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 10,
  },
  notificationTab: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#ed7b7b',
    paddingVertical: 20,
    borderRadius: 5,
  },
  notifHeading: {
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
  },
  notifTxt: {
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
});
