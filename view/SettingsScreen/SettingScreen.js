import React from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../controller/Utils';
import {createStackNavigator} from '@react-navigation/stack';
import VersionInfo from 'react-native-version-info';

// ===== Components ===== //
import ProfileScreen from './Components/ProfileScreen';
import TermsConditions from './Components/TermsConditions';

const SettingsScreen = ({navigation}) => {
  const [userShopName, getUserShopName] = React.useState('');
  const [userCategoryName, setUserCategoryName] = React.useState('');
  const [userMobile, setUserMobile] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [shopAddress, setShopAddress] = React.useState('');
  const [appVersion, setAppVersion] = React.useState('');
  const {signOut} = React.useContext(AuthContext);

  // Function to get Partner's Profile
  const getUserProfile = async () => {
    getUserShopName(await AsyncStorage.getItem('partner_shopName'));
    setUserCategoryName(await AsyncStorage.getItem('partner_category_name'));
    setUserMobile(await AsyncStorage.getItem('partner_contactNumber'));
    setPincode(await AsyncStorage.getItem('partner_pincode'));
    setShopAddress(await AsyncStorage.getItem('partner_shopaddress'));
  };

  React.useEffect(() => {
    getUserProfile();
    console.log(VersionInfo.appVersion);
    setAppVersion(VersionInfo.appVersion);
  }, []);

  return (
    <>
      <ScrollView
        style={{
          paddingBottom: 50,
          backgroundColor: '#fff',
        }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable style={styles.iconBox}>
              <Icons name="business-outline" size={30} color="#777" />
            </Pressable>

            <View style={styles.headerTxtContainer}>
              <Text style={styles.headerTopText}>{userShopName}</Text>
              <Text style={styles.partnerCat}>{userCategoryName}</Text>
              <Text style={styles.pinCode}>{pincode}</Text>
              <Text style={styles.partnerNo}>{userMobile}</Text>

              <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
                <Text style={styles.headerBottom}>Edit Profile</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <View style={styles.tab}>
              <Icons name="help-circle-outline" size={30} color="#5E3360" />
              <Text style={styles.tabTxt}>How It Works</Text>
            </View>
            <View style={styles.tab}>
              <Icons name="alert-circle-outline" size={30} color="#5E3360" />
              <Text style={styles.tabTxt}>Support</Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('TermsConditions')}
              style={styles.tab}>
              <Icons name="document-attach-outline" size={30} color="#5E3360" />
              <Text style={styles.tabTxt}>Terms & Conditions</Text>
            </Pressable>
            <View style={styles.tab}>
              <Icons name="finger-print-outline" size={30} color="#5E3360" />
              <Text style={styles.tabTxt}>Privacy Policy</Text>
            </View>
            <Pressable onPress={() => signOut()} style={styles.tab}>
              <Icons name="log-out-outline" size={30} color="#5E3360" />
              <Text style={styles.tabTxt}>Sign Out</Text>
            </Pressable>
          </View>

          <View style={styles.developer}>
            <Text style={styles.developerDetails}>
              Designed & Developed by Gizmmo Alchemy
            </Text>
            <Text style={styles.developerDetails}>App V{appVersion}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const Stack = createStackNavigator();

const SettingScreenHolder = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
    </Stack.Navigator>
  );
};

export default SettingScreenHolder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  iconBox: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0e0',
    borderRadius: 5,
  },
  headerTxtContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTopText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    textTransform: 'uppercase',
    color: '#5E3360',
  },
  headerBottom: {
    fontFamily: 'OpenSans-Regular',
    color: '#5E3360',
    marginTop: 5,
  },
  tabContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    marginTop: 30,
    paddingBottom: 30,
    borderBottomColor: '#c7c7c7c7',
  },
  tabTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginLeft: 15,
  },
  partnerCat: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
  pinCode: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  partnerNo: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginTop: 15,
    color: '#777',
  },
  developer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
    marginTop: 30,
  },
  developerDetails: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#777',
  },
});
