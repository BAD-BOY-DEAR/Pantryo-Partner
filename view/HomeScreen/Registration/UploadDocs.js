import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';

const UploadDocs = ({navigation}) => {
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
              console.log('User cancelled image picker');
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
            <View style={styles.uploadBox}>
              <Icons name="cloud-upload" size={25} color="#c7c7c7c7" />
              <Text styles={styles.uploadBoxTxtInner}>Front Image</Text>
            </View>

            <View style={styles.uploadBox}>
              <Icons name="cloud-upload" size={25} color="#c7c7c7c7" />
              <Text styles={styles.uploadBoxTxtInner}>Back Image</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionTwo}>
          <View style={styles.uploadBox}>
            <Icons name="cloud-upload" size={25} color="#c7c7c7c7" />
          </View>
          <View style={styles.div}>
            <Text style={styles.divTop}>Upload GST Certificate</Text>
            <Text style={styles.divBottom}>(.PNG, .JPG or PDF)</Text>
          </View>
        </View>

        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate('PostUploadStatus')}>
          <Text style={styles.btnTxt}>SUBMIT</Text>
        </Pressable>
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
