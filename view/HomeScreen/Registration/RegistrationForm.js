import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  PermissionsAndroid,
  Image,
  ToastAndroid,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
import * as ImagePicker from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import {Picker} from '@react-native-picker/picker';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import LoaderScreen from '../../../controller/LoaderScreen';
import {event, onChange, set} from 'react-native-reanimated';
import {AuthContext} from '../../../controller/Utils';
import messaging from '@react-native-firebase/messaging';

function RegisterScreen({navigation, route}) {
  const {signIn} = React.useContext(AuthContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ]);
  const [storeImage, setStoreImage] = React.useState('');
  const [storeImagePath, setStoreImagePath] = React.useState('');
  const [shopName, setShopName] = React.useState('');
  const [gstNumber, setGSTNumber] = React.useState('');
  const [gstStatus, setGSTStatus] = React.useState('');
  const [partnerCategory, setPartnerCategory] = React.useState('');
  const [partnerCategoryId, setPartnerCategoryId] = React.useState('');
  const [partnerAllCategory, setPartnerAllCategory] = React.useState('');
  const [partnerContactNumber, setPartnerContactNumber] = React.useState();
  const [partnerAddress, setPartnerAddress] = React.useState('');
  const [partnerShopAddress, setPartnerShopAddress] = React.useState('');
  const [partnerPinCode, setPartnerPinCode] = React.useState('');
  const [bankHolderName, setBankHolderName] = React.useState('');
  const [bankName, setBankName] = React.useState('');
  const [bankAccountNumber, setBankAccountNumber] = React.useState('');
  const [bankISFCCode, setBankISFCCode] = React.useState('');
  const [addressPlaceHolder, setAddressPlaceHolder] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [upiId, setUPIID] = React.useState('');
  const [FCMToken, setFCMToken] = React.useState('');

  // FCM Token
  function getFCMToken() {
    messaging()
      .getToken()
      .then(token => {
        setFCMToken(token);
      });
  }

  // Take Image
  async function requestGalleryPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Pantryo Partner Camera Permission',
          message: 'Pantryo Partner  needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // let SelectFor = selectForImage;
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          maxWidth: 900,
          maxHeight: 900,
          quality: 1,
          videoQuality: 'medium',
          durationLimit: 30,
          includeBase64: true,
        };
        await ImagePicker.launchImageLibrary(options, res => {
          if (res) {
            if (res.errorCode == 'permission') {
              alert('Permission not granted');
              return;
            } else if (res.errorCode == 'others') {
              alert(res.errorMessage);
              return;
            } else if (res.didCancel) {
              console.log('User cancelled image picker');
            } else {
              let temp = {name: res.fileName, uri: res.uri, type: res.type};
              setStoreImagePath(res.uri);
              setStoreImage(temp);
            }
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  // Registration Api
  function registrationApi() {
    if (!shopName) {
      showToast('Shop Name is mandatory');
      return;
    } else if (!gstStatus) {
      showToast('Select your GST Status');
      return;
    } else if (!partnerCategoryId) {
      showToast('Select category field cannot be empty');
      return;
    } else if (!partnerContactNumber) {
      showToast('Contact number is mandatory to receive orders');
      return;
    } else if (!partnerShopAddress) {
      showToast('Shop Address is required to pickup customer orders');
      return;
    } else if (!partnerPinCode) {
      showToast('Pincode is required to locate you');
      return;
    } else {
      if (gstStatus == 'Yes') {
        if (!gstNumber) {
          showToast('Please enter your GST number');
          return;
        }
      }
      const data = new FormData();
      data.append('partner_shopName', shopName);
      data.append('partner_category', partnerCategoryId);
      data.append('partner_gstStatus', gstStatus);
      data.append('partner_gstNumber', gstNumber);
      data.append('partner_shopaddress', partnerShopAddress);
      data.append('partner_pincode', partnerPinCode);
      data.append('partner_contactNumber', partnerContactNumber);
      data.append('partner_accountNumber', bankAccountNumber);
      data.append('partner_bankAccountHolderName', bankHolderName);
      data.append('partner_bankName', bankName);
      data.append('partner_bankISFCCode', bankISFCCode);
      data.append('partner_upiId', upiId);
      data.append('partner_storeImage', storeImage);
      data.append('partner_deviceId', FCMToken);
      data.append('partner_email', email);
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartnerRegistration.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body: data,
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // console.log(result);
          if (result.error == 0) {
            let partner_id = result.partner_id;
            let partner_contactNumber = result.partner_contactNumber;
            let partner_shopName = result.partner_shopName;
            let partner_category = result.partner_category;
            let partner_categoryName = result.partner_category_name;
            let partner_pincode = result.partner_pincode;
            let partner_shopaddress = result.partner_shopaddress;
            let partner_storeImage = result.partner_storeImage;
            let partner_kycStatus = result.partner_kycStatus;
            let partner_paymentStatus = result.partner_paymentStatus;
            let user_token = result.user_token;
            let user_lat = result.partner_lat;
            let user_long = result.partner_long;
            let user_verification = result.partner_verificationStatus;
            signIn({
              partner_id,
              partner_contactNumber,
              partner_shopName,
              partner_category,
              partner_categoryName,
              partner_pincode,
              partner_shopaddress,
              partner_storeImage,
              partner_kycStatus,
              partner_paymentStatus,
              user_token,
              user_lat,
              user_long,
              user_verification,
            });
            // navigation.navigate('UploadDocs');
          } else if (result.error == 2) {
            showToast(result.msg);
            // navigation.navigate('HomeScreen');
          } else {
            showToast('Something went wrong');
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }

  // Get user location
  function getOneTimeLocation() {
    setAddressPlaceHolder('Getting Location ...');
    navigator.geolocation.getCurrentPosition(
      position => {
        setAddressPlaceHolder('You are Here..');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        fetch(
          'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getAddressByLongitudeLatitude',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              longitude: currentLongitude,
              latitude: currentLatitude,
            }),
          },
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {
            setPartnerAddress(result);
            setPartnerShopAddress(result);
          })
          .catch(error => {
            console.error(error);
          });
      },
      error => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000,
      },
    );
  }

  // Get user location
  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  // Fetch Partner Category
  function fetchPartnerCategoryApi() {
    setLoading(true);
    fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getAllPartnerCategory',
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          setPartnerAllCategory(result.AllCategory);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  // Location Permission
  async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const check = React.useMemo(
    () => async () => {
      getFCMToken();
      fetchPartnerCategoryApi();
      setPartnerContactNumber(route.params.partner_contactNumber);
      return () => {
        // Geolocation.clearWatch({watchID});
        setLoading(false);
      };
    },
    [],
  );

  React.useEffect(() => {
    //Device Id
    // getFCMToken();
    ////Partner Category
    // fetchPartnerCategoryApi();
    //set Partner Contact Number
    // setPartnerContactNumber(route.params.partner_contactNumber);
    ///Location
    // requestLocationPermission();
    //clear Watch Id
    // return () => {
    //   // Geolocation.clearWatch({watchID});
    //   setLoading(false);
    // };
    check();
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* ========== STEP 1 ========== */}
          <View style={styles.box}>
            <Text style={styles.stepNo}>STEP 1</Text>
            <Text style={styles.stepCaption}>Enter your business details</Text>

            {/* Upload Logo Start */}
            <View style={styles.section}>
              <View style={styles.circle}>
                {storeImagePath === '' ? (
                  <Icons
                    name="cloud-upload-outline"
                    size={30}
                    color="#5E3360"
                  />
                ) : (
                  <Image
                    source={{uri: storeImagePath}}
                    style={{
                      height: 150,
                      width: 150,
                      borderRadius: 100,
                    }}
                  />
                )}
              </View>
              <Text style={styles.sectionCaption}>
                Upload store image or logo
              </Text>
              <TouchableOpacity
                onPress={() => requestGalleryPermission()}
                style={styles.uploadBtn}>
                <Text style={styles.uploadBtnTxt}>UPLOAD</Text>
              </TouchableOpacity>
            </View>
            {/* Upload Logo End */}

            {/* Shop Name Start */}
            <View style={styles.section}>
              <Text style={styles.label}>Shop Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder=""
                  onChangeText={txt => setShopName(txt)}
                  require
                  autoCapitalize="words"
                  style={styles.input}
                  value={shopName}
                />
              </View>
            </View>
            {/* Shop Name End */}

            {/* GST Start */}
            <View style={styles.section}>
              <Text style={styles.label}>Are you registered under GST?</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={gstStatus}
                  style={{height: 50, width: '100%'}}
                  onValueChange={(itemValue, itemIndex) =>
                    setGSTStatus(itemValue)
                  }>
                  <Picker.Item
                    label="Are you registered under GST?"
                    value=""
                    color="#fff"
                  />
                  <Picker.Item label="Yes" value="Yes" color="#fff" />
                  <Picker.Item label="No" value="No" color="#fff" />
                </Picker>
              </View>
            </View>
            {/* GST End */}

            {/* GST Number Start */}
            {gstStatus === 'Yes' ? (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Please enter your GST number</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder=""
                      onChangeText={txt => setGSTNumber(txt)}
                      autoCapitalize="characters"
                      style={styles.input}
                      value={gstNumber}
                    />
                  </View>
                </View>
              </>
            ) : null}
            {/* GST Number End */}

            {/* Contact Number Start */}
            <View style={styles.section}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder=""
                  onChangeText={txt => setPartnerContactNumber(txt)}
                  require
                  keyboardType="phone-pad"
                  style={styles.input}
                  maxLength={10}
                  value={partnerContactNumber}
                />
              </View>
            </View>
            {/* Contact Number End */}

            {/* Email Start */}
            <View style={styles.section}>
              <Text style={styles.label}>Email ID (optional)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder=""
                  onChangeText={txt => setEmail(txt)}
                  keyboardType="email-address"
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>
            {/* Email End */}

            {/* Address Start */}
            <View style={styles.section}>
              <Text style={styles.label}>Shop Address (Full Address)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder=""
                  onChangeText={txt => setPartnerShopAddress(txt)}
                  require
                  keyboardType="default"
                  autoCapitalize="words"
                  style={styles.input}
                  value={partnerShopAddress}
                />
              </View>
            </View>
            {/* Address End */}

            {/* Pincode Start */}
            <View style={styles.section}>
              <Text style={styles.label}>Pincode</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder=""
                  onChangeText={txt => setPartnerPinCode(txt)}
                  require
                  keyboardType="number-pad"
                  style={styles.input}
                  value={partnerPinCode}
                />
              </View>
            </View>
            {/* Pincode End */}
          </View>
          {/* ========== STEP 1 ========== */}

          {/* ========== STEP 2 ========== */}
          <View style={styles.box}>
            <Text style={styles.stepNo}>STEP 2</Text>
            <Text style={styles.stepCaption}>Select your category</Text>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder=""
                  onChangeText={txt => setPartnerCategory(txt)}
                  require
                  keyboardType="default"
                  style={styles.input}
                  value={partnerCategory}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* ========== STEP 2 ========== */}

          {/* ========== SUBMIT BUTTON START ========== */}
          <TouchableOpacity
            onPress={() => registrationApi()}
            style={styles.btn}>
            <Text style={styles.btnTxt}>SUBMIT</Text>
          </TouchableOpacity>
          {/* ========== SUBMIT BUTTON END ========== */}
        </View>
      </ScrollView>

      {/* ======= Business Category Selection Modal Start ======= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <FlatList
              data={partnerAllCategory}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => {
                    setPartnerCategory(item.partner_category_name);
                    setPartnerCategoryId(item.partner_category_id);
                    setModalVisible(false);
                  }}
                  style={{paddingVertical: 20}}>
                  <Text style={styles.catName}>
                    {item.partner_category_name}
                  </Text>
                </Pressable>
              )}
              keyExtractor={item => item.partner_category_id}
            />
          </View>
        </View>
      </Modal>
      {/* ======= Business Category Selection Modal End ======= */}
    </>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  box: {
    width: '100%',
    marginBottom: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    paddingBottom: 40,
  },
  stepNo: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
  },
  stepCaption: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  section: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  circle: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#c7c7c7c7',
    borderRadius: 100,
    marginBottom: 20,
  },
  sectionCaption: {
    alignSelf: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  uploadBtn: {
    alignSelf: 'center',
    marginTop: 10,
    width: '40%',
    backgroundColor: '#5E3360',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 100,
  },
  uploadBtnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#fff',
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1.5,
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 5,
    borderColor: '#5E3360',
    paddingHorizontal: 10,
  },
  input: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#000',
  },
  btn: {
    marginBottom: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#5E3360',
  },
  btnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#fff',
  },
  modalContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  catName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    width: '100%',
  },
});
