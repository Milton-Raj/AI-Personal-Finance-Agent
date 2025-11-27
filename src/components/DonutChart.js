import React from 'react';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

export const DonutChart = ({ data, size = 200, strokeWidth = 40 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const center = size / 2;

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Calculate segments
    let currentAngle = -90; // Start from top
    const segments = data.map((item) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const segment = {
            ...item,
            percentage,
            startAngle: currentAngle,
            endAngle: currentAngle + angle,
            strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
            strokeDashoffset: -(currentAngle / 360) * circumference,
        };
        currentAngle += angle;
        return segment;
    });

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation={0} origin={`${center}, ${center}`}>
                    {segments.map((segment, index) => (
                        <Circle
                            key={index}
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.strokeDashoffset}
                            strokeLinecap="round"
                        />
                    ))}
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
