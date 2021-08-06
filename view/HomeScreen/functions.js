// ======= Show Toast ========== //
const showToast = msg => {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

export {showToast};
