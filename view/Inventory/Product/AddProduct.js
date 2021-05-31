import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  FlatList,
  ToastAndroid,
  RefreshControl,
  ScrollView,
} from 'react-native';

// ===== Images ===== //
import masala from '../../../assets/productImages/masala.png';
import edibleOils from '../../../assets/productImages/edibleOils.jpg';
import attaImg from '../../../assets/productImages/atta.jpg';
import besan from '../../../assets/productImages/besan.jpg';
import flour from '../../../assets/productImages/flour.jpg';
import sooji from '../../../assets/productImages/sooji.jpg';
import riceFlour from '../../../assets/productImages/riceflour.jpg';
import otherFlour from '../../../assets/productImages/otherFlour.jpg';
import rice from '../../../assets/productImages/rice.jpg';
import saltSugar from '../../../assets/productImages/saltsugar.jpg';
import pulsesGrains from '../../../assets/productImages/pulsesgrains.jpg';
import baking from '../../../assets/productImages/baking.jpg';
import frozenFood from '../../../assets/productImages/frozenFood.jpg';
import packaged from '../../../assets/productImages/packaged.jpg';
import veg from '../../../assets/productImages/veg.jpg';
import fruits from '../../../assets/productImages/fruits.jpg';

//======= Components =========//
import LoaderScreen from '../../../controller/LoaderScreen';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useScrollToTop} from '@react-navigation/native';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AddProducts = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [pantryoInvetory, setPantryoInventory] = React.useState([]);
  const [mainCategoryName, setMainCategoryName] = React.useState([]);
  const [newprice, setNewPrice] = React.useState('');
  const [inventoryId, setInventoryId] = React.useState('');
  const [partnerCategoryId, setPanterCategoryId] = React.useState('');
  const [partnerMainCategoryId, setPanterMainCategoryId] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState();
  const [inventoryQty, setInventoryQty] = React.useState('');

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPantryoInventory(partnerCategoryId, partnerMainCategoryId);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // =========== Toast Function =========== //
  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const fetchPantryoInventory = async (partner_category, main_category_id) => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    if (!partner_category) {
      showToast('Partner Category ID not found!');
      return;
    } else if (!main_category_id) {
      showToast('Partner Main Category ID not found!');
      return;
    } else if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=getPantryoInventoryData',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_category: partner_category,
            main_category_id: main_category_id,
            partner_id: partner_id,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // console.log(result);
          if (result.error == 0) {
            setPantryoInventory(result.PantryoInventoryData);
            setMainCategoryName(result.MainCategoryName);
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

  ///======Add Product =======//
  const addProductApi = async (
    partner_category_id,
    main_category_id,
    inventory_id,
    product_name,
    product_brand,
    product_qty,
    product_price,
  ) => {
    let partner_id = await AsyncStorage.getItem('partner_id');
    let price = null;
    if (newprice) {
      price = newprice;
    } else {
      price = product_price;
    }
    if (!partner_category_id) {
      showToast('Partner Category ID not found!');
      return;
    } else if (!main_category_id) {
      showToast('Partner Main Category ID not found!');
      return;
    } else if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else if (!inventory_id) {
      showToast('Partner Inventory ID not found!');
      return;
    } else if (!product_name) {
      showToast('Enter Product Name!');
      return;
    } else if (!product_qty) {
      showToast('Enter Product Brand Name!');
      return;
    } else if (!price) {
      showToast('Enter Product Price!');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=addProductByPartner',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
            partner_category_id: partner_category_id,
            main_category_id: main_category_id,
            inventory_id: inventory_id,
            product_brand: product_brand,
            product_name: product_name,
            product_quantity: product_qty,
            product_price: price,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          console.log(result);
          if (result.error == 0) {
            showToast(result.msg);
            fetchPantryoInventory(
              result.partner_category_id,
              result.main_category_id,
            );
          } else {
            // showToast('Something went Wrong! Please try Again!');
            showToast(result.msg);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };
  ///======Add Product =======//

  React.useEffect(() => {
    let {partner_category, main_category_id} = route.params;
    if (partner_category) {
      if (main_category_id) {
        setPanterCategoryId(partner_category);
        setPanterMainCategoryId(main_category_id);
        fetchPantryoInventory(partner_category, main_category_id);
      }
    }
  }, []);

  return (
    <>
      {isLoading == true ? (
        <LoaderScreen />
      ) : (
        <View style={styles.container}>
          <View style={styles.searchSection}>
            <View style={styles.searchBox}>
              <Icons name="search-outline" size={20} color="#777" />
              <TextInput
                placeholder="Search by Brand or Product"
                autoCapitalize="words"
                style={styles.searchTxtInput}
              />
              <Pressable style={styles.searchBtn}>
                <Icons name="arrow-forward-outline" size={25} color="#fff" />
              </Pressable>
            </View>
          </View>
          <ScrollView
            ref={ref}
            style={{
              width: '100%',
            }}>
            <View style={styles.catSection}>
              <View style={styles.catContainer}>
                {mainCategoryName == 'Spices & Masala' ? (
                  <Image source={masala} style={styles.catImg} />
                ) : mainCategoryName == 'Edible Oils' ? (
                  <Image source={edibleOils} style={styles.catImg} />
                ) : mainCategoryName == 'Wheat Flour' ? (
                  <Image source={attaImg} style={styles.catImg} />
                ) : mainCategoryName == 'Besan' ? (
                  <Image source={besan} style={styles.catImg} />
                ) : mainCategoryName == 'Flour' ? (
                  <Image source={flour} style={styles.catImg} />
                ) : mainCategoryName == 'Sooji' ? (
                  <Image source={sooji} style={styles.catImg} />
                ) : mainCategoryName == 'Rice Flour' ? (
                  <Image source={riceFlour} style={styles.catImg} />
                ) : mainCategoryName == 'Other Flours' ? (
                  <Image source={otherFlour} style={styles.catImg} />
                ) : mainCategoryName == 'Rice' ? (
                  <Image source={rice} style={styles.catImg} />
                ) : mainCategoryName == 'Salt & Sugar' ? (
                  <Image source={saltSugar} style={styles.catImg} />
                ) : mainCategoryName == 'Pulses & Grains' ? (
                  <Image source={pulsesGrains} style={styles.catImg} />
                ) : mainCategoryName == 'Baking Items' ? (
                  <Image source={baking} style={styles.catImg} />
                ) : mainCategoryName == 'Frozen Food' ? (
                  <Image source={frozenFood} style={styles.catImg} />
                ) : mainCategoryName == 'Packaged Products' ? (
                  <Image source={packaged} style={styles.catImg} />
                ) : mainCategoryName == 'Vegetables' ? (
                  <Image source={veg} style={styles.catImg} />
                ) : mainCategoryName == 'Fruits' ? (
                  <Image source={fruits} style={styles.catImg} />
                ) : (
                  <Icons name="image" size={40} color="#777" />
                )}
                <View
                  style={{
                    flex: 1,
                    marginLeft: 20,
                  }}>
                  <Text style={styles.catName}>{mainCategoryName}</Text>
                  <Text style={styles.noticeTxt}>
                    Select all the items that you sell from your store. You can
                    also edit the price & the Qty of the items accordingly
                  </Text>
                </View>
              </View>

              {/* <View style={styles.noticeSection}>
                <View style={styles.noticeTab}>
                  <Text style={styles.noticeTxt}>
                    Select all the items that you sell from your store. You can
                    also edit the price & the Qty of the items accordingly
                  </Text>
                </View>
              </View> */}
              {pantryoInvetory !== '' ? (
                <FlatList
                  ref={ref}
                  showsVerticalScrollIndicator={false}
                  style={{width: '100%'}}
                  data={pantryoInvetory}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  renderItem={({item}) => (
                    <>
                      {item.product_assign_status == 'not added' ? (
                        <View style={styles.prodTab}>
                          <View style={styles.productContainer}>
                            <View style={styles.productDiv}>
                              <Text style={styles.prodBrandName}>
                                {item.pantryo_brand_name
                                  ? item.pantryo_brand_name
                                  : ''}
                              </Text>
                              <Text style={styles.prodName}>
                                {item.pantryo_item_name
                                  ? item.pantryo_item_name
                                  : 'item name not found!'}
                              </Text>
                            </View>

                            {item.product_assign_status == 'not added' ? (
                              <Pressable
                                onPress={() =>
                                  addProductApi(
                                    item.partner_category_id,
                                    item.pantryo_main_category_id,
                                    item.pantryo_inventory_id,
                                    item.pantryo_item_name,
                                    item.pantryo_brand_name,
                                    item.pantryo_item_qty,
                                    item.pantryo_item_price,
                                  )
                                }
                                style={styles.addBtn}>
                                <Icons
                                  name="add-outline"
                                  size={15}
                                  color="green"
                                />
                              </Pressable>
                            ) : (
                              <Pressable
                                style={[
                                  styles.addBtn,
                                  {backgroundColor: 'green'},
                                ]}>
                                <Icons
                                  name="checkmark-outline"
                                  size={20}
                                  color="white"
                                />
                              </Pressable>
                            )}
                          </View>

                          <View style={styles.prodInnerRow}>
                            <Text style={{flex: 1}}>Qty</Text>
                            <TextInput
                              placeholderTextColor="#000"
                              placeholder="Qty"
                              keyboardType="number-pad"
                              value={
                                item.pantryo_inventory_id === inventoryQty
                                  ? newprice
                                  : item.pantryo_item_qty
                              }
                              style={styles.prodTxtInput}
                              onChangeText={text => {
                                // setNewPrice(text);
                                setInventoryQty(item.pantryo_inventory_id);
                              }}
                            />
                          </View>

                          <View style={styles.prodInnerRow}>
                            <Text style={{flex: 1}}>Unit</Text>
                            <View
                              style={{
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                borderColor: '#c7c7c7c7',
                                width: '30%',
                              }}>
                              <Picker
                                mode="dropdown"
                                style={{
                                  width: '100%',
                                  justifyContent: 'flex-end',
                                }}
                                selectedValue={selectedUnit}
                                onValueChange={(itemValue, itemIndex) =>
                                  setSelectedUnit(itemValue)
                                }>
                                <Picker.Item label="gm" value="gm" />
                                <Picker.Item label="kg" value="kg" />
                                <Picker.Item label="ml" value="ml" />
                                <Picker.Item label="ltr" value="ltr" />
                                <Picker.Item label="pcs" value="pcs" />
                                <Picker.Item label="crate" value="crate" />
                                <Picker.Item label="Dozen" value="Dozen" />
                              </Picker>
                            </View>
                          </View>

                          <View style={styles.prodInnerRow}>
                            <Text style={{flex: 1}}>Price</Text>
                            <TextInput
                              placeholder="₹"
                              placeholderTextColor="#000"
                              keyboardType="number-pad"
                              value={
                                item.pantryo_inventory_id === inventoryId
                                  ? newprice
                                  : item.pantryo_item_price
                              }
                              style={styles.prodTxtInput}
                              onChangeText={text => {
                                setNewPrice(text);
                                setInventoryId(item.pantryo_inventory_id);
                              }}
                            />
                          </View>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.productContainer,
                            {
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#c7c7c7c7',
                              paddingBottom: 20,
                            },
                          ]}>
                          <View style={styles.productDiv}>
                            <Text style={styles.prodBrandName}>
                              {item.pantryo_brand_name
                                ? item.pantryo_brand_name
                                : ''}
                            </Text>
                            <Text style={styles.prodName}>
                              {item.pantryo_item_name
                                ? item.pantryo_item_name
                                : 'item name not found!'}
                            </Text>
                          </View>
                          {item.product_assign_status == 'not added' ? (
                            <Pressable
                              onPress={() =>
                                addProductApi(
                                  item.partner_category_id,
                                  item.pantryo_main_category_id,
                                  item.pantryo_inventory_id,
                                  item.pantryo_item_name,
                                  item.pantryo_brand_name,
                                  item.pantryo_item_qty,
                                  item.pantryo_item_price,
                                )
                              }
                              style={styles.addBtn}>
                              <Icons
                                name="add-outline"
                                size={15}
                                color="green"
                              />
                            </Pressable>
                          ) : (
                            <Pressable
                              style={[
                                styles.addBtn,
                                {backgroundColor: 'green'},
                              ]}>
                              <Icons
                                name="checkmark-outline"
                                size={20}
                                color="white"
                              />
                            </Pressable>
                          )}
                        </View>
                      )}
                    </>
                  )}
                  keyExtractor={(item, pantryo_inventory_id) =>
                    String(pantryo_inventory_id)
                  }
                />
              ) : (
                <Text style={styles.prodName}>No Inventory Found!!</Text>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default AddProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  searchSection: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  searchBox: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#c7c7c7c7',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchTxtInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'OpenSans-Regular',
  },
  searchBtn: {
    backgroundColor: '#5E3360',
    padding: 3,
    borderRadius: 5,
  },
  catSection: {
    width: '100%',
    marginBottom: 30,
  },
  catContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#FEF9E5',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  catImg: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  catName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    flex: 1,
  },
  noticeSection: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  noticeTab: {
    borderWidth: 2.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#C6B5C7',
    borderColor: '#5E3360',
  },
  noticeTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
  prodTab: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    paddingBottom: 10,
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  productDiv: {
    flex: 3,
  },
  prodBrandName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  prodName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 22,
    flex: 1,
  },
  prodQty: {
    fontFamily: 'OpenSans-Regular',
  },
  prodTxtInput: {
    width: '30%',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    borderWidth: 0.5,
    borderColor: '#c7c7c7c7',
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'green',
    width: 50,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prodInnerRow: {
    paddingHorizontal: 20,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
