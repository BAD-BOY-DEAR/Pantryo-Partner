import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';

const InventoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Select Category', value: ''},
    {label: 'Category 1', value: 'category 1'},
    {label: 'Category 2', value: 'Category 2'},
  ]);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* --------- Product Image Upload --------- */}
          <View style={styles.imgDiv}>
            <Text style={styles.imgTxt}>Add Product Images</Text>
            <Text style={styles.imgBottomTxt}>(only 4 images allowed)</Text>
          </View>
          <View style={styles.imgRow}>
            <View style={styles.imgContainer}>
              <Icons name="camera-outline" size={30} color="#5E3360" />
            </View>

            <View style={styles.imgContainer}>
              <Icons name="camera-outline" size={30} color="#5E3360" />
            </View>

            <View style={styles.imgContainer}>
              <Icons name="camera-outline" size={30} color="#5E3360" />
            </View>

            <View style={styles.imgContainer}>
              <Icons name="camera-outline" size={30} color="#5E3360" />
            </View>
          </View>
          {/* --------- Product Image Upload --------- */}

          {/* --------- Product Name --------- */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Product Name *</Text>
            <TextInput
              placeholder="Type here"
              style={styles.txtInput}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>
          {/* --------- Product Name --------- */}

          {/* --------- Product Category --------- */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Product Category *</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={{
                marginTop: 10,
                borderWidth: 0.5,
              }}
            />
          </View>
          {/* --------- Product Category --------- */}

          {/* --------- MRP --------- */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>MRP*</Text>
            <View style={styles.formRow}>
              <Text style={styles.txtInputLabel}>₹</Text>
              <TextInput
                placeholder="Type here"
                style={styles.rowTxtInput}
                keyboardType="number-pad"
              />
            </View>
          </View>
          {/* --------- MRP --------- */}

          {/* --------- Selling Price --------- */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Selling Price</Text>
            <View style={styles.formRow}>
              <Text style={styles.txtInputLabel}>₹</Text>
              <TextInput
                placeholder="Type here"
                style={styles.rowTxtInput}
                keyboardType="number-pad"
              />
            </View>
          </View>
          {/* --------- Selling Price --------- */}

          {/* --------- Quantity --------- */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Quantity *</Text>
            <TextInput
              placeholder="Type here"
              style={styles.txtInput}
              keyboardType="number-pad"
            />
          </View>
          {/* --------- Quantity --------- */}

          {/* --------- Unit --------- */}
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.formGroup}>
            <Text style={styles.formLabel}>Unit *</Text>
            <Text style={[styles.txtInput, {marginTop: 10}]}>Unit *</Text>
            {/* <TextInput
              placeholder="Type here"
              style={styles.txtInput}
              keyboardType="number-pad"
            /> */}
          </Pressable>
          {/* --------- Unit --------- */}

          {/* --------- Product Details --------- */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Product Details</Text>
            <TextInput
              placeholder="Type here"
              style={styles.txtInput}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>
          {/* --------- Product Details --------- */}

          {/* --------- Submit Button --------- */}
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>SUBMIT</Text>
          </View>
          {/* --------- Submit Button --------- */}
        </View>
      </ScrollView>

      {/* ======= Unit Modal Start ======= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Animatable.View animation="fadeIn" style={styles.modalContainer}>
          <Animatable.View
            animation="slideInLeft"
            delay={800}
            style={styles.modalCard}>
            {/* =========== Modal Heading =========== */}
            <View style={styles.modalHeadingRow}>
              <Text style={styles.modalHeadingTxt}>Select Unit</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Icons name="close-circle-outline" size={25} />
              </Pressable>
            </View>
            {/* =========== Modal Heading =========== */}

            {/* =========== Column 1 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>Piece</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>kg</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>gram</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>ml</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 1 =========== */}

            {/* =========== Column 2 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>liter</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>mm</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>ft</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>meter</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 2 =========== */}

            {/* =========== Column 3 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>sq ft.</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>sq. meter</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>km</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 3 =========== */}

            {/* =========== Column 4 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>set</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>hour</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>day</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>bunch</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 4 =========== */}

            {/* =========== Column 5 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>bundle</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>month</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>year</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>service</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 5 =========== */}

            {/* =========== Column 6 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>work</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>packet</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>box</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>pound</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 6 =========== */}

            {/* =========== Column 7 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>dozen</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>gunta</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>pair</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>minute</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 7 =========== */}

            {/* =========== Column 8 =========== */}
            <View style={styles.modalCol}>
              <View style={styles.modalRow}>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>qunitel</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>ton</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>capsule</Text>
                </View>
                <View style={styles.modalPill}>
                  <Text style={styles.modalPillTxt}>tablet</Text>
                </View>
              </View>
            </View>
            {/* =========== Column 8 =========== */}
          </Animatable.View>
        </Animatable.View>
      </Modal>
      {/* ======= Unit Modal End ======= */}
    </>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imgContainer: {
    width: 80,
    height: 80,
    borderWidth: 0.5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5E3360',
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  imgTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#5E3360',
  },
  imgBottomTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#000000',
  },
  imgDiv: {
    flex: 1,
    marginLeft: 10,
  },
  formGroup: {
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  formLabel: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#F4AA79',
  },
  txtInput: {
    borderBottomWidth: 0.5,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
  },
  txtInputLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
  },
  rowTxtInput: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  modalCard: {
    backgroundColor: '#E6AF88',
    width: '70%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
  },
  modalHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  modalHeadingTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    flex: 1,
  },
  modalCol: {
    marginTop: 10,
  },
  modalRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalPill: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderColor: '#5E3360',
    flex: 1,
    marginHorizontal: 3,
  },
  modalPillTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#5E3360',
  },
  btn: {
    width: '100%',
    marginTop: 15,
    backgroundColor: '#5E3360',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
  },
});
