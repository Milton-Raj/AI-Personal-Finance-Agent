import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export const Card = ({ children, style, onPress, gradient = false }) => {
    const CardWrapper = onPress ? TouchableOpacity : View;

    if (gradient) {
        return (
            <CardWrapper
                style={[styles.card, style]}
                onPress={onPress}
                activeOpacity={onPress ? 0.8 : 1}
            >
                <LinearGradient
                    colors={['rgba(108, 92, 231, 0.1)', 'rgba(162, 155, 254, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientCard}
                >
                    {children}
                </LinearGradient>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper
            style={[styles.card, style]}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
        >
            {children}
        </CardWrapper>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.cardPadding,
        ...theme.shadows.medium,
    },
    gradientCard: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.cardPadding,
    },
});
