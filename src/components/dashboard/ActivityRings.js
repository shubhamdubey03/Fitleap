import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const ActivityRings = ({ size = 180, rings = [] }) => {
  const center = size / 2;
  const strokeWidth = 10;
  const gap = 4;

  return (
    <View style={{ width: size, height: size }}>
      <Svg height={size} width={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {rings.map((ring, index) => {
            const radius = (size / 2) - (index * (strokeWidth + gap)) - strokeWidth;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (ring.progress / 100) * circumference;

            return (
              <React.Fragment key={index}>
                {/* Background Ring */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  opacity={0.2}
                />
                {/* Foreground Ring */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </React.Fragment>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default ActivityRings;
