import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';

const RegisterScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.screenDescription}>
            Enter your business/shop details
          </Text>

          <View style={styles.imgContainer}>
            <View style={styles.imgBox}>
              <Icons name="image-outline" size={30} color="#C6B5C7" />
            </View>
            <Text style={styles.imgLabel}>Upload Store Logo (if any)</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>BUSINESS/SHOP NAME</Text>
            <View style={styles.formRow}>
              <Icons name="business-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>CATEGORY</Text>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={styles.formRow}>
              <Icons name="list-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
              />
            </Pressable>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>CONTACT NUMBER</Text>
            <View style={styles.formRow}>
              <Text style={{fontFamily: 'OpenSans-SemiBold', fontSize: 16}}>
                +91
              </Text>
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>ADDRESS</Text>
            <View style={styles.formRow}>
              <Icons name="location-outline" size={20} color="#5E3360" />
              <TextInput
                placeholder=""
                style={styles.txtInput}
                selectionColor="#5E3360"
                autoCapitalize="words"
              />
            </View>
          </View>

          <Pressable
            onPress={() => navigation.navigate('VerificationScreen')}
            style={styles.btn}>
            <Text style={styles.btnTxt}>CONTINUE</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ======= Business Category Selection Modal Start ======= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeadingRow}>
              <Text style={styles.modalHeadingTxt}>
                Select Business Category
              </Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Icons name="close-circle-outline" size={25} />
              </Pressable>
            </View>

            <ScrollView>
              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>
                  Kirana Store, FMCG & Grocery Store
                </Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>

              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Fruits & Vegetables</Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>

              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>
                  Meat, Chicken & Fish Store
                </Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>

              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>
                  Home Decoration & Electronic Appliances
                </Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>

              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Pharmacy & Medical Store</Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>

              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Dairy Shops</Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>

              <View style={styles.modalCategory}>
                <Text style={styles.categoryTxt}>Bakery</Text>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* ======= Business Category Selection Modal End ======= */}
    </>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingHorizontal: 10,
  },
  screenDescription: {
    fontFamily: 'OpenSans-SemiBold',
    marginTop: 30,
    marginBottom: 10,
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  imgBox: {
    width: 70,
    height: 70,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  imgLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#5E3360',
    marginLeft: 10,
    flex: 1,
  },
  formGroup: {
    marginTop: 10,
    width: '100%',
    marginBottom: 30,
  },
  formLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#C6B5C7',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#5E3360',
  },
  txtInput: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  btn: {
    backgroundColor: '#5E3360',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  modalCard: {
    backgroundColor: '#FEF9E5',
    width: '100%',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingHorizontal: 15,
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
    fontSize: 18,
    flex: 1,
    color: '#5E3360',
  },
  modalCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    flex: 1,
  },
});
