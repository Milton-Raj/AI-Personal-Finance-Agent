import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const LeakBadge = ({ severity, count }) => {
    const getColor = () => {
        switch (severity) {
            case 'high':
                return theme.colors.leakHigh;
            case 'medium':
                return theme.colors.leakMedium;
            case 'low':
                return theme.colors.leakLow;
            default:
                return theme.colors.gray;
        }
    };

    const getIcon = () => {
        switch (severity) {
            case 'high':
                return 'alert-circle';
            case 'medium':
                return 'warning';
            case 'low':
                return 'information-circle';
            default:
                return 'checkmark-circle';
        }
    };

    return (
        <View style={[styles.badge, { backgroundColor: getColor() + '20' }]}>
            <Ionicons name={getIcon()} size={16} color={getColor()} />
            <Text style={[styles.badgeText, { color: getColor() }]}>
                {count} {severity} leak{count !== 1 ? 's' : ''}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.round,
        gap: 6,
    },
    badgeText: {
        fontSize: theme.typography.caption,
        fontWeight: '600',
    },
});
