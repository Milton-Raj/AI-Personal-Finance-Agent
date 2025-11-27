import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon = null,
    style
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[`button_${size}`]];

        if (variant === 'primary') {
            return baseStyle;
        } else if (variant === 'secondary') {
            return [...baseStyle, styles.buttonSecondary];
        } else if (variant === 'outline') {
            return [...baseStyle, styles.buttonOutline];
        }
        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.text, styles[`text_${size}`]];
        if (variant === 'outline') {
            return [...baseStyle, styles.textOutline];
        }
        return baseStyle;
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                style={[getButtonStyle(), style]}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.colors.white} />
                    ) : (
                        <>
                            {icon}
                            <Text style={getTextStyle()}>{title}</Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[getButtonStyle(), style]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.white} />
            ) : (
                <>
                    {icon}
                    <Text style={getTextStyle()}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    button_small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    button_medium: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    button_large: {
        paddingVertical: 20,
        paddingHorizontal: 32,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.backgroundCard,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
        flexDirection: 'row',
    },
    text: {
        color: theme.colors.white,
        fontWeight: '600',
    },
    text_small: {
        fontSize: theme.typography.bodySmall,
    },
    text_medium: {
        fontSize: theme.typography.body,
    },
    text_large: {
        fontSize: theme.typography.h6,
    },
    textOutline: {
        color: theme.colors.primary,
    },
});
