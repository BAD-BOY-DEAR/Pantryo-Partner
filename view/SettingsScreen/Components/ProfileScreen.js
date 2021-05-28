import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

// ========= Library ========= //
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userShopName, setUserShopName] = React.useState('');
  const [userCategoryName, setUserCategoryName] = React.useState('');
  const [userMobile, setUserMobile] = React.useState('');

  const getUserProfile = async () => {
    setUserShopName(await AsyncStorage.getItem('partner_shopName'));
    setUserCategoryName(await AsyncStorage.getItem('partner_category_name'));
    setUserMobile(await AsyncStorage.getItem('partner_contactNumber'));
  };

  React.useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profileImgContainer}>
          <View style={styles.imgBox}>
            <Icons name="image" size={20} color="#777" />
          </View>
          <Pressable style={styles.editBtnRow}>
            <Icons name="create-outline" size={20} />
            <Text style={styles.editBtn}>Click here to Change Image</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Icons name="business-outline" size={20} color="#5E3360" />
          <View style={styles.rowDiv}>
            <Text style={styles.label}>Shop Name</Text>
            <Text style={[styles.response, {color: '#777'}]}>
              {userShopName}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Icons name="list-outline" size={20} color="#5E3360" />
          <View style={styles.rowDiv}>
            <Text style={styles.label}>Category</Text>
            <Text style={[styles.response, {color: '#777'}]}>
              {userCategoryName}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Icons name="call-outline" size={20} color="#5E3360" />
          <View style={styles.rowDiv}>
            <Text style={styles.label}>Registered Mobile Number</Text>
            <Text style={styles.response}>{userMobile}</Text>
          </View>
        </View>

        <Pressable style={styles.btn}>
          <Text style={styles.btnTxt}>UPDATE</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  profileImgContainer: {
    width: '100%',
  },
  imgBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#c7c7c7',
  },
  editBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  editBtn: {
    fontFamily: 'OpenSans-Regular',
    marginLeft: 10,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingBottom: 15,
    marginTop: 20,
    borderBottomColor: '#c7c7c7c7',
  },
  rowDiv: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontFamily: 'OpenSans-Regular',
  },
  response: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#5E3360',
  },
  btn: {
    marginTop: 25,
    width: '100%',
    backgroundColor: '#5E3360',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 5,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
