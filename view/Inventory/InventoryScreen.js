import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

// ===== Library ===== //
import {createStackNavigator} from '@react-navigation/stack';

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
