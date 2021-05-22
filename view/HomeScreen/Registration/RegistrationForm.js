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
  Picker,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from '@react-native-community/geolocation';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
///========Screen Loader==========///
import LoaderScreen from '../../../controller/LoaderScreen';
import {event, onChange, set} from 'react-native-reanimated';
import {AuthContext} from '../../../controller/Utils';

const RegisterScreen = ({navigation, route}) => {
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
  const [partnerContactNumber, setPartnerContactNumber] = React.useState();
  const [partnerAddress, setPartnerAddress] = React.useState('');
  const [bankHolderName, setBankHolderName] = React.useState('');
  const [bankName, setBankName] = React.useState('');
  const [bankAccountNumber, setBankAccountNumber] = React.useState('');
  const [bankISFCCode, setBankISFCCode] = React.useState('');
  const [addressPlaceHolder, setAddressPlaceHolder] = React.useState('');

  ///Take Image
  const requestGalleryPermission = async () => {
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
  };

  ////======Registration Api=============////
  const registrationApi = async () => {
    if (!shopName) {
      showToast('Please Enter Your Shop Name');
      return;
    } else if (!gstStatus) {
      showToast('Please Choose GST  registartion Status');
      return;
    } else if (gstStatus == 'Yes') {
      if (!gstNumber) {
        showToast('Please Enter Your GST Number');
        return;
      }
    } else if (!partnerCategory) {
      showToast('Please Enter Your Category');
      return;
    } else if (!partnerContactNumber) {
      showToast('Please Enter Your Contact Number');
      return;
    } else if (!partnerAddress) {
      showToast('Please Enter Your Full Address');
      return;
    } else if (!bankHolderName) {
      showToast('Please Enter Your Bank Account Holder Name');
      return;
    } else if (!bankAccountNumber) {
      showToast('Please Enter Your Bank Account Number');
      return;
    } else if (!bankName) {
      showToast('Please Enter Your Bank Name');
      return;
    } else if (!bankISFCCode) {
      showToast('Please Enter Your Bank ISFC Code');
      return;
    } else {
      const data = new FormData();
      data.append('partner_shopName', shopName);
      data.append('partner_category', partnerCategory);
      data.append('partner_gstStatus', gstStatus);
      data.append('partner_gstNumber', gstNumber);
      data.append('partner_address', partnerAddress);
      data.append('partner_contactNumber', partnerContactNumber);
      data.append('partner_accountNumber', bankAccountNumber);
      data.append('partner_bankAccountHolderName', bankHolderName);
      data.append('partner_bankName', bankName);
      data.append('partner_bankISFCCode', bankISFCCode);
      data.append('partner_storeImage', storeImage);
      setLoading(true);
      fetch(
        'https://lmis.in/PantryoApp/PartnerAppApi/PantryoPartnerRegistration.php',
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
          if (result.error == 0) {
            let partner_id = result.partner_id;
            let partner_contactNumber = result.partner_contactNumber;
            let partner_shopName = result.partner_shopName;
            signIn({partner_id, partner_contactNumber, partner_shopName});
          } else if (result.error == 2) {
            showToast(result.msg);
            navigation.navigate('UploadDocs');
          } else {
            showToast('Something went wrong');
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };
  ////======Registration Api=============////

  ///////======Get user location==========//////////
  const getOneTimeLocation = () => {
    setAddressPlaceHolder('Getting Location ...');
    watchID = Geolocation.getCurrentPosition(
      position => {
        setAddressPlaceHolder('You are Here..');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        fetch(
          'https://lmis.in/PantryoApp/PartnerAppApi/PantryoPartner.php?flag=getAddressByLongitudeLatitude',
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
  };
  ///////======Get user location==========//////////
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  React.useEffect(() => {
    setPartnerContactNumber(route.params.partner_contactNumber);
    const requestLocationPermission = async () => {
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
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch({watchID});
      setLoading(false);
    };
  }, []);

  return (
    <>
      {isLoading === true ? <LoaderScreen /> : null}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.screenDescription}>
            Enter your business/shop details
          </Text>

          {/* ======= Store Logo Section ======= */}
          <View style={styles.imgContainer}>
            <Pressable
              onPress={() => requestGalleryPermission()}
              style={styles.imgBox}>
              {storeImagePath === '' ? (
                <Icons name="image-outline" size={30} color="#C6B5C7" />
              ) : (
                <Image
                  source={{uri: storeImagePath}}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 7,
                  }}
                />
              )}
            </Pressable>
            {storeImagePath === '' ? (
              <Text style={styles.imgLabel}>Upload Store Logo (if any)</Text>
            ) : (
              <Text style={styles.imgLabel}>Upload Store Logo Uploaded</Text>
            )}
          </View>
          {/* ======= Store Logo Section ======= */}

          {/* ======= Business Name Section ======= */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>BUSINESS/SHOP NAME</Text>
            <View style={styles.formRow}>
              <Icons name="business-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
                onChangeText={txt => setShopName(txt)}
              />
            </View>
          </View>
          {/* ======= Business Name Section ======= */}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>GST REGISTERED</Text>
            <View style={[styles.formRow, {marginTop: 10}]}>
              <Icons name="flag-outline" size={20} color="#5E3360" />
              <Picker
                selectedValue={gstStatus}
                style={{height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) =>
                  setGSTStatus(itemValue)
                }>
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
              {/* <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                bottomOffset={100}
                containerStyle={{
                  backgroundColor: '#FFFFFF',
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 0.5,
                }}
                textStyle={{
                  fontFamily: 'OpenSans-Regular',
                  backgroundColor: '#FFFFFF',
                }}
              /> */}
            </View>
          </View>

          {/* ======= GST Number ======= */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>GST NUMBER</Text>
            <View style={styles.formRow}>
              <Icons name="grid-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder="Optional"
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="characters"
                onChangeText={txt => setGSTNumber(txt)}
              />
            </View>
          </View>
          {/* ======= GST Number ======= */}

          {/* ======= Business Category ======= */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>CATEGORY</Text>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={styles.formRow}>
              <Icons name="list-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder="Choose  Category"
                placeholderTextColor="#777"
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
                editable={false}
                value={partnerCategory}
                onChangeText={txt => setPartnerCategory(txt)}
              />
            </Pressable>
          </View>
          {/* ======= Business Category ======= */}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>CONTACT NUMBER</Text>
            <View style={styles.formRow}>
              <Text style={{fontFamily: 'OpenSans-SemiBold', fontSize: 16}}>
                +91
              </Text>
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                keyboardType="phone-pad"
                maxLength={10}
                value={partnerContactNumber}
                onChangeText={txt => setPartnerContactNumber(txt)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>GPS LOCATION</Text>
            <View style={styles.formRow}>
              <Icons name="location-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder={addressPlaceHolder}
                placeholderTextColor="#777"
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
                value={partnerAddress}
                onChangeText={txt => setPartnerAddress(txt)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>SHOP ADDRESS</Text>
            <View style={styles.formRow}>
              <Icons name="location-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                placeholderTextColor="#777"
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>BANK ACCOUNT HOLDER NAME</Text>
            <View style={styles.formRow}>
              <Icons name="business-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
                onChangeText={txt => setBankHolderName(txt)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>BANK NAME</Text>
            <View style={styles.formRow}>
              <Icons name="business-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
                onChangeText={txt => setBankName(txt)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>BANK ACCOUNT NUMBER</Text>
            <View style={styles.formRow}>
              <Icons name="business-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                keyboardType="number-pad"
                onChangeText={txt => setBankAccountNumber(txt)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>BANK ISFC CODE</Text>
            <View style={styles.formRow}>
              <Icons name="business-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                keyboardType="default"
                autoCapitalize="characters"
                onChangeText={txt => setBankISFCCode(txt)}
              />
            </View>
          </View>

          <Pressable onPress={() => registrationApi()} style={styles.btn}>
            <Text style={styles.btnTxt}>CONTINUE</Text>
          </Pressable>
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
            <View style={styles.modalHeadingRow}>
              <Text style={styles.modalHeadingTxt}>
                Select Business Category
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Icons name="close-circle-outline" size={25} />
              </Pressable>
            </View>

            <ScrollView>
              <Pressable
                onPress={() => {
                  setPartnerCategory('Kirana Store, FMCG & Grocery Store');
                  setModalVisible(false);
                }}
                style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>
                  Kirana Store, FMCG & Grocery Store
                </Text>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
              </Pressable>

              <Pressable
                onPress={() => {
                  setPartnerCategory('Fruits & Vegetables');
                  setModalVisible(false);
                }}
                style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Fruits & Vegetables</Text>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
              </Pressable>

              <Pressable
                onPress={() => {
                  setPartnerCategory('Meat, Chicken & Fish Store');
                  setModalVisible(false);
                }}
                style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>
                  Meat, Chicken & Fish Store
                </Text>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
              </Pressable>

              <Pressable
                onPress={() => {
                  setPartnerCategory('Home Decoration & Electronic Appliances');
                  setModalVisible(false);
                }}
                style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>
                  Home Decoration & Electronic Appliances
                </Text>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
              </Pressable>

              <Pressable
                onPress={() => {
                  setPartnerCategory('Dairy Shops');
                  setModalVisible(false);
                }}
                style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Dairy Shops</Text>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
              </Pressable>

              <Pressable
                onPress={() => {
                  setPartnerCategory('Bakery');
                  setModalVisible(false);
                }}
                style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Bakery</Text>
                {/* <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                /> */}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* ======= Business Category Selection Modal End ======= */}
    </>
  );
};

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
    width: '100%',
    paddingHorizontal: 20,
  },
  screenDescription: {
    fontFamily: 'OpenSans-SemiBold',
    marginTop: 30,
    marginBottom: 10,
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  imgBox: {
    width: 70,
    height: 70,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  imgLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#5E3360',
    marginLeft: 10,
    flex: 1,
  },
  formGroup: {
    marginTop: 10,
    width: '100%',
    marginBottom: 30,
  },
  formLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#C6B5C7',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#5E3360',
  },
  txtInput: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  btn: {
    backgroundColor: '#5E3360',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 40,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  modalCard: {
    backgroundColor: '#FEF9E5',
    width: '100%',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingHorizontal: 15,
  },
  modalHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  modalHeadingTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    flex: 1,
    color: '#5E3360',
  },
  modalCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    flex: 1,
  },
});
