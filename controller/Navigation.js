import React from 'react';

// ===== Libraries ===== //
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from './Utils';

// ===== Screens ===== //
import HomeScreen from '../view/HomeScreen/HomeScreen';
import SettingsScreen from '../view/SettingsScreen/SettingScreen';
import InventoryScreen from '../view/Inventory/InventoryScreen';
import WalletScreen from '../view/Wallet/WalletScreen';

const Tab = createMaterialBottomTabNavigator();

function Navigation({navigation}) {
  const {signOut} = React.useContext(AuthContext);
  return (
    <>
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#5E3360"
        inactiveColor="#5E3360"
        backBehavior="initialRoute"
        labeled="true"
        barStyle={{backgroundColor: '#FFFFFF'}}
        style={{
          backgroundColor: '#00000000',
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="home-outline" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="WalletScreen"
          component={WalletScreen}
          options={{
            tabBarLabel: 'Transactions',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="wallet-outline" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="InventoryScreen"
          component={InventoryScreen}
          options={{
            tabBarLabel: 'Inventory',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="fast-food-outline" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="hammer-outline" color={color} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default Navigation;
