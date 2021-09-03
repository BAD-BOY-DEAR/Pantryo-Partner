import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  ToastAndroid,
  RefreshControl,
  Image,
} from 'react-native';

// ===== Images ===== //
import masala from '../../../assets//productImages/masala.png';
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
import coffeetea from '../../../assets/productImages/coffeetea.jpg';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderScreen from '../../../controller/LoaderScreen';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const CreateCategory = ({navigation}) => {
  const [allMainCategory, setAllMainCategory] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPartnerMainCategoryApi();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  ///Fetch Partner Category
  const fetchPartnerMainCategoryApi = async () => {
    let category_id = await AsyncStorage.getItem('partner_category');
    if (!category_id) {
      showToast('Partner Category Id not found!');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/getAllMainCategoryByCategoryId.php',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_category: category_id,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.error == 0) {
            setAllMainCategory(result.AllMainCategory);
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
    fetchPartnerMainCategoryApi();
  }, []);
  return (
    <>
      {isLoading == true ? (
        <LoaderScreen />
      ) : (
        <View style={styles.container}>
          {allMainCategory !== '' ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}
              data={allMainCategory}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item}) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate('AddProducts', {
                      partner_category: item.partner_category_id,
                      main_category_id: item.pantryo_main_category_id,
                    })
                  }
                  style={styles.tab}>
                  {item.pantryo_main_category_name == 'Spices & Masala' ? (
                    <Image source={masala} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Edible Oils' ? (
                    <Image source={edibleOils} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Wheat Flour' ? (
                    <Image source={attaImg} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Besan' ? (
                    <Image source={besan} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Flour' ? (
                    <Image source={flour} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Sooji' ? (
                    <Image source={sooji} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Rice Flour' ? (
                    <Image source={riceFlour} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Other Flours' ? (
                    <Image source={otherFlour} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Rice' ? (
                    <Image source={rice} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Salt & Sugar' ? (
                    <Image source={saltSugar} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Pulses & Grains' ? (
                    <Image source={pulsesGrains} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Baking Items' ? (
                    <Image source={baking} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Frozen Food' ? (
                    <Image source={frozenFood} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Packaged Products' ? (
                    <Image source={packaged} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Vegetables' ? (
                    <Image source={veg} style={styles.catImg} />
                  ) : item.pantryo_main_category_name == 'Fruits' ? (
                    <Image source={fruits} style={styles.catImg} />
                  ) : item.pantryo_main_category_name ==
                    'Coffee, Tea & Beverages' ? (
                    <Image source={coffeetea} style={styles.catImg} />
                  ) : (
                    <Icons name="image" size={40} color="#777" />
                  )}
                  <Text style={styles.tabTxt}>
                    {item.pantryo_main_category_name}
                  </Text>
                  <Icons
                    name="arrow-forward-circle"
                    color="#5E3360"
                    size={25}
                  />
                </Pressable>
              )}
              keyExtractor={(item, pantryo_main_category_id) =>
                String(pantryo_main_category_id)
              }
            />
          ) : (
            <Text style={styles.tabTxt}>No Sub Category Found!!</Text>
          )}
        </View>
      )}
    </>
  );
};

export default CreateCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  tab: {
    width: '100%',
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#000',
    flex: 1,
    marginLeft: 20,
  },
  catImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
});
