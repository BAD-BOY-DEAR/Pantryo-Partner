import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from 'react-native';

// ===== Library ===== //
import CheckBox from '@react-native-community/checkbox';

// ===== Images ===== //
import deliveryBoy from '../../../assets/icons/delivery.gif';

const OrderDetails = () => {
  const [statusOne, setStatusOne] = useState(false);
  const [statusTwo, setStatusTwo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.div}>
            <Text style={styles.heading}>Order Details</Text>

            <View style={styles.tabRow}>
              <Text style={styles.label}>OrderID: </Text>
              <Text style={styles.response}>123456789</Text>
            </View>

            <View style={styles.tabRow}>
              <Text style={styles.label}>Customer: </Text>
              <Text style={styles.response}>Syed John Goswami</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.div}>
            <Text style={styles.heading}>Products to be packed</Text>
            <View style={styles.tabRow}>
              <View style={styles.section}>
                <Text style={styles.brandName}>Amul</Text>
                <Text style={styles.product}>Butter</Text>
              </View>
              <Text style={styles.weight}>500gm</Text>
              <Text style={styles.qty}>X 2</Text>
              <Text style={styles.cost}>₹100</Text>
            </View>

            <View style={styles.tabRow}>
              <View style={styles.section}>
                <Text style={styles.brandName}>Amul</Text>
                <Text style={styles.product}>Spice Garlic Cheese Spread</Text>
              </View>
              <Text style={styles.weight}>500gm</Text>
              <Text style={styles.qty}>X 1</Text>
              <Text style={styles.cost}>₹300</Text>
            </View>

            <View style={styles.tabRow}>
              <View style={styles.section}>
                <Text style={styles.brandName}>MDH</Text>
                <Text style={styles.product}>Chunky Chat Masala</Text>
              </View>
              <Text style={styles.weight}>40gm</Text>
              <Text style={styles.qty}>X 1</Text>
              <Text style={styles.cost}>₹60</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={[styles.div]}>
            <Text style={styles.heading}>Action</Text>

            <View style={styles.tabRow}>
              <Text style={styles.statusName}>Confirm Order</Text>
              <CheckBox
                disabled={false}
                value={statusOne}
                onValueChange={newValue => setStatusOne(newValue)}
                style={styles.statusOne}
              />
            </View>

            <View style={styles.tabRow}>
              <Text style={styles.statusName}>Order Ready</Text>
              {modalVisible ? (
                <CheckBox
                  disabled={true}
                  value={statusTwo}
                  onValueChange={newValue => setStatusTwo(newValue)}
                  style={styles.statusOne}
                />
              ) : (
                <CheckBox
                  disabled={false}
                  value={statusTwo}
                  onValueChange={newValue => setStatusTwo(newValue)}
                  style={styles.statusOne}
                  onChange={() => setModalVisible(true)}
                />
              )}
            </View>
          </View>
        </View>

        {/* ======= Modal ======= */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalCard}>
              <Text style={styles.modalText}>
                Enter Confirmation Code provided by Delivery Partner to confirm
                order handover
              </Text>
              <TextInput
                placeholder="Enter 6 Digit Code"
                style={styles.modalInput}
                keyboardType="number-pad"
              />
              <View style={styles.modalBtn}>
                <Text style={styles.modalBtnTxt}>SUBMIT</Text>
              </View>
            </View>
          </View>
        </Modal>
        {/* ======= Modal ======= */}
      </ScrollView>
    </>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 10,
    backgroundColor: '#5E3360',
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  div: {
    width: '100%',
  },
  heading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
  },
  tabRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  response: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#5E3360',
  },
  section: {
    flex: 1,
    marginLeft: 10,
  },
  brandName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  product: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  weight: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    marginRight: 20,
  },
  qty: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#000',
    marginRight: 20,
  },
  cost: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    marginRight: 10,
    color: 'green',
  },
  statusName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    flex: 1,
  },
  statusOne: {
    marginRight: 15,
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
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
  },
  modalInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
  },
  modalBtn: {
    marginTop: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#5E3360',
    marginBottom: 30,
  },
  modalBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#ffff',
  },
});
