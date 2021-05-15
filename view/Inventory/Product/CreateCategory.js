import React from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';

const CreateCategory = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.topHeading}>Create Category</Text>
        <Text style={styles.caption}>
          Add products under different categories
        </Text>

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Category Name"
            autoCapitalize="words"
            style={styles.txtInput}
          />
          <View style={styles.addMoreBtn}>
            <Icons name="add-outline" size={20} color="green" />
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('AddProduct')}
          style={styles.btn}>
          <Text style={styles.btnTxt}>CREATE</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('AddProduct')}
          style={[styles.btn, {backgroundColor: '#C6B5C7'}]}>
          <Text style={styles.btnTxt}>SKIP</Text>
        </Pressable>
      </View>
    </>
  );
};

export default CreateCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
  },
  topHeading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
  },
  caption: {
    fontFamily: 'OpenSans-Regular',
  },
  formGroup: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  txtInput: {
    borderBottomWidth: 0.5,
    flex: 3,
    marginRight: 15,
    fontFamily: 'OpenSans-Regular',
    borderBottomColor: '#e0e0e0e0',
  },
  addMoreBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#5E3360',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#ffffff',
  },
});
