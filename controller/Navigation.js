import React from 'react';

// ===== Libraries ===== //
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from './Utils';

// ===== Screens ===== //
import HomeScreen from '../view/HomeScreen/HomeScreen';
import SettingsScreen from '../view/SettingsScreen/SettingScreen';
import InventoryScreen from '../view/Inventory/InventoryScreen';

const Tab = createMaterialBottomTabNavigator();

const Navigation = ({navigation}) => {
  const {signOut} = React.useContext(AuthContext);
  return (
    <>
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#5E3360"
        inactiveColor="#5E3360"
        backBehavior="initialRoute"
        labeled="true"
        barStyle={{backgroundColor: '#F4AA79'}}
        style={{
          backgroundColor: '#00000000',
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="home" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="InventoryScreen"
          component={InventoryScreen}
          options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="fast-food" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: '',
            tabBarColor: '#fff',
            tabBarIcon: ({color}) => (
              <Icons name="hammer" color={color} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Navigation;
