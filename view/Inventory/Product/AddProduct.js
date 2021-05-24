import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';

// ===== Images ===== //
import attaImg from '../../../assets/productImages/atta.jpg';
import flour from '../../../assets/productImages/flour.jpg';
import masala from '../../../assets/productImages/masala.png';

// ===== Library ===== //
import CheckBox from '@react-native-community/checkbox';

const AddProducts = () => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.catSection}>
            <View style={styles.catContainer}>
              <Image source={masala} style={styles.catImg} />
              <Text style={styles.catName}>Masale</Text>
            </View>

            <View style={styles.productContainer}>
              <View style={styles.productDiv}>
                <Text style={styles.prodBrandName}>MDH</Text>
                <Text style={styles.prodName}>Garam Masala </Text>
                <Text style={styles.prodQty}>5 Kg</Text>
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
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default AddProducts;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
