import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';

// ===== Image ===== //
import storeImg from '../../assets/productImages/storeImgThree.jpg';

const TransactionDetails = () => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.userDetailsTop}>
          <Image source={storeImg} style={styles.userStoreImg} />
          <Text style={styles.topLabel}>Bhains Ki Aankh Store</Text>
          <Text style={styles.topAmount}>₹ 5,000</Text>

          <View style={styles.topRow}>
            <Icons name="checkmark-circle" size={15} color="green" />
            <Text> Completed </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.bankName}>ICICI Bank XXXXXXXXX123</Text>

          <Text style={styles.transactionLabel}>Transaction ID</Text>
          <Text style={styles.transactionResponse}>IUjkll568__123</Text>

          <Text style={styles.transactionLabel}>To:</Text>
          <Text style={styles.transactionResponse}>Bhains Ki Aankh Store</Text>

          <Text style={styles.transactionLabel}>From:</Text>
          <Text style={styles.transactionResponse}>Pantryo LLP</Text>

          <Text style={styles.transactionLabel}>Date & Time</Text>
          <Text style={styles.transactionResponse}>22 May 2021 12:27 PM</Text>
        </View>
      </View>
    </>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  userDetailsTop: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  userStoreImg: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginBottom: 15,
  },
  topLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  topAmount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 36,
    marginTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,
    borderColor: '#c7c7c7c7',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  bankName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderBottomColor: '#c7c7c7',
  },
  transactionLabel: {
    fontFamily: 'OpenSans-Regular',
  },
  transactionResponse: {
    fontFamily: 'OpenSans-Medium',
    fontSize: 16,
    marginBottom: 10,
  },
});
