import React, {PureComponent} from 'react';
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
  Dimensions,
  StatusBar,
  LogBox,
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
class FetchInventory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      partnerProducts: '',
      partnerMainCategory: '',
      changeCategoryModal: false,
      editModal: false,
      isLoading: true,
      refreshing: false,
      partnerItemId: '',
      partnerItemBrand: '',
      partnerItemName: '',
      partnerItemQty: '',
      partnerItemPrice: '',
      partnerItemUnit: '',
    };
  }
  ////////////////////
  showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  /////////////////fetchAllProductsOfPartnerApi
  fetchAllProductsOfPartnerApi = async () => {
    const partner_id = await AsyncStorage.getItem('partner_id');
    // console.log(partner_id);
    const partner_category = await AsyncStorage.getItem('partner_category');
    if (!partner_id) {
      showToast('Partner ID not found!');
      return;
    } else if (!partner_category) {
      showToast('Partner Category not found!');
      return;
    } else {
      const that = this;
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/getProductOfPartner.php',
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
            that.setState({
              partnerProducts: result.AllPartnerProduct,
              partnerMainCategory: result.MainCategory,
            });
          } else {
            showToast('Something went Wrong!');
          }
          that.fetchAllProductsOfPartnerApi();
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => that.setState({isLoading: false}));
    }
  };

  componentDidMount() {
    LogBox.ignoreLogs(['Warning: ...']); //Hide warnings
    LogBox.ignoreAllLogs(); //Hide all warning notifications on front-end
    this.fetchAllProductsOfPartnerApi();
  }

  componentWillUnmount() {
    this.fetchAllProductsOfPartnerApi();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={{width: '100%', flex: 1}}
          data={this.state.partnerProducts}
          initialNumToRender={10}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
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
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                renderItem={({item, index}) => (
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
                            // onPress={() => removeProductApi(item.product_id)}
                            >
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
                                // setPartnerItemBrand(item.product_brand);
                                // setPartnerItemId(item.product_id);
                                // setPartnerItemName(item.product_name);
                                // setPartnerItemQty(item.product_qty);
                                // setPartnerItemPrice(item.product_price);
                                // setPartnerItemUnit(item.product_unit);
                                // setEditModal(true);
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
                              : 'No Quantity'}
                            {' ' + item.product_unit}
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
                            thumbColor={
                              item.product_status == 'In Stock'
                                ? 'green'
                                : 'red'
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {
                              // InOutStock(item.product_id, item.product_status);
                            }}
                            value={
                              item.product_status == 'In Stock' ? true : false
                            }
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
      </View>
    );
  }
}

export default FetchInventory;

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
    paddingHorizontal: 40,
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
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
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
    marginLeft: 10,
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
    marginBottom: 10,
    marginTop: 20,
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
