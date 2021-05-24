import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateCategory = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate('AddProducts')}
          style={styles.tab}>
          <Text style={styles.tabTxt}>Fruits & Vegetables</Text>
          <Icons name="arrow-forward-circle" color="#5E3360" size={25} />
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
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tab: {
    width: '100%',
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
    flex: 1,
  },
});
