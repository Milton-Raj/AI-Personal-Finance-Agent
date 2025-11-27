import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export const GlassCard = ({ children, style, onPress, variant = 'default' }) => {
    const CardWrapper = onPress ? TouchableOpacity : View;

    const getCardStyle = () => {
        if (variant === 'insight') {
            return [styles.card, styles.insightCard, style];
        }
        return [styles.card, styles.glassCard, style];
    };

    return (
        <CardWrapper
            style={getCardStyle()}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
        >
            {children}
        </CardWrapper>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
    },
    glassCard: {
        backgroundColor: theme.colors.glassCard,
        borderWidth: 1,
        borderColor: theme.colors.glassCardBorder,
    },
    insightCard: {
        backgroundColor: theme.colors.insightCard,
        borderWidth: 1,
        borderColor: theme.colors.insightCardBorder,
    },
});
