import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';

const SimpleLineChart = ({ width = 150, height = 60 }) => {
  // Static path for demonstration, can be dynamic later
  const pathData = "M0 30 Q 37.5 10, 75 30 T 150 30"; 
  const pathData2 = "M0 40 Q 37.5 20, 75 40 T 150 40";

  return (
    <View style={{ width, height }}>
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={pathData}
          stroke="#00E676"
          strokeWidth="3"
          fill="none"
        />
        <Path
          d={pathData2}
          stroke="#FFD180"
          strokeWidth="3"
          fill="none"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
};

export default SimpleLineChart;
