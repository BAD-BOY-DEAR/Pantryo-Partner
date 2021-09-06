import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  LogBox,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersList = () => {
  const [isLoading, setLoading] = React.useState(true);

  // Order Details
  const [allDetails, setAllDetails] = React.useState('');
  const [details, setDetails] = React.useState('');

  // Modal
  const [orderDetails, setOrderDetails] = useState(false);

  // Order ID
  const [orderId, setOrderId] = React.useState('');
  const [innerOrderId, setInnerOrderId] = React.useState('');

  // ProductDetails
  const [brandName, setBrandName] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');
  const [qty, setQty] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [noOfProducts, setNoOfProducts] = React.useState('');

  // Get Order List
  async function getOrderList() {
    setLoading(true);
    let partner_id = await AsyncStorage.getItem('partner_id');
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartnerCountHistroy.php?flag=getAllPartnerOrderDetails',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: partner_id,
        }),
      },
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
<<<<<<< HEAD
        // console.log(result);
=======
        console.log(result.alldetails[0].productdetails);
>>>>>>> 3e9673e325c2c98b8a6215a63f736cababf3c93c
        setAllDetails(result.alldetails);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  React.useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested...']);
    getOrderList();
  }, []);

  return (
    <>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#5E3360" />
        </View>
      ) : allDetails !== '' ? (
        <View style={styles.container}>
          {/* =========== Header Buttons =========== */}
          {/* <View style={styles.header}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.datePill}>
                <Text style={styles.datePillTxt}>All Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.datePill}>
                <Text style={styles.datePillTxt}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.datePill}>
                <Text style={styles.datePillTxt}>Last Week</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.datePill}>
                <Text style={styles.datePillTxt}>This Week</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.datePill}>
                <Text style={styles.datePillTxt}>This Month</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.datePill}>
                <Text style={styles.datePillTxt}>Last 3 Months</Text>
              </TouchableOpacity>
            </ScrollView>
          </View> */}
          {/* =========== Header Buttons =========== */}

          {/* =========== Orders List =========== */}
          <View style={styles.orderView}>
            {/* =========== Overview =========== */}
            {/* <View style={styles.midRow}>
              <Text style={styles.midRowTxt}>Showing orders for: Today</Text>
            </View> */}
            {/* =========== Overview =========== */}

            {/* =========== Order Details =========== */}
            {allDetails !== '' ? (
              <FlatList
                data={allDetails}
                keyExtractor={({order_id}, index) => order_id}
                renderItem={({item}) => (
                  <>
                    <Pressable
                      // onPress={() => getOrderDetails({order_id: item.order_id})}
                      onPress={() => {
                        setDetails(item.productdetails);
                        setOrderDetails(true);
                      }}
                      style={styles.orderViewTab}>
                      <View style={styles.div}>
                        <Text style={styles.label}>Customer Name</Text>
                        <Text style={styles.userName}>
                          {item.customer_name}
                        </Text>
                        <Text style={styles.orderDate}>{item.create_date}</Text>
                      </View>
                      <View style={styles.divTwo}>
                        <Text style={styles.payment}>
                          ₹{item.payment_amount}
                        </Text>
                      </View>
                    </Pressable>
                  </>
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}>
                <Text>You have not received any customer orders</Text>
              </View>
            )}

            {/* =========== Order Details =========== */}
          </View>
          {/* =========== Orders List =========== */}
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <Text>No Past Orders Found</Text>
          </View>
        </>
      )}

      {/* ======== Order Details Modal ========  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={orderDetails}
        onRequestClose={() => {
          setOrderDetails(!orderDetails);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            {details !== '' ? (
              <FlatList
                style={{width: '100%'}}
                data={details}
                keyExtractor={({cart_id}, index) => cart_id}
                renderItem={({item}) => (
                  <View>
                    <Text style={styles.brand}>{item.brandName}</Text>
                    <Text style={styles.product}>{item.productName}</Text>
                    <Text style={styles.price}>₹{item.productPrice}</Text>
                    <Text style={styles.qty}>
                      {item.productQty}
                      {item.productUnit}
                    </Text>
                    <Text style={styles.total}>{item.numberOfProduct}</Text>
                  </View>
                )}
              />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 40,
                }}>
                <Text>No Details</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      {/* ======== Order Details Modal ========  */}
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
    backgroundColor: '#fff',
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
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  label: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
  },
  userName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#000000',
  },
  orderDate: {
    fontFamily: 'OpenSans-Regular',
    color: '#777777',
    marginTop: 5,
  },
  payment: {
    fontFamily: 'OpenSans-Bold',
    color: 'green',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
  },
  brand: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    fontSize: 16,
  },
  product: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    fontSize: 20,
  },
  price: {
    fontFamily: 'OpenSans-Bold',
    color: 'green',
    fontSize: 18,
  },
  qty: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    fontSize: 18,
  },
  total: {
    fontFamily: 'OpenSans-Bold',
    color: '#000',
    fontSize: 18,
  },
});
