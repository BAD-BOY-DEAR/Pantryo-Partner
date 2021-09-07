import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const TermsConditions = () => {
  return (
    <>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          {/* ====== TERMS START ====== */}
          <View style={styles.div}>
            <Text style={styles.heading}>Privacy Policy</Text>
            <Text style={styles.para}>
              Please ensure that this Privacy Policy is perused by You before
              availing any services from Us. This Privacy Policy shall be
              updated from time to time and to stay abreast with our methods of
              using Your information and protecting Your privacy, please keep
              reviewing this Policy.
            </Text>
          </View>
          {/* ====== TERMS END ====== */}

          {/* ====== Pantryo Platform Access END ====== */}
        </View>
      </ScrollView>
    </>
  );
};

export default TermsConditions;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  div: {
    width: '100%',
    marginBottom: 10,
  },
  heading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#5E3360',
    marginBottom: 5,
  },
  para: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'justify',
  },
  mainPoint: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    textAlign: 'justify',
  },
  subPoint: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },
});
