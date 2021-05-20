import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
///// Utils
import {AuthContext} from '../../controller/Utils';

const SettingsScreen = () => {
  const {signOut} = React.useContext(AuthContext);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.iconBox}>
            <Icons name="business-outline" size={30} color="#777" />
          </Pressable>

          <View style={styles.headerTxtContainer}>
            <Text style={styles.headerTopText}>BUSINESS NAME</Text>
            <Pressable>
              <Text style={styles.headerBottom}>Edit Business Details</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tab}>
            <Icons name="gift-outline" size={30} color="#5E3360" />
            <Text style={styles.tabTxt}>Refer & Earn</Text>
          </View>
          <View style={styles.tab}>
            <Icons name="alert-circle-outline" size={30} color="#5E3360" />
            <Text style={styles.tabTxt}>Support</Text>
          </View>
          <View style={styles.tab}>
            <Icons name="document-attach-outline" size={30} color="#5E3360" />
            <Text style={styles.tabTxt}>Terms & Conditions</Text>
          </View>
          <Pressable onPress={() => signOut()} style={styles.tab}>
            <Icons name="log-out-outline" size={30} color="#5E3360" />
            <Text style={styles.tabTxt}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7c7',
  },
  iconBox: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0e0',
    borderRadius: 5,
  },
  headerTxtContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTopText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
  },
  headerBottom: {
    fontFamily: 'OpenSans-Regular',
    color: '#5E3360',
  },
  tabContainer: {
    marginTop: 30,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  tabTxt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginLeft: 15,
  },
});
