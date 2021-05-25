import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  FlatList,
} from 'react-native';

// ===== Images ===== //
import attaImg from '../../../assets/productImages/atta.jpg';
import flour from '../../../assets/productImages/flour.jpg';
import masala from '../../../assets/productImages/masala.png';
///=======LoaderScreen=========/////
import LoaderScreen from '../../../controller/LoaderScreen';
// ===== Library ===== //
import CheckBox from '@react-native-community/checkbox';

const AddProducts = ({route, navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [pantryoInvetory, setPantryoInventory] = React.useState([]);
  const [mainCategoryName, setMainCategoryName] = React.useState([]);

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  ///Fetch Partner Category
  const fetchPantryoInventory = (partner_category, main_category_id) => {
    if (!partner_category) {
      showToast('Partner Category Id not found!');
      return;
    } else if (!main_category_id) {
      showToast('Partner Main Category Id not found!');
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

  React.useEffect(() => {
    let {partner_category, main_category_id} = route.params;
    if (partner_category) {
      if (main_category_id) {
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
          <View style={styles.catSection}>
            <View style={styles.catContainer}>
              <Image source={masala} style={styles.catImg} />
              <Text style={styles.catName}>{mainCategoryName}</Text>
            </View>
            {pantryoInvetory !== '' ? (
              <FlatList
                style={{width: '100%'}}
                data={pantryoInvetory}
                renderItem={({item}) => (
                  <View style={styles.productContainer}>
                    <View style={styles.productDiv}>
                      <Text style={styles.prodBrandName}>
                        {item.pantryo_brand_name
                          ? item.pantryo_brand_name
                          : 'no brand name'}
                      </Text>
                      <Text style={styles.prodName}>
                        {item.pantryo_item_name
                          ? item.pantryo_item_name
                          : 'item name not found!'}
                      </Text>
                      <Text style={styles.prodQty}>
                        {item.pantryo_item_qty
                          ? item.pantryo_item_qty
                          : 'no quantity'}
                      </Text>
                    </View>
                    <TextInput
                      placeholder="Price in ₹"
                      keyboardType="number-pad"
                      style={styles.prodTxtInput}
                    />
                    <CheckBox
                      disabled={false}
                      value={toggleCheckBox}
                      onValueChange={newValue => setToggleCheckBox(newValue)}
                    />
                  </View>
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
};

export default AddProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
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
    flex: 1,
    marginLeft: 20,
    fontSize: 20,
  },
  productContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomColor: '#c7c7c7c7',
    marginTop: 10,
  },
  productDiv: {
    flex: 1,
  },
  prodBrandName: {
    fontFamily: 'OpenSans-Regular',
  },
  prodName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  prodQty: {
    fontFamily: 'OpenSans-Regular',
  },
  prodPrice: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: 'green',
  },
  prodTxtInput: {
    fontFamily: 'OpenSans-Regular',
    marginRight: 15,
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
  },
});
