import React from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';

const RegistrationForm = () => {
  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={{
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.5,
            borderRadius: 5,
            borderColor: '#acacacac',
          }}>
          <Icons name="image-outline" size={30} color="#C6B5C7" />
        </Pressable>

        <Text
          style={{
            fontFamily: 'OpenSans-SemiBold',
            color: '#5E3360',
            marginTop: 5,
          }}>
          Upload Store Logo (if any)
        </Text>
      </View>
    </>
  );
};

export default RegistrationForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
