import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SafeProgressCircle = ({
//   percent = 0,
  radius = 40,
  borderWidth = 6,
  color = '#2ECC71',
  bgColor = '#fff',
  children,
}) => {
  const size = radius * 2;
  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth,
          borderColor: color,
          backgroundColor: bgColor,
        },
      ]}
    >
      <View style={styles.inner}>{children}</View>
      {/* <View style={styles.percentBadge} pointerEvents="none">
        <Text style={styles.percentText}>{Math.round(percent)}%</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  inner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  percentText: {
    fontSize: 10,
    color: '#333',
  },
});

export default SafeProgressCircle;
