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
  ToastAndroid,
  FlatList,
} from 'react-native';

// ===== Library ===== //
import {createStackNavigator} from '@react-navigation/stack';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// // ===== Screens ===== //
// import ViewProduct from './Product/ViewProduct';
import CreateCategory from './Product/CreateCategory';
import AddProduct from './Product/AddProduct';
import LoaderScreen from '../../controller/LoaderScreen';

// ===== Images ===== //
import rawChicken from '../../assets/productImages/rawChicken.jpg';

const AllProduct = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchModal, setSearchModal] = React.useState(false);
  const [partnerCategory, setPartnerCategory] = React.useState('');
  const [inventoryCategoryDetail, setInventoryCatgoryDetail] = React.useState(
    '',
  );
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([{label: '', value: ''}]);

  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const fetchInventoryCategoryApi = async () => {
    let partner_category = await AsyncStorage.getItem('partner_category');
    if (!partner_category) {
      showToast('Partner Category  not Found!');
      return;
    } else {
      setLoading(true);
      fetch('https://gizmmoalchemy.com/api/pantryo/fetch_inventory.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_category: partner_category,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          setInventoryCatgoryDetail(result.alldata);
          setPartnerCategory(result.partner_category);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };

  React.useEffect(() => {
    fetchInventoryCategoryApi();
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      {/* <View> */}
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
          <Text style={styles.headingTwo}>{partnerCategory}</Text>
          <View style={{paddingBottom: 20}}>
            <FlatList
              style={{width: '100%'}}
              data={inventoryCategoryDetail}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => setModalVisible(true)}
                  style={styles.card}>
                  <Image source={rawChicken} style={styles.cardImg} />
                  <Text style={styles.cardProduct}>{item.item_name}</Text>
                  <Text style={styles.cardContent}>1kg - ₹120</Text>
                  <Text style={[styles.cardContent, {color: 'green'}]}>
                    In Stock
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item, id) => String(id)}
            />
          </View>
        </View>
      </View>
      {/* </View> */}

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

// ===== Components ===== //
import SelectCategory from './Product/CreateCategory';
import AddProducts from './Product/AddProduct';

const InventoryScreen = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.alert}>No Inventory Found</Text>

        <View style={styles.btnSection}>
          <Pressable
            onPress={() => navigation.navigate('SelectCategory')}
            style={styles.btn}>
            <Text style={styles.btnTxt}>Add Products</Text>
          </Pressable>
        </View>
      </View>
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
<<<<<<< HEAD
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
    // marginTop: -5,
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
=======
>>>>>>> f93c11323a053ef4202b81ff858e908a12c77694
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  alert: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  btnSection: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: '#F4AA79',
    width: '60%',
    marginTop: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
  },
});
