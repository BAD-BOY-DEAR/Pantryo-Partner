import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';

// ===== Library ===== //
import CheckBox from '@react-native-community/checkbox';

// ===== Images ===== //
import deliveryBoy from '../../../assets/icons/delivery.gif';

const OrderDetails = () => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.slidingCard}>
            <Text style={styles.custName}>Syed John Goswami</Text>

            <View style={styles.jobDetailsSection}>
              <View style={[styles.heading, {marginRight: 20}]}>
                <Text style={styles.headingTxt}>Product</Text>
                <Text style={styles.details}>Boneless Chicken</Text>
                <Text style={styles.details}>Rohu Fish</Text>
                <Text style={styles.details}>Curry Cuty Chicken</Text>
              </View>
              <View style={styles.heading}>
                <Text style={styles.headingTxt}>Qty</Text>
                <Text style={styles.details}>1 </Text>
                <Text style={styles.details}>1/2 </Text>
                <Text style={styles.details}>1</Text>
              </View>
              <View style={styles.heading}>
                <Text style={styles.headingTxt}>Unit</Text>
                <Text style={styles.details}>kg</Text>
                <Text style={styles.details}>kg</Text>
                <Text style={styles.details}>kg</Text>
              </View>

              <View style={styles.heading}>
                <Text style={styles.headingTxt}>Price</Text>
                <Text style={styles.details}>₹ 170</Text>
                <Text style={styles.details}>₹ 220</Text>
                <Text style={styles.details}>₹ 120</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionTwo}>
            <View style={styles.secondCard}>
              <View style={styles.secondCardDiv}>
                <Text style={styles.secondHeading}>Payment Mode</Text>
                <Text style={styles.secondCardResponse}>Online</Text>
              </View>
              <View style={styles.secondCardDiv}>
                <Text style={styles.secondHeading}>Reference No.</Text>
                <Text style={styles.secondCardResponse}>123456XHYtuuiii</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionThree}>
          <View style={styles.thirdCard}>
            <View style={styles.thirdCardRow}>
              <Text style={styles.thirdCardTxt}>Confirm Order</Text>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
            </View>
            <View style={styles.thirdCardRow}>
              <Text style={styles.thirdCardTxt}>Order Packed</Text>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
            </View>
            <View style={styles.thirdCardRow}>
              <Text style={styles.thirdCardTxt}>Order Picked Up</Text>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
            </View>
          </View>
        </View>

        <View style={styles.fourthSection}>
          <Image source={deliveryBoy} style={styles.fourthSectionImg} />
          <Text style={styles.fourthSectionTxt}>
            Pantryo Delivery Partner is on his way to deliver the order{' '}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#C6B5C7',
  },
  slidingCard: {
    width: '100%',
    backgroundColor: '#5E3360',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
  },
  custName: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 20,
    color: '#C6B5C7',
  },
  jobDetailsSection: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  heading: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  headingTxt: {
    fontFamily: 'OpenSans-Regular',
    color: '#FFFFFF',
  },
  details: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 20,
    flex: 1,
  },
  sectionTwo: {
    backgroundColor: '#FEF9E5',
    width: '100%',
  },
  secondCard: {
    backgroundColor: '#C6B5C7',
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  secondCardDiv: {
    flex: 1,
  },
  secondHeading: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#000000',
  },
  secondCardResponse: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#000000',
  },
  sectionThree: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  thirdCard: {
    width: '100%',
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#FEF9E5',
    paddingHorizontal: 20,
  },
  thirdCardRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  thirdCardTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    flex: 1,
  },
  fourthSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  fourthSectionImg: {
    width: 100,
    height: 100,
  },
  fourthSectionTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
});
