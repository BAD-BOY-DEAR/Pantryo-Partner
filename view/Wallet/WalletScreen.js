import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';

// ===== Components ===== //
import WalletActionScreen from './WalletActionScreen';
import TransactionDetails from './TransactionDetails';

const WalletScreen = ({navigation}) => {
  return (
    <>
      <View style={styles.topContainer}>
        <View style={styles.section}>
          <Text style={styles.screenName}>Your Account</Text>
          <Pressable
            onPress={() => navigation.navigate('WalletActionScreen')}
            style={styles.salesCard}>
            <View style={{flex: 1}}>
              <Text style={styles.salesCardHeading}>Total Sales</Text>
              <Text style={styles.totalSales}>₹ 5,000</Text>
            </View>
            <Icons name="add-circle" size={30} color="#5E3360" />
          </Pressable>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <ScrollView style={styles.btmScroll}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Transaction History</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('TransactionDetails')}
            style={styles.transaction}>
            <View style={styles.div}>
              <Text style={styles.transactionLabel}>Credited</Text>
              <Text style={styles.date}>22 May 2021 11:00 AM</Text>
            </View>
            <Text style={styles.amount}>₹ 5,000</Text>
            <Icons name="chevron-forward-outline" size={20} color="#5E3360" />
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

const Stack = createStackNavigator();

function WalletScreenHolder() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="WalletActionScreen" component={WalletActionScreen} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
    </Stack.Navigator>
  );
}

export default WalletScreenHolder;

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: '#5E3360',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  section: {
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 150,
  },
  screenName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 24,
    color: '#C6B5C7',
  },
  salesCard: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  salesCardHeading: {
    fontFamily: 'OpenSans-Regular',
  },
  totalSales: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 36,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btmScroll: {
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
  },
  header: {
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: 'OpenSans-Regular',
  },
  transaction: {
    borderBottomWidth: 0.5,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  div: {
    flex: 1,
  },
  transactionLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
  },
  date: {
    fontFamily: 'OpenSans-Regular',
    color: '#777777',
  },
  amount: {
    fontFamily: 'OpenSans-Bold',
    color: 'green',
    fontSize: 24,
    marginRight: 10,
  },
});
