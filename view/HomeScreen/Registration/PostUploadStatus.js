import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

// ========== Image ========== //
import successIcon from '../../../assets/icons/success.gif';

// ========== Library ========== //
import * as Animatable from 'react-native-animatable';

function PostUploadStatus() {
  return (
    <>
      <View style={styles.container}>
        <Animatable.Image
          animation="rubberBand"
          source={successIcon}
          style={styles.gifIcon}
        />
        <Animatable.Text animation="fadeInUp" delay={500} style={styles.status}>
          Success!
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={2000} style={styles.label}>
          Documents Under Verification
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          delay={3000}
          style={styles.caption}>
          Verification of your documents will take 12 - 24Hrs.
        </Animatable.Text>
      </View>
    </>
  );
}

export default PostUploadStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  gifIcon: {
    width: 100,
    height: 100,
  },
  status: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 30,
    color: 'green',
  },
  label: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
  },
  caption: {
    fontFamily: 'OpenSans-Regular',
  },
});
