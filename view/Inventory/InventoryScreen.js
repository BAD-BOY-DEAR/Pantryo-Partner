import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Switch,
  TextInput,
} from 'react-native';

// // ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import DropDownPicker from 'react-native-dropdown-picker';

// // ===== Screens ===== //
// import ViewProduct from './Product/ViewProduct';
import CreateCategory from './Product/CreateCategory';
import AddProduct from './Product/AddProduct';

// ===== Images ===== //
import rawChicken from '../../assets/productImages/rawChicken.jpg';

const AllProduct = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchModal, setSearchModal] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([{label: '', value: ''}]);

  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerInnerRow}>
              <Text style={styles.headerTxt}>Search Product</Text>
              <Pressable onPress={() => setSearchModal(true)}>
                <Icons name="search-outline" size={30} color="#5E3360" />
              </Pressable>
            </View>

            <Pressable
              onPress={() => navigation.navigate('CreateCategory')}
              style={styles.headerAddBtn}>
              <Icons name="add-outline" size={30} color="#5E3360" />
            </Pressable>
          </View>

          <View style={styles.div}>
            <Text style={styles.headingOne}>Your Category</Text>
            <Text style={styles.headingTwo}>Chicken</Text>
            <ScrollView style={{paddingBottom: 20}} horizontal={true}>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />
                <Text style={styles.cardProduct}>Broiler Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
                <Text style={[styles.cardContent, {color: 'green'}]}>
                  In Stock
                </Text>
              </Pressable>

              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Curry Cut Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
                <Text style={[styles.cardContent, {color: 'green'}]}>
                  In Stock
                </Text>
              </View>

              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Boneless Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
                <Text style={[styles.cardContent, {color: 'green'}]}>
                  In Stock
                </Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.div}>
            <Text style={styles.headingOne}>Your Category</Text>
            <Text style={styles.headingTwo}>Mutton</Text>
            <ScrollView style={{paddingBottom: 20}} horizontal={true}>
              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Broiler Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
                <Text style={[styles.cardContent, {color: 'red'}]}>
                  Out of Stock
                </Text>
              </View>

              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Curry Cut Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
              </View>

              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Boneless Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.div}>
            <Text style={styles.headingOne}>Your Category</Text>
            <Text style={styles.headingTwo}>Fish</Text>
            <ScrollView style={{paddingBottom: 20}} horizontal={true}>
              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Broiler Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
              </View>

              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Curry Cut Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
              </View>

              <View style={styles.card}>
                <Image source={rawChicken} style={styles.cardImg} />

                <Text style={styles.cardProduct}>Boneless Chicken</Text>
                <Text style={styles.cardContent}>1kg - ₹120</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* ============ Product details modal ============ */}
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
              <Text style={styles.modalHeadingTxt}>Product Details</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Icons name="close-circle-outline" size={25} color="#000000" />
              </Pressable>
            </View>

            <View style={styles.modalProductDetailsSection}>
              <View style={styles.modalDiv}>
                <Text style={styles.productDetailsLabel}>Product Name</Text>
                <Text style={styles.productDetailsMain}>Broiler Chicken</Text>
              </View>
              <Pressable>
                <Icons name="create-outline" size={25} color="#000000" />
              </Pressable>
            </View>

            <View style={styles.modalProductDetailsSection}>
              <View style={styles.modalDiv}>
                <Text style={styles.productDetailsLabel}>Quantity</Text>
                <Text style={styles.productDetailsMain}>1</Text>
              </View>
              <Pressable>
                <Icons name="create-outline" size={25} color="#000000" />
              </Pressable>
            </View>

            <View style={styles.modalProductDetailsSection}>
              <View style={styles.modalDiv}>
                <Text style={styles.productDetailsLabel}>Unit</Text>
                <Text style={styles.productDetailsMain}>kg</Text>
              </View>
              <Pressable>
                <Icons name="create-outline" size={25} color="#000000" />
              </Pressable>
            </View>

            <View style={styles.modalProductDetailsSection}>
              <View style={styles.modalDiv}>
                <Text style={styles.productDetailsLabel}>Selling Price</Text>
                <Text style={styles.productDetailsMain}>₹120</Text>
              </View>
              <Pressable>
                <Icons name="create-outline" size={25} color="#000000" />
              </Pressable>
            </View>

            <View style={styles.modalProductDetailsSection}>
              <View style={styles.modalDiv}>
                <Text style={styles.productDetailsMain}>In Stock</Text>
              </View>
              <View>
                <Switch
                  trackColor={{false: '#767577', true: '#cfcfcf'}}
                  thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* ============ Product details modal ============ */}

      {/* ============ Search modal ============ */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={searchModal}
        onRequestClose={() => {
          setSearchModal(!searchModal);
        }}>
        <View style={styles.searchModalContainer}>
          <View style={styles.searchModalCard}>
            <Pressable
              onPress={() => setSearchModal(!searchModal)}
              style={styles.closeBtn}>
              <Icons name="close-circle-outline" size={25} />
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="Enter product name"
                style={{
                  flex: 1,
                  borderBottomWidth: 0.5,
                  marginBottom: 20,
                  marginRight: 20,
                  fontFamily: 'OpenSans-Regular',
                }}
              />
              <Icons name="search-outline" size={25} />
            </View>
          </View>
        </View>
      </Modal>
      {/* ============ Search modal ============ */}
    </>
  );
};

const Stack = createStackNavigator();

function Inventory() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="AllProduct" component={AllProduct} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="CreateCategory" component={CreateCategory} />
    </Stack.Navigator>
  );
}

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  headerInnerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  headerTxt: {
    fontFamily: 'OpenSans-Regular',
    marginRight: 10,
    fontSize: 16,
  },
  div: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  headingOne: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000000',
  },
  headingTwo: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#5E3360',
    marginTop: -5,
  },
  card: {
    width: 180,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 25,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  cardImg: {
    width: 150,
    height: 150,
    borderRadius: 10,
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  cardProduct: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  cardContent: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalHeadingTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    flex: 1,
  },
  modalProductDetailsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalDiv: {
    flex: 1,
    marginBottom: 20,
  },
  productDetailsLabel: {
    fontFamily: 'OpenSans-Regular',
  },
  productDetailsMain: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  searchModalContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchModalCard: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  closeBtn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  searchBox: {
    borderWidth: 0,
  },
  searchBoxContainer: {
    borderBottomWidth: 0,
  },
  searchBoxTxtInput: {
    color: '#000',
    borderWidth: 0,
    borderBottomWidth: 0.5,
    fontFamily: 'OpenSans-Regular',
  },
  headerAddBtn: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C6B5C7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 10,
    borderRadius: 5,
  },
});
