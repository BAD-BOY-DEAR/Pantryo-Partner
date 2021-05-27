import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Switch,
  ToastAndroid,
  FlatList,
} from 'react-native';

// ===== Library ===== //
import {createStackNavigator} from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';
import LoaderScreen from '../../controller/LoaderScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== Components ===== //
import SelectCategory from './Product/CreateCategory';
import AddProducts from './Product/AddProduct';

const InventoryScreen = ({navigation}) => {
  const [changeCategoryModal, setChangeCategoryModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [partnerProducts, setPartnerProducts] = useState([]);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  ///Toast Show//
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const fetchAllProductsOfPartnerApi = async () => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getProductOfPartner',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            setPartnerProducts(result.Allproduct);
          } else {
            showToast('Something went Wrong!');
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  React.useEffect(() => {
    fetchAllProductsOfPartnerApi();
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <View style={styles.container}>
        {/* ========== Header Section ========== */}
        <View style={styles.headerSection}>
          <Pressable
            onPress={() => navigation.navigate('SelectCategory')}
            style={styles.addBtn}>
            <Text style={styles.addBtnTxt}>Add Products</Text>
            <Icons name="add-circle-outline" size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.searchSection}>
            <Icons name="search-outline" size={20} />
            <TextInput
              placeholder="Search through brand, product or category"
              style={styles.searchTxtInput}
              autoCapitalize="words"
            />
            <Pressable style={styles.searchBtn}>
              <Icons name="arrow-forward-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
        {/* ========== Header Section ========== */}

        {/* ========== Category Selection Section ========== */}
        <View style={styles.categorySection}>
          <View style={styles.div}>
            <Text style={styles.categoryLabel}>Category</Text>
            <Text style={styles.categoryResponse}>Spices & Masala</Text>
          </View>
          <Pressable onPress={() => setChangeCategoryModal(true)}>
            <Icons name="filter-outline" size={20} style={styles.icon} />
          </Pressable>
        </View>
        {/* ========== Category Selection Section ========== */}

        {/* ========== Selected Inventory Section ========== */}

        <View style={styles.inventorySection}>
          <FlatList
            style={{width: '100%'}}
            data={partnerProducts}
            renderItem={({item}) => (
              <>
                <View style={styles.inventoryTab}>
                  <View style={styles.inventoryTabDiv}>
                    <Text style={styles.inventoryBrand}>
                      {item.partner_product_brand
                        ? item.partner_product_brand
                        : 'No Brand Name'}
                    </Text>
                    <Text style={styles.inventoryProduct}>
                      {item.partner_product_name
                        ? item.partner_product_name
                        : 'No Product Name'}
                    </Text>
                    <View style={styles.inventoryRow}>
                      <Text style={styles.qty}>
                        {item.partner_product_quantity
                          ? item.partner_product_quantity
                          : 'No Quantity'}
                      </Text>
                      <Text style={styles.price}>
                        {item.partner_product_price
                          ? '₹' + item.partner_product_price
                          : 'No Price'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.btnsSection}>
                    <Icons
                      name="create-outline"
                      size={20}
                      style={styles.icon}
                    />
                    <Switch
                      trackColor={{false: '#767577', true: '#ababab'}}
                      thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={styles.toggle}
                    />
                    {isEnabled ? (
                      <Text>In Stock</Text>
                    ) : (
                      <Text>Out of Stock</Text>
                    )}
                  </View>
                </View>
              </>
            )}
            keyExtractor={(item, partner_product_id) =>
              String(partner_product_id)
            }
          />
        </View>
        {/* ========== Selected Inventory Section ========== */}

        {/* ========== No Inventory Found ALert ========== */}
        {partnerProducts === null ? (
          <View style={styles.alertSection}>
            <Text style={styles.alert}>You have not selected any products</Text>
          </View>
        ) : null}
        {/* ========== No Inventory Found ALert ========== */}
      </View>

      {/* ========== Category Modal ========== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changeCategoryModal}
        onRequestClose={() => {
          setChangeCategoryModal(!changeCategoryModal);
        }}>
        <View style={styles.modalbackground}>
          <View style={styles.modalCard}>
            <ScrollView>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeader}>Change Category</Text>
                <Pressable
                  onPress={() => setChangeCategoryModal(!changeCategoryModal)}>
                  <Icons name="close-circle-outline" size={20} color="#000" />
                </Pressable>
              </View>
              <View style={styles.categoryMain}>
                <Text style={styles.categoryTxt}>Spices & Masala</Text>
                <Text style={styles.categoryTxt}>Edible Oils</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* ========== Category Modal ========== */}
    </>
  );
};

const Stack = createStackNavigator();

const InventoryScreenHolder = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
      <Stack.Screen name="SelectCategory" component={SelectCategory} />
      <Stack.Screen name="AddProducts" component={AddProducts} />
    </Stack.Navigator>
  );
};

export default InventoryScreenHolder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  alertSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  headerSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#E6AF88',
  },
  addBtn: {
    backgroundColor: '#5E3360',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    marginRight: 5,
    color: '#FFFFFF',
  },
  searchSection: {
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
  },
  searchTxtInput: {
    flex: 1,
    marginRight: 20,
    marginLeft: 10,
    fontFamily: 'OpenSans-Regular',
  },
  searchBtn: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#5E3360',
  },
  categorySection: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  div: {
    flex: 1,
  },
  categoryLabel: {
    fontFamily: 'OpenSans-Regular',
  },
  categoryResponse: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#5E3360',
  },
  icon: {
    marginRight: 10,
  },
  inventorySection: {
    flex: 1,
    marginBottom: 30,
    width: '100%',
  },
  inventoryTab: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7',
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  inventoryTabDiv: {
    flex: 1,
  },
  inventoryBrand: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  inventoryProduct: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    marginTop: 3,
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  qty: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  price: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: 'green',
    marginLeft: 5,
  },
  btnsSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toggle: {
    marginBottom: 5,
    marginTop: 20,
  },
  modalbackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingBottom: 20,
    paddingTop: 10,
  },
  modalHeader: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    flex: 1,
  },
  categoryMain: {
    marginBottom: 20,
    marginTop: 20,
  },
  categoryTxt: {
    marginBottom: 10,
    paddingBottom: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
});
