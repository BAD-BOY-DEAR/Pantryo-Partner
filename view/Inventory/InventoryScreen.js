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
  const [partnerProducts, setPartnerProducts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  //======== Pull Down to Refresh Function ========//
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllProductsOfPartnerApi();
    wait(1000).then(() => setRefreshing(false));
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
          // console.log(result);
          if (result.error == 0) {
            setPartnerProducts(result.AllPartnerProduct);
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

  const setPartnerCategoryName = async () => {
    setPartnerCategory(await AsyncStorage.getItem('partner_category_name'));
  };

  ////========Remove Products========////
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
            showToast(result.msg);
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
  ////========Remove Products========////

  React.useEffect(() => {
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
              style={styles.searchTxtInput}
              autoCapitalize="words"
            />
            <Pressable style={styles.searchBtn}>
              <Icons name="arrow-forward-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
        {/* ========== Search Box Section ========== */}

        <FlatList
          style={{width: '100%'}}
          data={partnerProducts}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <>
              {item.Products !== null ? (
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
                </>
              ) : null}
              {/* ========== Selected Inventory Section ========== */}
              <FlatList
                style={{width: '100%'}}
                data={item.Products}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
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
                          <View style={styles.inventoryRow}>
                            <Text style={styles.qty}>
                              {item.product_qty
                                ? item.product_qty
                                : 'No Quantity'}
                            </Text>
                            <Text style={styles.price}>
                              {item.product_price
                                ? '₹' + item.product_price
                                : 'No Price'}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => removeProductApi(item.product_id)}>
                            <Text
                              style={{
                                fontFamily: 'OpenSans-Regular',
                                color: 'red',
                              }}>
                              Remove
                            </Text>
                          </Pressable>
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

              {/* ========== No Inventory Found ALert ========== */}
              {partnerProducts === null ? (
                <View style={styles.alertSection}>
                  <Text style={styles.alert}>
                    You have not selected any products
                  </Text>
                </View>
              ) : null}
              {/* ========== No Inventory Found ALert ========== */}
            </>
          )}
          keyExtractor={(item, partner_product_id) =>
            String(partner_product_id)
          }
        />
      </View>

      {/* ========== Category Modal ========== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={changeCategoryModal}
        onRequestClose={() => {
          setChangeCategoryModal(!changeCategoryModal);
        }}>
        <View style={styles.modalbackground}>
          <Animatable.View animation="zoomIn" style={styles.modalCard}>
            <ScrollView>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeader}>Change Category</Text>
                <Pressable
                  onPress={() => setChangeCategoryModal(!changeCategoryModal)}>
                  <Icons name="close-circle-outline" size={20} color="#000" />
                </Pressable>
              </View>
              <View style={styles.categoryMain}>
                <View style={styles.modalCatRow}>
                  {/* {mainCategoryName == 'Spices & Masala' ? (
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
                  )} */}

                  <Image source={masala} style={styles.modalCatRowImg} />
                  <Text style={styles.categoryTxt}>Spices & Masala</Text>
                </View>
              </View>
            </ScrollView>
          </Animatable.View>
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
});
