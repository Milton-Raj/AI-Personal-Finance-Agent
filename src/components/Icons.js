import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

export const MoneyBagIcon = ({ size = 64, color = '#FFD93D' }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <Path
            d="M32 8C28 8 24 10 24 14C24 14 20 16 20 20V48C20 52 24 56 32 56C40 56 44 52 44 48V20C44 16 40 14 40 14C40 10 36 8 32 8Z"
            fill={color}
        />
        <Circle cx="32" cy="32" r="8" fill="#FFA000" />
        <Path d="M32 28V36M28 32H36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export const TrendingUpIcon = ({ size = 48, color = '#10B981' }) => (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Path
            d="M8 32L18 22L26 30L40 16"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M32 16H40V24"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const CoffeeIcon = ({ size = 48, color = '#FF9F43' }) => (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Rect x="10" y="20" width="24" height="20" rx="4" fill={color} />
        <Path d="M34 24H38C40 24 42 26 42 28C42 30 40 32 38 32H34" stroke={color} strokeWidth="2" />
        <Path d="M14 12C14 12 16 8 18 8C20 8 20 12 20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M22 12C22 12 24 8 26 8C28 8 28 12 28 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export const SparkleIcon = ({ size = 24, color = '#FFD93D' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
            fill={color}
        />
        <Path
            d="M18 4L19 7L22 8L19 9L18 12L17 9L14 8L17 7L18 4Z"
            fill={color}
            opacity="0.6"
        />
    </Svg>
);

export const WalletIcon = ({ size = 32, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Rect x="4" y="8" width="24" height="18" rx="3" fill={color} opacity="0.9" />
        <Rect x="20" y="14" width="6" height="6" rx="1" fill="#5B4FD8" />
        <Circle cx="23" cy="17" r="1.5" fill={color} />
    </Svg>
);
