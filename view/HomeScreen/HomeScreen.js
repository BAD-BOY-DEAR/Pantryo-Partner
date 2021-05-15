import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';

// ===== Images ===== //
import productIcon from '../../assets/icons/productIcon.png';

// ===== Screens ===== //
import RegistrationForm from './Registration/RegistrationForm';
import UploadDocs from './Registration/UploadDocs';
import PostUploadStatus from './Registration/PostUploadStatus';
import OrderDetails from './Orders/OrderDetails';
import OrdersList from './Orders/OrdersList';
import PaymentScreen from './Payments/PaymentScreen';

const HomeScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* ========== Header Section ========== */}
          <View style={styles.header}>
            <Text style={styles.screenName}>Dashboard</Text>
            <Pressable onPress={() => navigation.navigate('RegistrationForm')}>
              <Icons name="document-text-outline" size={28} color="#5E3360" />
            </Pressable>
            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
              }}>
              <Text>Go Live</Text>
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

          {/* ========== Activity Section ========== */}
          <View style={styles.tabContainer}>
            <Text style={styles.tabHeading}>Activity</Text>
            <View style={styles.div}>
              <ScrollView style={{paddingBottom: 20}} horizontal={true}>
                <Pressable
                  onPress={() => navigation.navigate('OrdersList')}
                  style={styles.activityBtn}>
                  <Icons name="bookmark-outline" size={30} color="#5E3360" />
                  <Text style={styles.activityBtnTxt}>Orders</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('PaymentScreen')}
                  style={styles.activityBtn}>
                  <Icons name="cash-outline" size={30} color="#5E3360" />
                  <Text style={styles.activityBtnTxt}>Payments</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
          {/* ========== Activity Section ========== */}

          {/* ========== Middle Section ========== */}
          <View style={styles.middleSection}>
            <Text style={styles.tabHeading}>Overview</Text>
            <View style={styles.row}>
              <View style={styles.tab}>
                <Text styles={styles.midTabLabel}>ORDERS</Text>
                <Text style={styles.midTabText}>50</Text>
              </View>

              <View style={styles.tab}>
                <Text styles={styles.midTabLabel}>TOTAL SALES</Text>
                <Text style={styles.midTabText}>₹651.8</Text>
              </View>
            </View>
          </View>
          {/* ========== Middle Section ========== */}

          {/* ========== Ongoing Orders Section ========== */}
          <View style={styles.section}>
            <Text style={styles.tabHeading}>Ongoing Today</Text>
            <Pressable
              onPress={() => navigation.navigate('OrderDetails')}
              style={styles.details}>
              <View style={styles.divOne}>
                <Text style={styles.detailsTxt}>Syed John Goswami</Text>
                <Text style={styles.detailsDate}>15 May 2021 12:15 PM</Text>
              </View>
              <View style={styles.divTwo}>
                <Text style={styles.detailsPrice}>₹651.8</Text>
                <Text style={styles.detailsStatus}>Received (Online)</Text>
              </View>
            </Pressable>
          </View>
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
  },
  screenName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    flex: 1,
    color: '#000000',
  },
  tabContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 20,
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
    flex: 1,
  },
  activityBtnTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  tabHeading: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#5E3360',
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
    borderRadius: 10,
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
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    flex: 1,
  },
  detailsDate: {
    fontFamily: 'OpenSans-Regular',
    marginTop: 5,
    fontSize: 12,
  },
  divOne: {
    flex: 1,
  },
  divTwo: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  detailsPrice: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: 'green',
  },
  detailsStatus: {
    fontFamily: 'OpenSans-Regular',
  },
  middleSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 150,
    height: 100,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  midTabLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  midTabText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 24,
  },
});
