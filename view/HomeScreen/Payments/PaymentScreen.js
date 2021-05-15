import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const PaymentScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <ScrollView horizontal={true} style={{paddingBottom: 30}}>
            <View style={styles.btnPill}>
              <Text style={styles.pillTxt}>This Week</Text>
            </View>
            <View style={styles.btnPill}>
              <Text style={styles.pillTxt}>Last Week</Text>
            </View>
            <View style={styles.btnPill}>
              <Text style={styles.pillTxt}>This Month</Text>
            </View>
            <View style={styles.btnPill}>
              <Text style={styles.pillTxt}>Last 3 Months</Text>
            </View>
            <View style={styles.btnPill}>
              <Text style={styles.pillTxt}>All Payments</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.tab}>
          <Text style={styles.tabLabel}>Received</Text>
          <View style={styles.tabInnerRow}>
            <Text style={styles.amount}>₹651.8</Text>
            <Text style={styles.date}>15 May 2021 04:30 PM</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    marginTop: 20,
  },
  btnPill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#acacacac',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pillTxt: {
    fontFamily: 'OpenSans-SemiBold',
  },
  tab: {
    marginTop: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabLabel: {
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
  },
  tabInnerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: 'green',
    flex: 1,
  },
  date: {
    fontFamily: 'OpenSans-Regular',
    color: '#777777',
  },
});
