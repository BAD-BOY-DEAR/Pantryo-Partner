import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
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
                <Text style={styles.kycBottomHeading}>Upload Documents</Text>
                <Text style={styles.explanation}>
                  Please complete your E-KYC to start your journey with Pantryo
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
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
              {/* ========== Header Section ========== */}
              <View style={styles.header}>
                <Text style={styles.screenName}>Dashboard</Text>
                <Pressable
                  onPress={() => navigation.navigate('RegistrationForm')}>
                  <Icons name="document-text-outline" size={28} color="#fff" />
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
                      color: '#fff',
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
              <LinearGradient
                colors={['#b586b8', '#87548a']}
                style={styles.middleSection}>
                <View style={styles.row}>
                  <View style={styles.cardOne}>
                    <Text style={styles.cardOneLabel}>Orders Today</Text>
                    <Text style={styles.cardOneResponse}>10</Text>
                  </View>
                  <View style={styles.cardOne}>
                    <Text style={styles.cardOneLabel}>
                      Total Orders Received
                    </Text>
                    <Text style={styles.cardOneResponse}>100</Text>
                  </View>
                </View>
              </LinearGradient>
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
            </View>
          </ScrollView>
        </>
      )}
      {/* ========== Ongoing Orders Section ========== */}
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
    backgroundColor: '#b586b8',
  },
  screenName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    flex: 1,
    color: '#fff',
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
    backgroundColor: '#5E3360',
    paddingVertical: 30,
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
    shadowColor: '#fff',
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
    height: '70%',
    marginRight: 30,
    marginBottom: 30,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
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
});
