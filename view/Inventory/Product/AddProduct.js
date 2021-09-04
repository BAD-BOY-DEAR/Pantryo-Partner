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
  TouchableOpacity,
} from 'react-native';

import {produce} from 'immer';

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
import CheckBox from '@react-native-community/checkbox';

function wait(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function AddProducts({route, navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [pantryoInvetory, setPantryoInventory] = React.useState([]);
  const [mainCategoryName, setMainCategoryName] = React.useState([]);
  const [newprice, setNewPrice] = React.useState('');
  const [inventoryId, setInventoryId] = React.useState('');
  const [partnerCategoryId, setPanterCategoryId] = React.useState('');
  const [partnerMainCategoryId, setPanterMainCategoryId] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState('');
  const [partner_id, setPartnerId] = React.useState('');
  const [inventoryQty, setInventoryQty] = React.useState('');
  const [chooseInventory, setChooseInventory] = React.useState([]);

  // Checkbox
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPantryoInventory(partnerCategoryId, partnerMainCategoryId);
    wait(500).then(() => setRefreshing(false));
  }, []);

  ////set Partner Details
  async function partnerDetails() {
    setPartnerId(await AsyncStorage.getItem('partner_id'));
  }

  // =========== Toast Function =========== //
  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  //=========== API to Fetch Category according to User Type =========== //
  async function fetchPantryoInventory(partner_category, main_category_id) {
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
      // setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/getPantryoInventoryData.php',
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
          // fetchPantryoInventory(partner_category, main_category_id);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }

  // ====== Add Product ======= //
<<<<<<< HEAD
  async function addProductApi() {
=======

  const addProductApi = async () => {
>>>>>>> 0313a68122002cec2a827f5d29442d55694befde
    if (!chooseInventory) {
      showToast('Please Choose atleast one Item!');
      return;
    } else {
      setLoading(true);
      const data = new FormData();
      data.append('inventory_details', chooseInventory);
      await fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/AddPartnerInventory.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          console.log(result);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  // ====== Search Product ======= //
  async function searchInventoryProduct(searchkey) {
    let partner_id = await AsyncStorage.getItem('partner_id');
    let partner_category = await AsyncStorage.getItem('partner_category');
    if (!partner_id) {
      showToast('Product Id not Found!');
      return;
    } else if (!partnerMainCategoryId) {
      showToast('Partner Product Main Category not Found!');
      return;
    } else if (!partner_category) {
      showToast('Partner Category Not Found!');
      return;
    } else if (!searchkey) {
      fetchPantryoInventory(partner_category, partnerMainCategoryId);
    } else {
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/searchInventoryProducts.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_id: partner_id,
            partner_category_id: partner_category,
            main_category_id: partnerMainCategoryId,
            searchkey: searchkey,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            setPantryoInventory(result.PantryoInventoryData);
          } else {
            showToast(result.msg);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
<<<<<<< HEAD
  }
=======
  };
>>>>>>> 0313a68122002cec2a827f5d29442d55694befde

  const check = React.useMemo(
    () => async () => {
      // setPartnerCategoryName();
      // fetchAllProductsOfPartnerApi();
      partnerDetails();
      let {partner_category, main_category_id} = route.params;
      if (partner_category) {
        if (main_category_id) {
          setPanterCategoryId(partner_category);
          setPanterMainCategoryId(main_category_id);
          fetchPantryoInventory(partner_category, main_category_id);
        }
      }
    },
    [],
  );

  React.useEffect(() => {
    check();
    // partnerDetails();
    // let {partner_category, main_category_id} = route.params;
    // if (partner_category) {
    //   if (main_category_id) {
    //     setPanterCategoryId(partner_category);
    //     setPanterMainCategoryId(main_category_id);
    //     fetchPantryoInventory(partner_category, main_category_id);
    //   }
    // }
  }, []);

  // Set Data
  function ChooseInventoryData(newItem, i) {
    let items = pantryoInvetory;
    // console.log(!items[i].selected);
    items[i].selected = items[i].selected == true ? false : true;
    const index = chooseInventory.findIndex(
      item => item.pantryo_inventory_id === newItem.pantryo_inventory_id,
    );
    if (index !== -1) {
      // const filteredItems = chooseInventory.pop(item => item !== newItem);
      // setPantryoInventory(items);
      // setChooseInventory([...chooseInventory, filteredItems]);
    } else {
      setPantryoInventory(items);
      setChooseInventory([...chooseInventory, newItem]);
    }
    console.log(newItem);
  }

  //////////Update Checkbox
  // const updateCheckBox = (item, i) => {
  //   let items = pantryoInvetory;
  //   console.log(!items[i].selected);
  //   items[i].selected = items[i].selected == true ? false : true;
  //   setPantryoInventory(items);
  // };

  return (
    <>
      {isLoading == true ? (
        <LoaderScreen />
      ) : (
        <View style={styles.container}>
          {/* ======== Header Add Button ======== */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => addProductApi()}
              style={styles.headerBtn}>
              <Text style={styles.headerBtnTxt}>Add</Text>
            </TouchableOpacity>
          </View>
          {/* ======== Header Add Button ======== */}

          {/* ======== Search Section ======== */}
          <View style={styles.searchSection}>
            <View style={styles.searchBox}>
              <Icons name="search-outline" size={20} color="#777" />
              <TextInput
                placeholder="Search by Brand or Product"
                placeholderTextColor="#777"
                autoCapitalize="words"
                style={styles.searchTxtInput}
                onChangeText={text => searchInventoryProduct(text)}
              />
              {/* <Pressable style={styles.searchBtn}>
                <Icons name="arrow-forward-outline" size={25} color="#fff" />
              </Pressable> */}
            </View>
          </View>
          {/* ======== Search Section ======== */}

          <View
            style={{
              width: '100%',
              marginBottom: 150,
            }}>
            {pantryoInvetory !== '' ? (
              <FlatList
                ref={ref}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <>
                    {/* ======== Category Image Section ======== */}
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
                          Select all the items that you sell from your store.
                          You can also edit the price & the Qty of the items
                          accordingly
                        </Text>
                      </View>
                    </View>
                    {/* ======== Category Image Section ======== */}
                  </>
                )}
                nestedScrollEnabled={true}
                style={{width: '100%', marginBottom: 40}}
                data={pantryoInvetory}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({item, index}) => (
                  <>
                    {/* ========= Products Start ========= */}
                    <View style={styles.productContainer}>
                      <View style={styles.productRow}>
                        {/* ========= Products Details Start ========= */}
                        <Text style={styles.productBrand}>
                          {item.pantryo_brand_name
                            ? item.pantryo_brand_name
                            : ''}
                        </Text>
                        <Text style={styles.productMain}>
                          {item.pantryo_item_name
                            ? item.pantryo_item_name
                            : 'Unable to fetch product name'}
                        </Text>
                        {/* ========= Products Details End ========= */}

                        {/* ========= Products Qty/Price/Unit Start ========= */}
                        <View style={styles.productInnerRow}>
                          <TextInput
                            placeholderTextColor="#000"
                            placeholder="Quantity"
                            keyboardType="number-pad"
                            value={item.pantryo_item_qty}
                            // onChangeText={text => {
                            //   setInventoryQty(text);
                            //   setInventoryId(item.pantryo_inventory_id);
                            // }}.
                            onChangeText={e => {
                              let pantryo_item_qty = e;
                              setPantryoInventory(qty =>
                                produce(qty, v => {
                                  v[index].pantryo_item_qty = pantryo_item_qty;
                                }),
                              );
                            }}
                            style={styles.productInput}
                          />

                          <View
                            style={{
                              flex: 1,
                              borderWidth: 0.5,
                              borderColor: '#c7c7c7c7',
                            }}>
                            <Picker
                              mode="dropdown"
                              style={{
                                width: '100%',
                                justifyContent: 'flex-end',
                                textAlign: 'center',
                                color: '#000',
                              }}
                              selectedValue={item.pantryo_item_unit}
                              // onValueChange={(itemValue, itemIndex) => {
                              //   setSelectedUnit(itemValue);
                              //   setInventoryId(item.pantryo_inventory_id);
                              // }}
                              onValueChange={(itemValue, itemIndex) => {
                                let pantryo_item_unit = itemValue;
                                setPantryoInventory(qty =>
                                  produce(qty, v => {
                                    v[index].pantryo_item_unit =
                                      pantryo_item_unit;
                                  }),
                                );
                              }}>
                              <Picker.Item label="gm" value="gm" color="#fff" />
                              <Picker.Item label="kg" value="kg" color="#fff" />
                              <Picker.Item label="ml" value="ml" color="#fff" />
                              <Picker.Item
                                label="ltr"
                                value="ltr"
                                color="#fff"
                              />
                              <Picker.Item
                                label="pcs"
                                value="pcs"
                                color="#fff"
                              />
                              <Picker.Item
                                label="crate"
                                value="crate"
                                color="#fff"
                              />
                              <Picker.Item
                                label="Dozen"
                                value="Dozen"
                                color="#fff"
                              />
                            </Picker>
                          </View>

                          <TextInput
                            placeholder="₹"
                            placeholderTextColor="#777"
                            keyboardType="number-pad"
                            value={item.pantryo_item_price}
                            style={styles.productInput}
                            // onChangeText={text => {
                            //   setNewPrice(text);
                            //   setInventoryId(item.pantryo_inventory_id);
                            // }}
                            onChangeText={e => {
                              let pantryo_item_price = e;
                              setPantryoInventory(qty =>
                                produce(qty, v => {
                                  v[index].pantryo_item_price =
                                    pantryo_item_price;
                                }),
                              );
                            }}
                          />
                        </View>
                        {/* ========= Products Qty/Price/Unit End ========= */}
                      </View>

                      <View style={styles.productDiv}>
                        <CheckBox
                          disabled={false}
                          value={item.selected}
                          tintColors={{true: 'green', false: 'black'}}
                          onValueChange={() => {
                            ChooseInventoryData(
                              {
                                partner_id: partner_id,
                                partner_category_id: item.partner_category_id,
                                pantryo_main_category_id:
                                  item.pantryo_main_category_id,
                                pantryo_inventory_id: item.pantryo_inventory_id,
                                partner_product_name: item.pantryo_item_name,
                                partner_product_brand: item.pantryo_brand_name,
                                partner_product_price: item.pantryo_item_price,
                                partner_product_quantity: item.pantryo_item_qty,
                                partner_product_unit: item.pantryo_item_unit,
                              },
                              index,
                            );
                          }}
                          style={{
                            transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                            marginTop: 50,
                          }}
                        />
                      </View>
                    </View>
                    {/* ========= Products Start ========= */}
                    {/* {item.product_assign_status == 'not added' ? (
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
                                  item.pantryo_item_unit,
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
                            <View
                              style={[
                                styles.addBtn,
                                {backgroundColor: 'green'},
                              ]}>
                              <Icons
                                name="checkmark-outline"
                                size={20}
                                color="white"
                              />
                            </View>
                          )}
                        </View>

                        <View style={styles.prodInnerRow}>
                          <Text style={{flex: 1}}>Qty</Text>
                          <TextInput
                            placeholderTextColor="#000"
                            placeholder="Qty"
                            keyboardType="number-pad"
                            value={
                              item.pantryo_inventory_id === inventoryId
                                ? inventoryQty
                                : item.pantryo_item_qty !== ''
                                ? item.pantryo_item_qty
                                : 'No'
                            }
                            style={styles.prodTxtInput}
                            onChangeText={text => {
                              setInventoryQty(text);
                              setInventoryId(item.pantryo_inventory_id);
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
                                width: '80%',
                                justifyContent: 'flex-end',
                                textAlign: 'center',
                              }}
                              onValueChange={(itemValue, itemIndex) => {
                                setSelectedUnit(itemValue);
                                setInventoryId(item.pantryo_inventory_id);
                              }}>
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
                            placeholderTextColor="#777"
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
                            <Icons name="add-outline" size={15} color="green" />
                          </Pressable>
                        ) : (
                          <Pressable
                            style={[styles.addBtn, {backgroundColor: 'green'}]}>
                            <Icons
                              name="checkmark-outline"
                              size={20}
                              color="white"
                            />
                          </Pressable>
                        )}
                      </View>
                    )} */}
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
        </View>
      )}
    </>
  );
}

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
    color: '#000',
  },
  searchBtn: {
    backgroundColor: '#5E3360',
    padding: 3,
    borderRadius: 5,
  },

  catContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#FEF9E5',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  catImg: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  catName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 24,
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
    fontSize: 18,
  },
  prodTab: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    paddingBottom: 10,
    marginBottom: 20,
  },
  // productContainer: {
  //   flexDirection: 'row',
  //   width: '100%',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  //   paddingHorizontal: 20,
  //   paddingBottom: 10,
  //   marginTop: 10,
  //   marginBottom: 30,
  // },
  productDiv: {
    flex: 3,
  },
  prodBrandName: {
    fontFamily: 'OpenSans-Bold',
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
    color: '#000',
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
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  headerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    paddingVertical: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  headerBtnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  // New FlatList STyle
  productContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
    paddingVertical: 20,
  },
  productRow: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    marginRight: 15,
  },
  productBrand: {
    fontFamily: 'OpenSans-Medium',
    fontSize: 16,
  },
  productMain: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    marginBottom: 5,
  },
  productInnerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  productQty: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
  },
  productPrice: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: 'green',
  },
  productDiv: {
    marginRight: 10,
  },
  productInput: {
    borderWidth: 0.5,
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    borderColor: '#c7c7c7c7',
    color: '#000',
  },
});
