import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';

const OrdersList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <View style={styles.container}>
        {/* =========== Header =========== */}
        <View style={styles.header}>
          <ScrollView horizontal={true}>
            <View style={styles.datePill}>
              <Text style={styles.datePillTxt}>All Orders</Text>
            </View>

            <View style={styles.datePill}>
              <Text style={styles.datePillTxt}>Today</Text>
            </View>

            <View style={styles.datePill}>
              <Text style={styles.datePillTxt}>Last Week</Text>
            </View>

            <View style={styles.datePill}>
              <Text style={styles.datePillTxt}>This Week</Text>
            </View>

            <View style={styles.datePill}>
              <Text style={styles.datePillTxt}>This Month</Text>
            </View>

            <View style={styles.datePill}>
              <Text style={styles.datePillTxt}>Last 3 Months</Text>
            </View>
          </ScrollView>
        </View>
        {/* =========== Header =========== */}

        {/* =========== Orders List =========== */}
        <View style={styles.orderView}>
          {/* =========== Overview =========== */}
          <View style={styles.midRow}>
            <Text style={styles.midRowTxt}>Showing orders for: Today</Text>
          </View>
          {/* =========== Overview =========== */}

          {/* =========== Order Details =========== */}
          <View style={styles.orderViewTab}>
            <View style={styles.iconContainer}>
              <Icons name="person-outline" size={25} />
            </View>
            <View style={styles.div}>
              <Text style={styles.userName}>Syed John Goswami</Text>
              <Text style={styles.orderDate}>15 May 2021 02:50PM</Text>
            </View>
            <View style={styles.divTwo}>
              <Text style={styles.payment}>₹651.8</Text>
            </View>
          </View>
          {/* =========== Order Details =========== */}
        </View>
        {/* =========== Orders List =========== */}
      </View>

      {/* =========== Orders List Modal =========== */}
      {/* =========== Orders List Modal =========== */}
    </>
  );
};

export default OrdersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 80,
    backgroundColor: '#5E3360',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  datePill: {
    backgroundColor: '#C6B5C7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  datePillTxt: {
    fontFamily: 'OpenSans-SemiBold',
  },
  orderView: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 5,
  },
  midRow: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  midRowTxt: {
    fontFamily: 'OpenSans-Regular',
    color: '#444444',
  },
  orderViewTab: {
    justifyContent: 'flex-start',
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
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  div: {
    flex: 1,
    marginLeft: 10,
  },
  divTwo: {
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  userName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#000000',
  },
  orderDate: {
    fontFamily: 'OpenSans-Regular',
    color: '#777777',
  },
  payment: {
    fontFamily: 'OpenSans-SemiBold',
    color: 'green',
    fontSize: 16,
  },
});
