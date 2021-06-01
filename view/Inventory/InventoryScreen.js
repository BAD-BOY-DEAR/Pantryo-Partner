import React, {useState, useEffect} from 'react';
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
  RefreshControl,
  Image,
} from 'react-native';

// ===== Images ===== //
import masala from '../../assets/productImages/masala.png';
import edibleOils from '../../assets/productImages/edibleOils.jpg';
import attaImg from '../../assets/productImages/atta.jpg';
import besan from '../../assets/productImages/besan.jpg';
import flour from '../../assets/productImages/flour.jpg';
import sooji from '../../assets/productImages/sooji.jpg';
import riceFlour from '../../assets/productImages/riceflour.jpg';
import otherFlour from '../../assets/productImages/otherFlour.jpg';
import rice from '../../assets/productImages/rice.jpg';
import saltSugar from '../../assets/productImages/saltsugar.jpg';
import pulsesGrains from '../../assets/productImages/pulsesgrains.jpg';
import baking from '../../assets/productImages/baking.jpg';
import frozenFood from '../../assets/productImages/frozenFood.jpg';
import packaged from '../../assets/productImages/packaged.jpg';
import veg from '../../assets/productImages/veg.jpg';
import fruits from '../../assets/productImages/fruits.jpg';

// ===== Library ===== //
import {createStackNavigator} from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';
import LoaderScreen from '../../controller/LoaderScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import {Picker} from '@react-native-picker/picker';

// ===== Components ===== //
import SelectCategory from './Product/CreateCategory';
import AddProducts from './Product/AddProduct';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const InventoryScreen = ({navigation}) => {
  const [changeCategoryModal, setChangeCategoryModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [partnerCategory, setPartnerCategory] = useState('');
  const [partnerProducts, setPartnerProducts] = useState('');
  const [partnerMainCategory, setPartnerMainCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [editModal, setEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState();
  const [partnerItemId, setPartnerItemId] = useState('');
  const [partnerItemBrand, setPartnerItemBrand] = useState('');
  const [partnerItemName, setPartnerItemName] = useState('');
  const [partnerItemQty, setPartnerItemQty] = useState('');
  const [partnerItemPrice, setPartnerItemPrice] = useState('');
  const [partnerItemUnit, setPartnerItemUnit] = useState('');

  //======== Pull Down to Refresh Function ========//
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllProductsOfPartnerApi();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  //======== Show Toast ========//
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  //======== API to fetch all products selected by the partner ========//
  const fetchAllProductsOfPartnerApi = async () => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    let partner_category = await AsyncStorage.getItem('partner_category');
    if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else if (!partner_category) {
      showToast('Partner Category not found!');
      return;
    } else {
      // setLoading(true);
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
            partner_category: partner_category,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            setPartnerProducts(result.AllPartnerProduct);
            setPartnerMainCategory(result.MainCategory);
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
  //======== API to fetch all products selected by the partner ========//

  //======== Partner Category ========//
  const setPartnerCategoryName = async () => {
    setPartnerCategory(await AsyncStorage.getItem('partner_category_name'));
  };
  //======== Partner Category ========//

  //======== API to Remove Products in the inventory of the partner ========//
  const removeProductApi = async partner_product_id => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else if (!partner_product_id) {
      showToast('Partner Product ID not found!');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=removePartnerProduct',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
            partner_product_id: partner_product_id,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            // showToast(result.msg);
            showToast('Product Removed ');
            fetchAllProductsOfPartnerApi();
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
  //======== API to Remove Products in the inventory of the partner ========//

  //======== Search Product =========//
  const searchProducts = async searchkey => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    if (!partner_id) {
      showToast('Partner Id not Fouond!');
      return;
    } else if (!searchkey) {
      fetchAllProductsOfPartnerApi();
    } else {
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=searchPartnerProduct',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
            searchkey: searchkey,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            setPartnerProducts(result.AllPartnerProduct);
          } else {
            // showToast('Something went Wrong!');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  //========Search Product=========//

  //========Search Product by Category=========//
  const searchByCategory = async main_category_id => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    let partner_category = await AsyncStorage.getItem('partner_category');
    if (!partner_id) {
      showToast('Partner Id not Fouond!');
      return;
    } else if (!main_category_id) {
      showToast('Partner Main Category Id not Fouond!');
      return;
    } else if (!partner_category) {
      showToast('Partner Category Id not Fouond!');
      return;
    } else {
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=searchPartnerProductByCategory',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
            partner_category: partner_category,
            main_category_id: main_category_id,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            setPartnerProducts(result.AllPartnerProduct);
          } else {
            // showToast('Something went Wrong!');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  //========Search Product by Category=========//

  ///======Edit Product abd Update =======//
  const updatePartnerProduct = async () => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    if (!partnerItemId) {
      showToast('Partner Product ID not found!');
      return;
    } else if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else if (!partnerItemPrice) {
      showToast('Enter product pricee!');
      return;
    } else if (!partnerItemUnit) {
      showToast('Partner product unit not selected!');
      return;
    } else if (!partnerItemQty) {
      showToast('Enter Partner Product Qty!');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=updatePartnerProduct',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
            product_id: partnerItemId,
            product_price: partnerItemPrice,
            product_unit: partnerItemUnit,
            product_qyt: partnerItemQty,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            showToast('Product Details Updated ');
            fetchAllProductsOfPartnerApi();
          } else {
            showToast('Something went Wrong!');
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          // setLoading(false)
          setEditModal(false);
        });
    }
  };
  ///======Edit Product and Update =======//

  useEffect(() => {
    setPartnerCategoryName();
    fetchAllProductsOfPartnerApi();
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <View style={styles.container}>
        {/* ========== Header Section ========== */}
        <View style={styles.headerSection}>
          {/* ========== Add Product Section ========== */}
          <Pressable
            onPress={() => setChangeCategoryModal(true)}
            style={styles.addBtn}>
            <Text style={styles.addBtnTxt}>Filter Product Cateory</Text>
            <Icons name="add-circle-outline" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('SelectCategory')}
            style={styles.addBtn}>
            <Text style={styles.addBtnTxt}>Add Products</Text>
            <Icons name="add-circle-outline" size={20} color="#FFFFFF" />
          </Pressable>
          {/* ========== Add Product Section ========== */}
        </View>
        {/* ========== Header Section ========== */}

        {/* ========== Search Box Section ========== */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Icons name="search-outline" size={20} />
            <TextInput
              placeholder="Search through brand, product or category"
              placeholderTextColor="#777"
              style={styles.searchTxtInput}
              color="#000"
              autoCapitalize="words"
              onChangeText={txt => searchProducts(txt)}
            />
            <Pressable style={styles.searchBtn}>
              <Icons name="arrow-forward-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
        {/* ========== Search Box Section ========== */}

        {partnerProducts == '' ? (
          <ScrollView
            style={{flex: 1, paddingVertical: '50%'}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {isLoading == false ? (
              <>
                {/* ========== No Inventory Found ALert ========== */}
                <View style={styles.alertSection}>
                  <Text style={styles.alert}>
                    You have not selected any products
                  </Text>
                  <Pressable
                    onPress={() => navigation.navigate('SelectCategory')}
                    style={styles.btnPrompt}>
                    <Text style={styles.btnPromptTxt}>ADD PRODUCTS</Text>
                  </Pressable>
                </View>
                {/* ========== No Inventory Found ALert ========== */}
              </>
            ) : null}
          </ScrollView>
        ) : (
          <FlatList
            style={{width: '100%'}}
            data={partnerProducts}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
              <>
                {/* ========== Category Selection Section ========== */}
                <View style={styles.categorySection}>
                  <View style={styles.div}>
                    <Text style={styles.categoryLabel}>Product Category</Text>
                    <Text style={styles.categoryResponse}>
                      {item.main_category_name}
                    </Text>
                  </View>
                </View>
                {/* ========== Category Selection Section ========== */}

                {/* ========== Selected Inventory Section ========== */}
                <FlatList
                  style={{width: '100%'}}
                  data={item.Products}
                  renderItem={({item}) => (
                    <>
                      <View style={styles.inventorySection}>
                        <View style={styles.inventoryTab}>
                          <View style={styles.inventoryTabDiv}>
                            <Text style={styles.inventoryBrand}>
                              {item.product_brand ? item.product_brand : ''}
                            </Text>
                            <Text style={styles.inventoryProduct}>
                              {item.product_name
                                ? item.product_name
                                : 'No Product Name'}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginTop: 5,
                              }}>
                              <Pressable
                                onPress={() =>
                                  removeProductApi(item.product_id)
                                }>
                                <Text
                                  style={{
                                    fontFamily: 'OpenSans-SemiBold',
                                    marginRight: 30,
                                    color: 'red',
                                  }}>
                                  Remove
                                </Text>
                              </Pressable>

                              <Pressable
                                onPress={() => {
                                  setPartnerItemBrand(item.product_brand);
                                  setPartnerItemId(item.product_id);
                                  setPartnerItemName(item.product_name);
                                  setPartnerItemQty(item.product_qty);
                                  setPartnerItemPrice(item.product_price);
                                  setPartnerItemUnit(item.product_unit);
                                  setEditModal(true);
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'OpenSans-SemiBold',
                                    color: '#444444',
                                  }}>
                                  Edit
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                          <View style={styles.inventoryRow}>
                            <Text style={styles.qty}>
                              {item.product_qty
                                ? item.product_qty
                                : 'No Quantity'}{' ' +item.product_unit}
                            </Text>
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={styles.price}>
                              {item.product_price
                                ? '₹' + item.product_price
                                : 'No Price'}
                            </Text>
                          </View>
                          <View style={styles.btnsSection}>
                            <Switch
                              trackColor={{
                                false: '#767577',
                                true: '#ababab',
                              }}
                              thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={toggleSwitch}
                              value={isEnabled}
                              style={styles.toggle}
                            />
                            <Text>
                              {item.product_status ? item.product_status : null}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                  keyExtractor={(item, product_id) => String(product_id)}
                />
                {/* ========== Selected Inventory Section ========== */}
              </>
            )}
            keyExtractor={(item, product_id) => String(product_id)}
          />
        )}
      </View>

      {/* ========== Category Modal ========== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={changeCategoryModal}
        onRequestClose={() => {
          setChangeCategoryModal(!changeCategoryModal);
        }}>
        {/* <ScrollView> */}
        <View style={styles.modalbackground}>
          <Animatable.View animation="zoomIn" style={styles.modalCard}>
            <View style={styles.categoryMain}>
              {partnerMainCategory !== '' ? (
                <FlatList
                  style={{width: '100%'}}
                  data={partnerMainCategory}
                  ListHeaderComponent={() => (
                    <View style={styles.modalHeaderRow}>
                      <Text style={styles.modalHeader}>Change Category</Text>
                      <Pressable
                        onPress={() =>
                          setChangeCategoryModal(!changeCategoryModal)
                        }>
                        <Icons
                          name="close-circle-outline"
                          size={20}
                          color="#000"
                        />
                      </Pressable>
                    </View>
                  )}
                  renderItem={({item}) => (
                    <>
                      <Pressable
                        onPress={() => {
                          searchByCategory(item.main_category_id);
                          setChangeCategoryModal(!changeCategoryModal);
                        }}
                        style={styles.modalCatRow}>
                        {item.main_category_name == 'Spices & Masala' ? (
                          <Image
                            source={masala}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Edible Oils' ? (
                          <Image
                            source={edibleOils}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Wheat Flour' ? (
                          <Image
                            source={attaImg}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Besan' ? (
                          <Image source={besan} style={styles.modalCatRowImg} />
                        ) : item.main_category_name == 'Flour' ? (
                          <Image source={flour} style={styles.modalCatRowImg} />
                        ) : item.main_category_name == 'Sooji' ? (
                          <Image source={sooji} style={styles.modalCatRowImg} />
                        ) : item.main_category_name == 'Rice Flour' ? (
                          <Image
                            source={riceFlour}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Other Flours' ? (
                          <Image
                            source={otherFlour}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Rice' ? (
                          <Image source={rice} style={styles.modalCatRowImg} />
                        ) : item.main_category_name == 'Salt & Sugar' ? (
                          <Image
                            source={saltSugar}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Pulses & Grains' ? (
                          <Image
                            source={pulsesGrains}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Baking Items' ? (
                          <Image
                            source={baking}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Frozen Food' ? (
                          <Image
                            source={frozenFood}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Packaged Products' ? (
                          <Image
                            source={packaged}
                            style={styles.modalCatRowImg}
                          />
                        ) : item.main_category_name == 'Vegetables' ? (
                          <Image source={veg} style={styles.modalCatRowImg} />
                        ) : item.main_category_name == 'Fruits' ? (
                          <Image
                            source={fruits}
                            style={styles.modalCatRowImg}
                          />
                        ) : (
                          <Icons name="image" size={40} color="#777" />
                        )}

                        {/* <Image source={masala} style={styles.modalCatRowImg} /> */}
                        <Text style={styles.categoryTxt}>
                          {item.main_category_name}
                        </Text>
                      </Pressable>
                    </>
                  )}
                  keyExtractor={(item, product_id) => String(product_id)}
                />
              ) : (
                <Text>No Category Found!</Text>
              )}
            </View>
          </Animatable.View>
        </View>
        {/* </ScrollView> */}
      </Modal>
      {/* ========== Category Modal ========== */}

      {/* ========== Edit Modal ========== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setEditModal(!editModal);
        }}>
        <View style={styles.editModal}>
          <Animatable.View animation="slideInUp" style={styles.editModalCard}>
            <View style={styles.editModalMainTxt}>
              <Text style={styles.editModalBrandName}>{partnerItemBrand}</Text>
              <Text style={styles.editModalProductName}>{partnerItemName}</Text>
            </View>

            <View style={styles.editModalRow}>
              <Text style={styles.editModalLabel}>Qty</Text>
              <TextInput
                keyboardType="number-pad"
                value={partnerItemQty}
                placeholder="New Qty"
                placeholderTextColor="#777"
                style={styles.editModalTxtInput}
                onChangeText={text => setPartnerItemQty(text)}
              />
            </View>

            <View style={styles.editModalRow}>
              <Text style={styles.editModalLabel}>Unit</Text>
              <Picker
                mode="dropdown"
                style={{
                  borderBottomWidth: 0.5,
                  textAlign: 'right',
                  width: '30%',
                }}
                selectedValue={partnerItemUnit}
                onValueChange={(itemValue, itemIndex) =>
                  setPartnerItemUnit(itemValue)
                }>
                <Picker.Item label="gm" value="gm" />
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="ml" value="ml" />
                <Picker.Item label="ltr" value="ltr" />
                <Picker.Item label="crate" value="crate" />
                <Picker.Item label="dozen" value="dozen" />
                <Picker.Item label="Pcs" value="Pcs" />
              </Picker>
            </View>

            <View style={styles.editModalRow}>
              <Text style={styles.editModalLabel}>Price </Text>
              <Text style={{paddingLeft: 20}}>₹ </Text>
              <TextInput
                placeholder="New Price"
                placeholderTextColor="#777"
                style={styles.editModalTxtInput}
                keyboardType="number-pad"
                value={partnerItemPrice}
                onChangeText={text => setPartnerItemPrice(text)}
              />
            </View>

            <View style={styles.editModalBtnContainer}>
              <Pressable
                style={styles.editModalCancelBtn}
                onPress={() => setEditModal(!editModal)}>
                <Text style={styles.editModalBtnTxt}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => updatePartnerProduct()}
                style={styles.editModalConfirmBtn}>
                <Text style={styles.editModalBtnTxt}>Confirm</Text>
              </Pressable>
            </View>
          </Animatable.View>
        </View>
      </Modal>
      {/* ========== Edit Modal ========== */}
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
    color: '#000',
  },
  btnPrompt: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#F4AA79',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 5,
  },
  btnPromptTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  headerSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#5E3360',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 3,
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

    paddingHorizontal: 10,
  },
  searchBox: {
    borderRadius: 5,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
    marginTop: 10,
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
  },
  inventoryTabDiv: {
    flex: 2,
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
    flex: 1,
  },
  qty: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  price: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
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
  modalCatRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalCatRowImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  categoryTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    marginLeft: 10,
  },
  editModal: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editModalCard: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  editModalMainTxt: {
    marginBottom: 15,
    marginTop: 20,
  },
  editModalBrandName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  editModalProductName: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
  },
  editModalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  editModalLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    flex: 1,
  },
  editModalTxtInput: {
    borderBottomColor: '#c7c7c7c7',
    borderBottomWidth: 0.5,
    marginRight: 20,
    fontFamily: 'OpenSans-Regular',
    width: '30%',
    textAlign: 'center',
    color: '#000',
  },
  editModalBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  editModalCancelBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4AA79',
    paddingVertical: 15,
    marginHorizontal: 3,
  },
  editModalConfirmBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C6B5C7',
    paddingVertical: 15,
    marginHorizontal: 3,
  },
  editModalBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
});
