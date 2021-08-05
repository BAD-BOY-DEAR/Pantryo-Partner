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
} from 'react-native';

// ===== Library ===== //
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
navigator.geolocation = require('@react-native-community/geolocation');
import Icons from 'react-native-vector-icons/Ionicons';

// ===== Images ===== //
import deliveryBoy from '../../../assets/icons/delivery.gif';

const OrderDetails = ({route, navigation}) => {
  const NO_LOCATION_PROVIDER_AVAILABLE = 2;
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [totalItem, setTotalItem] = React.useState('');
  const [enteredOtp, setEnteredOtp] = React.useState('');
  const [userConfirmationOtp, setUserConfirmationOtp] = React.useState('');
  const [orderStatus, setOrderStatus] = React.useState('');
  const [toggleCheckBoxOne, setToggleCheckBoxOne] = useState(false);
  const [toggleCheckBoxTwo, setToggleCheckBoxTwo] = useState(false);
  const [lat, setLat] = React.useState('');
  const [long, setLong] = React.useState('');
  const [currentLocation, setCurrentLocation] = React.useState('');

  // Delivery boy Variables
  const [deliveryPartnerName, setDeliveryPartnerName] = React.useState('');
  const [deliveryPartnerContactNumber, setDeliveryPartnerContactNumber] =
    React.useState('');
  const [deliveryPartnerModal, setDeliveryPartnerModal] = useState(false);

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

  // status update
  const updtateStatus = async status => {
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
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result.msg);
        if (result.error == 0) {
          setOrderStatus(status);
          if (status === '3') {
            setToggleCheckBoxTwo(true);
            setModalVisible(false);
            navigation.navigate('HomeScreen');
          }
          if (status === '2') {
            searchDeliveryPartner();
            setToggleCheckBoxOne(true);
            console.log(long);
            console.log(lat);
            // setModalVisible(true);
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
  const searchDeliveryPartner = async () => {
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
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result);
        if (result.error == 0) {
          setDeliveryPartnerName(result.data.fullname);
          setDeliveryPartnerContactNumber(result.data.contactNumber);
        } else {
          console.log('Error: ' + JSON.stringify(result));
        }
      });
  };

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

  // Checked Otp
  const checkOtpUserByEntered = async () => {
    if (userConfirmationOtp == enteredOtp) {
      updtateStatus('3');
    } else {
      alert('Otp Not Matched!!');
    }
  };

  React.useEffect(() => {
    requestLocationPermission();
    setOrderId(route.params.order_id);
    setTotalItem(route.params.totalItem);
    setCustomerName(route.params.customer_name);
    if (route.params.orderStatus == '2') {
      setToggleCheckBoxOne(true);
    }
    if (route.params.orderStatus == '3') {
      setToggleCheckBoxOne(true);
      setToggleCheckBoxTwo(true);
    }
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
    console.log(deliveryPartnerName);
    console.log(deliveryPartnerContactNumber);
  }, []);

  return (
    <>
      <ScrollView style={styles.scroll} scrollEnabled={true}>
        {/* ======== Order Details Start ======== */}
        <View style={styles.card}>
          <View style={styles.div}>
            <Text style={styles.heading}>Order Details</Text>

            <View style={styles.tabRow}>
              <Text style={styles.label}>OrderID: </Text>
              <Text style={styles.response}>{orderId}</Text>
            </View>

            <View style={styles.tabRow}>
              <Text style={styles.label}>Customer: </Text>
              <Text style={styles.response}>{customerName}</Text>
            </View>
          </View>
        </View>
        {/* ======== Order Details Start ======== */}

        {/* ======== Products Details Start ======== */}
        <View style={styles.card}>
          <View style={styles.div}>
            <Text style={styles.heading}>Products to be packed</Text>
            <FlatList
              data={totalItem}
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
                  onValueChange={() => updtateStatus('2')}
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
                <View
                  style={{
                    marginTop: 20,
                    width: '100%',
                  }}>
                  <View>
                    <Icons name="image-outline" size={25} />
                  </View>
                  <Text
                    style={{
                      color: '#000',
                    }}>
                    {deliveryPartnerName}
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                    }}>
                    {deliveryPartnerContactNumber}
                  </Text>
                </View>
                <View style={styles.readyBtn}>
                  <Text style={styles.readyBtnTxt}>Order Ready</Text>
                </View>
                {/* <View style={styles.tabRow}>
                  <Text style={[styles.statusName, {color: 'green'}]}>
                    Order Ready
                  </Text>
                  {modalVisible ? (
                    <CheckBox
                      disabled={true}
                      lineWidth={2}
                      hideBox={false}
                      boxType={'circle'}
                      tintColors={'#9E663C'}
                      onCheckColor={'#6F763F'}
                      onFillColor={'#4DABEC'}
                      onTintColor={'#F4DCF8'}
                      value={toggleCheckBoxTwo}
                      onValueChange={newValue => settoggleCheckBoxTwo(newValue)}
                      style={styles.statusOne}
                    />
                  ) : (
                    <>
                      {toggleCheckBoxTwo == false ? (
                        <CheckBox
                          disabled={false}
                          lineWidth={2}
                          hideBox={false}
                          boxType={'circle'}
                          tintColors={'#9E663C'}
                          onCheckColor={'#6F763F'}
                          onFillColor={'#4DABEC'}
                          onTintColor={'#F4DCF8'}
                          value={toggleCheckBoxTwo}
                          // onValueChange={() => sentOtpToDeliveryBoy()}
                          style={styles.statusOne}
                          // onValueChange={() => setModalVisible(true)}
                          onChange={() => setModalVisible(true)}
                        />
                      ) : (
                        <CheckBox
                          disabled={true}
                          lineWidth={2}
                          hideBox={false}
                          boxType={'circle'}
                          tintColors={'#9E663C'}
                          onCheckColor={'#6F763F'}
                          onFillColor={'#4DABEC'}
                          onTintColor={'#F4DCF8'}
                          value={toggleCheckBoxTwo}
                          style={styles.statusOne}
                        />
                      )}
                    </>
                  )}
                </View> */}
              </>
            ) : null}
          </View>
        </View>
        {/* ======== Checkbox Section Start ======== */}

        {deliveryPartnerName !== '' ? (
          <>
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
                    onPress={checkOtpUserByEntered}
                    style={styles.modalBtn}>
                    <Text style={styles.modalBtnTxt}>SUBMIT</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* ======= Modal ======= */}
          </>
        ) : null}
      </ScrollView>
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
});
