import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';

const UploadDocs = ({navigation}) => {
  const [isLoading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([
    {label: 'Aadhar card', value: 'Aadhar card'},
    {label: 'Driving License', value: 'Driving License'},
    {label: 'Ration Card', value: 'Ration Card'},
    {label: 'Voter ID', value: 'Voter ID'},
  ]);
  const [docFrontImage, SetDocFrontImage] = React.useState('');
  const [docFrontImagePath, SetDocFrontImagePath] = React.useState('');
  const [docBackImage, SetDocBackImage] = React.useState('');
  const [docBackImagePath, SetDocBackImagePath] = React.useState('');
  const [gstCertificate, setGstCertificate] = React.useState('');
  const [gstCertificatePath, setGstCertificatePath] = React.useState('');

  ///Take Image
  const requestGalleryPermission = async selectForImage => {
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
        let SelectFor = selectForImage;
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
              // console.log('User cancelled image picker');
            } else {
              let temp = {name: res.fileName, uri: res.uri, type: res.type};
              if (SelectFor == 'Front') {
                SetDocFrontImagePath(res.uri);
                SetDocFrontImage(temp);
              }
              if (SelectFor == 'Back') {
                SetDocBackImagePath(res.uri);
                SetDocBackImage(temp);
              }
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

  /////Doc
  const uploadDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        // type: [DocumentPicker.types.images],
      });
      let temp = {name: res.name, uri: res.uri, type: res.type};
      // console.log(temp);
      setGstCertificatePath(res.uri);
      setGstCertificate(temp);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const requestDocument = async () => {
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
        uploadDocument();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  /////////Upload KYC Documents
  const kycDocumentUpdate = async () => {
    if (!value) {
      Alert.alert('Select Id Type');
      return;
    } else if (!docFrontImage) {
      Alert.alert('Please Upload your Id front side Image');
      return;
    } else if (!docBackImage) {
      Alert.alert('Please Upload your Id Back side Image');
      return;
    } else if (!gstCertificate) {
      Alert.alert('Please Upload your gst Document in  Image or Pdf');
      return;
    } else {
      let partner_id = await AsyncStorage.getItem('partner_id');
      const data = new FormData();
      data.append('partner_id', partner_id);
      data.append('partner_idFrontImage', docFrontImage);
      data.append('partner_idBackImage', docBackImage);
      data.append('partner_gstCertificate', gstCertificate);
      data.append('partner_idType', value);

      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartnerUploadDocs.php',
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
            AsyncStorage.setItem(
              'partner_kycStatus',
              JSON.stringify(result.partner_kycStatus),
            );
            RazorpayFunction();
          }
          Alert.alert(result.msg);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  // RazorpayFunction Payment APi
  const RazorpayFunction = async () => {
    let partner_contactNumber = await AsyncStorage.getItem(
      'partner_contactNumber',
    );
    let partner_shopName = await AsyncStorage.getItem('partner_shopName');

    var options = {
      description: '',
      image: 'https://gizmmoalchemy.com/api/pantryo/Logo/PantryoLogo.png',
      currency: 'INR',
      key: 'rzp_test_Q7747Ni4ezPrgO',
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
  };

  // Check Payment Status
  const getPaymentStatus = async payment_id => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    setLoading(true);
    fetch(
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
        }),
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.payment_status === 'authorized') {
          navigation.navigate('HomeScreen');
        } else {
          showToast('Status of Payment' + ' ' + JSON.stringify(result));
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.separator}>
          <Text style={styles.heading}>Upload Documents</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Select ID Proof</Text>
          <View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropDown}
            />
          </View>
          <View style={styles.uploadRow}>
            <Pressable
              onPress={() => requestGalleryPermission('Front')}
              style={styles.uploadBox}>
              {docFrontImage == '' ? (
                <Icons name="cloud-upload" size={25} color="#c7c7c7c7" />
              ) : (
                <Icons name="checkmark-circle" size={25} color="green" />
              )}
              <Text styles={styles.uploadBoxTxtInner}>Front Image</Text>
            </Pressable>

            <Pressable
              onPress={() => requestGalleryPermission('Back')}
              style={styles.uploadBox}>
              {docBackImage == '' ? (
                <Icons name="cloud-upload" size={25} color="#c7c7c7c7" />
              ) : (
                <Icons name="checkmark-circle" size={25} color="green" />
              )}
              <Text styles={styles.uploadBoxTxtInner}>Back Image</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => requestDocument()} style={styles.sectionTwo}>
          <View style={styles.uploadBox}>
            {gstCertificate == '' ? (
              <Icons name="cloud-upload" size={25} color="#c7c7c7c7" />
            ) : (
              <Icons name="checkmark-circle" size={25} color="green" />
            )}
          </View>
          <View style={styles.div}>
            <Text style={styles.divTop}>Upload GST Certificate</Text>
            <Text style={styles.divBottom}>(.PNG, .JPG or PDF)</Text>
          </View>
        </Pressable>
        {isLoading == false ? (
          <Pressable
            style={styles.btn}
            onPress={() => {
              kycDocumentUpdate();
            }}>
            <Text style={styles.btnTxt}>SUBMIT</Text>
          </Pressable>
        ) : (
          <View style={styles.btn}>
            <ActivityIndicator
              animating={true}
              color="#fff"
              size="small"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default UploadDocs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    marginTop: 20,
    marginBottom: 20,
  },
  heading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#5E3360',
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  formLabel: {
    fontFamily: 'OpenSans-Regular',
  },
  dropDown: {
    marginTop: 10,
  },
  sectionTwo: {
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  uploadBox: {
    borderWidth: 0.5,
    borderColor: '#c7c7c7c7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 100,
    height: 100,
    marginRight: 10,
  },
  div: {
    flex: 1,
    marginLeft: 10,
  },
  divTop: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#5E3360',
  },
  divBottom: {
    fontFamily: 'OpenSans-Regular',
  },
  uploadRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadBoxTxtInner: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  btn: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#5E3360',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-Bold',
    color: '#FFFFFF',
  },
});
