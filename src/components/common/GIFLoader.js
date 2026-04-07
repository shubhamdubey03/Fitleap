import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import ReactNativeGifImage from '@lowkey/react-native-gif';

const GIFLoader = ({ visible, source }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ReactNativeGifImage
            source={typeof source === 'string' ? { uri: source } : (source || { uri: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm80eDNnMHMyOGR3b2k5eHRhZ2FsZjYxZ2tlNmE3dXBoNzJnd3c5bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/17mNCcKU1mJlrbXodo/giphy.gif' })}
            style={styles.gif}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 80,
    height: 80,
  },
});

export default GIFLoader;
