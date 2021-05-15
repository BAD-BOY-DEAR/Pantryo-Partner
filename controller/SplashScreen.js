import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';

// ====== Images ====== //
import brandLogo from '../assets/logo/PantryoPartnerLogo.png';
import flag from '../assets/icons/indianFlag.png';

const SplashScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <Image source={brandLogo} style={styles.logo} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.caption}>
          Made in <Image source={flag} style={styles.captionIcon} />
        </Text>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  caption: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  captionIcon: {
    width: 30,
    height: 30,
  },
});
