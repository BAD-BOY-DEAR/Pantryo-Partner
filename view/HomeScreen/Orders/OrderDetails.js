import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  LogBox,
  FlatList,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';

// ===== Library ===== //
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
navigator.geolocation = require('@react-native-community/geolocation');
import Icons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';

// ===== Images ===== //
import deliveryBoy from '../../../assets/icons/delivery.gif';
import Loader from '../../../controller/LoaderScreen';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const OrderDetails = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = React.useState('');
  const [enteredOtp, setEnteredOtp] = React.useState('');
  const [userConfirmationOtp, setUserConfirmationOtp] = React.useState('');
  const [orderStatus, setOrderStatus] = React.useState('');
  const [toggleCheckBoxOne, setToggleCheckBoxOne] = useState(false);
  const [toggleCheckBoxTwo, setToggleCheckBoxTwo] = useState(false);
  const [lat, setLat] = React.useState('');
  const [long, setLong] = React.useState('');
  const [customerToken, setCustomerToken] = React.useState('');
  const [partnerShop, setPartnerShop] = React.useState('');
  const [partnerId, setPartnerId] = React.useState('');
  const [orderDetails, setOrderDetails] = React.useState('');

  // Delivery boy Variables
  const [deliveryPartnerName, setDeliveryPartnerName] = React.useState('');
  const [deliveryPartnerContactNumber, setDeliveryPartnerContactNumber] =
    React.useState('');

  const customer_firebase_key =
    'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
  const delivery_partner_firebase_key =
    'AAAALC3Ugt8:APA91bFdhqYhHLlDedpHpuCBX7puDR5x1qsrmc6k3gh-pXIBaUoxTJ3t91pVuBwV51GdrSnYLb9McgZYbGnkVR6-A8BnqsUL8nQKN8Bg3qwwH9puZ01uCt4tnGU7w0qNXL0S-x8Ofnaf';

  // Refresh Function
  const onRefresh = React.useCallback(() => {
    // searchDeliveryPartner();
    getOrderDetails(route.params.order_id);
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Function to get Partner's Profile
  const getUserProfile = async () => {
    setPartnerShop(await AsyncStorage.getItem('partner_shopName'));
    setPartnerId(await AsyncStorage.getItem('partner_id'));
  };

  const notificationToCustomer = async () => {
    const CUSTOMER_FIREBASE_API_KEY = customer_firebase_key;
    const message = {
      to: customerToken,
      notification: {
        title: 'Order Confirmation',
        body:
          partnerShop +
          ' ' +
          'has accepted your order. Please wait while we search for a delivery partner for you',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Order Confirmation',
        body:
          partnerShop +
          ' ' +
          'has accepted your order. Please wait while we search for a delivery partner for you',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });
    // https://fcm.googleapis.com/fcm/send
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  const notificationToPartner = async (userToken, customerName) => {
    const FIREBASE_API_KEY = delivery_partner_firebase_key;
    const message = {
      to: userToken,
      notification: {
        title: 'New Order',
        body:
          'You have received a new order from' +
          ' ' +
          customerName +
          ' ' +
          '.Click here to go to pick up location',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'New Order',
        body:
          'You have received a new order from' +
          ' ' +
          customerName +
          ' ' +
          '.Click here to go to pick up location',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });
    // https://fcm.googleapis.com/fcm/send
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  // status update
  const updtateStatus = async (status, customername) => {
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=update_order_status',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_status: status,
          order_id: orderId,
          partner_lan: lat,
          partner_long: long,
          customer_token: customerToken,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          setOrderStatus(status);
          if (status === '3') {
            setToggleCheckBoxTwo(true);
            setModalVisible(false);
            navigation.navigate('HomeScreen');
          }
          if (status === '2') {
            notificationToCustomer();
            setOrderStatus(status);
            searchDeliveryPartner(customername);
            setToggleCheckBoxOne(true);
          }
        } else {
          if (status === '3') {
            setToggleCheckBoxTwo(false);
            setModalVisible(false);
          }
          if (status === '2') {
            setToggleCheckBoxOne(false);
          }
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  // Search Delivery Partner
  const searchDeliveryPartner = async customername => {
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getNearestDeliveryPartner',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_lan: lat,
          partner_long: long,
          order_id: orderId,
          partner_id: partnerId,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        // console.log(result);
        if (result.error == 0) {
          let name = result.fullname;
          let number = result.contactNumber;
          let token = result.userToken;
          setDeliveryPartnerName(name);
          setDeliveryPartnerContactNumber(number);
          // setDeliveryPartnerToken(result.userToken);
          notificationToPartner(token, customername);
          getOrderDetails(orderId);
        } else {
          console.log('Error: ' + JSON.stringify(result));
        }
      });
  };

  // Search Delivery Partner
  // const searchDeliveryPartner = async () => {
  //   let status = orderStatus;
  //   await fetch(
  //     'https://gizmmoalchemy.com/api/pantryo/DeliveryPartnerApi/DeliveryPartner.php?flag=deliveryPartnerStatus',
  //     {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         partner_lat: lat,
  //         partner_long: long,
  //         order_id: orderId,
  //         partner_id: partnerId,
  //         delivery_status: orderStatus,
  //       }),
  //     },
  //   )
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (result) {
  //       console.log(
  //         'Partner Lat:' +
  //           lat +
  //           'Partner Long: ' +
  //           long +
  //           'order ID: ' +
  //           orderId +
  //           'Partner ID: ' +
  //           partnerId +
  //           'delivery Status: ' +
  //           orderStatus,
  //       );
  //       console.log(
  //         'Search delivery partner API Response: ' + JSON.stringify(result),
  //       );
  //       if (result.error == 0) {
  //         // notificationToDelivery();
  //         setDeliveryPartnerImg(result.data.profileImage);
  //         setDeliveryPartnerName(result.data.fullname);
  //         setDeliveryPartnerContactNumber(result.data.contactNumber);
  //         setDeliveryPartnerToken(result.data.userToken);
  //       } else {
  //         console.log('Error: ' + JSON.stringify(result));
  //       }
  //     });
  // };

  // Send  Otp to delivery Boy
  const sentOtpToDeliveryBoy = async () => {
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=send_otp',
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        // console.log(result);
        if (result.error == 1) {
          setUserConfirmationOtp(result.otp);
          setModalVisible(true);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  ////////////Order Details
  const getOrderDetails = async order_id => {
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getTodayOrderOfPartnerDetails',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: order_id,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          setOrderDetails(result.todayorderdetails);
          let status = result.todayorderdetails[0].orderStatus;
          let deliveryPartnerOtp =
            result.todayorderdetails[0].deliveryPartnerOtp;
          let customerToken = result.todayorderdetails[0].customer_token;
          setCustomerToken(customerToken);
          if (status === '2') {
            setToggleCheckBoxOne(true);
          }
          if (status == '3') {
            setToggleCheckBoxOne(true);
            setToggleCheckBoxTwo(true);
            if (deliveryPartnerOtp) {
              setModalVisible();
            }
          }
        }
        getOrderDetails(orderId);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  ////////////Order Details
  const checkOtpUserByEntered = async () => {
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=MatchSecurityCodePartner',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          security_code: enteredOtp,
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          setModalVisible(false);
        }
        getOrderDetails(orderId);
      })
      .catch(error => {
        console.error(error);
      });
  };

  /////////Call Persmission
  const requestCallPermission = async deliveryNumber => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: 'Pantryo Shop Partner App Call Permission',
          message: 'Pantryo Shop Partner needs access to your Dialer',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the Dialer');
        let number = 'tel:${' + deliveryNumber + '}';
        Linking.openURL(number);
      } else {
        console.log('Dialer permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    getUserProfile();
    setOrderId(route.params.order_id);
    setLat(route.params.latitude);
    setLong(route.params.longitude);
    getOrderDetails(route.params.order_id);
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
  }, []);

  return (
    <>
      {isLoading == true ? (
        <Loader />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{width: '100%'}}
          scrollEnabled={true}
          data={orderDetails}
          renderItem={({item}) => (
            <>
              {/* ======== Order Details Start ======== */}
              <View style={styles.card}>
                <View style={styles.div}>
                  <Text style={styles.heading}>Order Details</Text>

                  <View style={styles.tabRow}>
                    <Text style={styles.label}>OrderID: </Text>
                    <Text style={styles.response}>{item.orderId}</Text>
                  </View>

                  <View style={styles.tabRow}>
                    <Text style={styles.label}>Customer: </Text>
                    <Text style={styles.response}>{item.customer_name}</Text>
                  </View>
                </View>
              </View>
              {/* ======== Order Details Start ======== */}

              {/* ======== Products Details Start ======== */}
              <View style={styles.card}>
                <View style={styles.div}>
                  <Text style={styles.heading}>Products to be packed</Text>
                  <FlatList
                    data={item.TodayOrderOneIdWise}
                    keyExtractor={item => item.cart_id}
                    renderItem={({item}) => (
                      <View style={styles.tabRow}>
                        <View style={styles.section}>
                          <Text style={styles.brandName}>{item.brandName}</Text>
                          <Text style={styles.product}>{item.productName}</Text>
                        </View>
                        <Text style={styles.weight}>
                          {item.productQty}
                          {item.productUnit}
                        </Text>
                        <Text style={styles.qty}>X {item.numberOfProduct}</Text>
                        <Text style={styles.cost}>₹{item.productPrice}</Text>
                      </View>
                    )}
                  />
                </View>
              </View>
              {/* ======== Products Details Start ======== */}

              {/* ======== Checkbox Section Start ======== */}
              <View style={[styles.card, {marginBottom: 40}]}>
                <View style={[styles.div]}>
                  <Text style={styles.heading}>Action</Text>

                  <View style={styles.tabRow}>
                    <Text style={styles.statusName}>Confirm Order</Text>
                    {toggleCheckBoxOne == false ? (
                      <CheckBox
                        disabled={false}
                        value={toggleCheckBoxOne}
                        onValueChange={() => {
                          updtateStatus('2', item.customer_name);
                          // setCustomerName();
                        }}
                        style={styles.statusOne}
                        lineWidth={2}
                        hideBox={false}
                        boxType={'circle'}
                        tintColors={'#9E663C'}
                        onCheckColor={'#6F763F'}
                        onFillColor={'#4DABEC'}
                        onTintColor={'#F4DCF8'}
                      />
                    ) : (
                      <CheckBox
                        disabled={true}
                        value={toggleCheckBoxOne}
                        style={styles.statusOne}
                        lineWidth={2}
                        hideBox={false}
                        boxType={'circle'}
                        tintColors={'#9E663C'}
                        onCheckColor={'#6F763F'}
                        onFillColor={'#4DABEC'}
                        onTintColor={'#F4DCF8'}
                      />
                    )}
                  </View>

                  {toggleCheckBoxOne ? (
                    <>
                      <View style={styles.deliveryContainer}>
                        <View style={styles.delRow}>
                          {item.deliveryPartnerImage !== '' ? (
                            <Image
                              source={{uri: item.deliveryPartnerImage}}
                              style={styles.delImg}
                            />
                          ) : (
                            <Text>Searching for Delivery Partner</Text>
                          )}
                        </View>

                        {item.deliveryPartnerNumber &&
                        item.deliveryPartnerName !== '' ? (
                          <View style={styles.delDetails}>
                            <Text style={styles.delName}>
                              {item.deliveryPartnerName}
                            </Text>
                            <Pressable
                              onPress={() => {
                                requestCallPermission(
                                  item.deliveryPartnerNumber,
                                );
                              }}>
                              <Text style={styles.delNumber}>
                                {item.deliveryPartnerNumber}
                              </Text>
                            </Pressable>
                          </View>
                        ) : (
                          <ActivityIndicator />
                        )}

                        {item.deliveryPartnerNumber == '' &&
                        item.deliveryPartnerName == '' ? (
                          <View style={styles.delDetails}>
                            <Text style={styles.delName}>
                              {deliveryPartnerName}
                            </Text>
                            <Pressable
                              onPress={() => {
                                requestCallPermission(
                                  deliveryPartnerContactNumber,
                                );
                              }}>
                              <Text style={styles.delNumber}>
                                {deliveryPartnerContactNumber}
                              </Text>
                            </Pressable>
                          </View>
                        ) : (
                          <ActivityIndicator />
                        )}
                      </View>
                      <View style={styles.readyBtn}>
                        <Text style={styles.readyBtnTxt}>Order Ready</Text>
                      </View>
                    </>
                  ) : null}
                </View>
              </View>
              {/* ======== Checkbox Section Start ======== */}

              {/* ======= Modal ======= */}

              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalCard}>
                    <Text style={styles.modalText}>
                      {deliveryPartnerName}
                      Enter Confirmation Code provided by Delivery Partner to
                      confirm order handover
                    </Text>
                    <TextInput
                      placeholder="Enter 6 Digit Code"
                      placeholderTextColor="#777"
                      style={styles.modalInput}
                      keyboardType="number-pad"
                      onChangeText={text => setEnteredOtp(text)}
                    />
                    <Pressable
                      onPress={() => checkOtpUserByEntered()}
                      style={styles.modalBtn}>
                      <Text style={styles.modalBtnTxt}>SUBMIT</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              {/* ======= Modal ======= */}
            </>
          )}
        />
      )}
    </>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 5,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.34,
    // shadowRadius: 6.27,
    // elevation: 10,
    borderWidth: 1.5,
    borderColor: '#c7c7c7c7',
  },
  div: {
    width: '100%',
  },
  heading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
  },
  tabRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  response: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#5E3360',
  },
  section: {
    flex: 1,
    marginLeft: 10,
  },
  brandName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  product: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    flex: 1,
  },
  weight: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    marginRight: 20,
  },
  qty: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#000',
    marginRight: 20,
  },
  cost: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    marginRight: 10,
    color: 'green',
  },
  statusName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    flex: 1,
  },
  statusOne: {
    marginRight: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  modalInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    color: '#000',
  },
  modalBtn: {
    marginTop: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#5E3360',
    marginBottom: 30,
  },
  modalBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#ffff',
  },
  readyBtn: {
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5E3360',
    paddingVertical: 20,
    borderRadius: 5,
  },
  readyBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#fff',
  },
  deliveryContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#5E3360',
  },
  delRow: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  delDetails: {
    flex: 1,
    marginLeft: 15,
  },
  delName: {
    color: '#000',
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
  },
  delNumber: {
    color: 'green',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    marginTop: 5,
  },
});
