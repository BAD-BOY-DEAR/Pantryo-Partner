import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== Images ===== //
import mascot from '../../assets/logo/mascot.png';

// ===== Screens ===== //
import RegistrationForm from './Registration/RegistrationForm';
import UploadDocs from './Registration/UploadDocs';
import PostUploadStatus from './Registration/PostUploadStatus';
import OrderDetails from './Orders/OrderDetails';
import OrdersList from './Orders/OrdersList';
import PaymentScreen from './Payments/PaymentScreen';

const HomeScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [kycStatus, setKycStatus] = React.useState('1');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  ///set Partner Details
  const getPartnerDetails = async () => {
    let partner_kycStatus = await AsyncStorage.getItem('partner_kycStatus');
    setKycStatus(partner_kycStatus);
    getPartnerDetails();
  };

  React.useEffect(() => {
    getPartnerDetails();
  }, []);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {kycStatus == '1' ? (
            <View style={styles.kycContainer}>
              <Pressable
                onPress={() => navigation.navigate('UploadDocs')}
                style={styles.kycSeaction}>
                <Text style={styles.cardOneLabel}>Complete Your KYC</Text>
                <Text style={styles.cardOneResponse}>Click Here</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* ========== Header Section ========== */}
              <View style={styles.header}>
                <Text style={styles.screenName}>Dashboard</Text>
                <Pressable
                  onPress={() => navigation.navigate('RegistrationForm')}>
                  <Icons
                    name="document-text-outline"
                    size={28}
                    color="#5E3360"
                  />
                </Pressable>
                <View
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-SemiBold',
                      fontSize: 18,
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
              <View style={styles.middleSection}>
                <View style={styles.row}>
                  <View
                    // colors={['#e4c4f2', '#c79adb']}
                    style={styles.cardOne}>
                    <Text style={styles.cardOneLabel}>Orders Today</Text>
                    <Text style={styles.cardOneResponse}>10</Text>
                  </View>
                  <View
                    // colors={['#e4c4f2', '#c79adb']}
                    style={styles.cardOne}>
                    <Text style={styles.cardOneLabel}>
                      Total Orders Received
                    </Text>
                    <Text style={styles.cardOneResponse}>100</Text>
                  </View>
                </View>
              </View>
              {/* ========== Overview Section ========== */}

              {/* ========== Ongoing Orders Section ========== */}
              <View style={styles.section}>
                <Text style={styles.tabHeading}>Ongoing Today</Text>
                <Pressable
                  onPress={() => navigation.navigate('OrderDetails')}
                  style={styles.details}>
                  <View style={styles.divOne}>
                    <Text style={styles.detailsTxt}>Syed John Goswami</Text>
                    <Text style={styles.detailsAddressLabel}>Address:</Text>
                    <Text style={styles.detailsAddress}>
                      A-23, Sector J, Aliganj Lucknow
                    </Text>
                    <View style={styles.detailsInnerRow}>
                      <Text style={styles.detailsDate}>
                        15 May 2021 12:15 PM
                      </Text>
                      <Text style={styles.btnDetails}>View Order Details</Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </>
          )}
          {/* ========== Ongoing Orders Section ========== */}
        </View>
      </ScrollView>
    </>
  );
};

const Stack = createStackNavigator();

function Home() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="UploadDocs" component={UploadDocs} />
      <Stack.Screen name="PostUploadStatus" component={PostUploadStatus} />
      <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="OrdersList" component={OrdersList} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

export default Home;

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  screenName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    flex: 1,
    color: '#000000',
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
    marginTop: 10,
  },
  btnDetails: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 5,
    color: 'blue',
  },
  kycContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    flex: 1,
    borderWidth: 0.4,
    borderRadius: 10,
    width: '90%',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  kycSeaction: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
