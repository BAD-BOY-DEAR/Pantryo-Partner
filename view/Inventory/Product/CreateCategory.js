import React from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';

const CreateCategory = ({navigation}) => {
  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Pressable
            onPress={() => navigation.navigate('AddProducts')}
            style={styles.tab}>
            <Text style={styles.tabTxt}>Fruits & Vegetables</Text>
            <Icons name="arrow-forward-circle" color="#5E3360" size={25} />
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

export default CreateCategory;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
