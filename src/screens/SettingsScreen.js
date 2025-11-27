import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const SettingsScreen = ({ navigation }) => {
    const [biometrics, setBiometrics] = useState(false);
    const [biometricType, setBiometricType] = useState(null); // 'fingerprint', 'face', or null

    useEffect(() => {
        checkBiometrics();
        loadSettings();
    }, []);

    const checkBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (hasHardware) {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setBiometricType('face');
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometricType('fingerprint');
            } else {
                setBiometricType('other');
            }
        }
    };

    const loadSettings = async () => {
        try {
            const profile = await profileService.getProfile();
            setBiometrics(profile.biometric_enabled || false);
        } catch (error) {
            console.log('Failed to load settings');
        }
    };

    const toggleBiometrics = async (value) => {
        if (value) {
            // Verify identity before enabling
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable biometric login',
            });
            if (!result.success) {
                Alert.alert('Authentication Failed', 'Could not enable biometrics');
                return;
            }
        }

        setBiometrics(value);
        try {
            await profileService.updateProfile({ biometric_enabled: value });
        } catch (error) {
            Alert.alert('Error', 'Failed to save setting');
            setBiometrics(!value);
        }
    };

    const SettingItem = ({ icon, label, onPress, type = 'link', value, onValueChange }) => (
        <GlassCard style={styles.settingCard}>
            <TouchableOpacity
                style={styles.settingRow}
                onPress={type === 'link' ? onPress : null}
                disabled={type === 'switch'}
            >
                <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={20} color={theme.colors.white} />
                    </View>
                    <Text style={styles.settingLabel}>{label}</Text>
                </View>
                {type === 'switch' ? (
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
                        trackColor={{ false: '#767577', true: theme.colors.primary }}
                        thumbColor={value ? theme.colors.white : '#f4f3f4'}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                )}
            </TouchableOpacity>
        </GlassCard>
    );

    const getBiometricIcon = () => {
        if (biometricType === 'face') return 'scan-outline';
        if (biometricType === 'fingerprint') return 'finger-print-outline';
        return 'finger-print-outline';
    };

    const getBiometricLabel = () => {
        if (biometricType === 'face') return 'Face ID Login';
        if (biometricType === 'fingerprint') return 'Fingerprint Login';
        return 'Biometric Login';
    };

    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    {biometricType && (
                        <SettingItem
                            icon={getBiometricIcon()}
                            label={getBiometricLabel()}
                            value={biometrics}
                            onValueChange={toggleBiometrics}
                            type="switch"
                        />
                    )}
                    <SettingItem
                        icon="lock-closed-outline"
                        label="Change Password"
                        onPress={() => navigation.navigate('ChangePassword')}
                    />

                    <Text style={styles.sectionTitle}>About</Text>
                    <SettingItem
                        icon="document-text-outline"
                        label="Terms of Service"
                        onPress={() => navigation.navigate('Legal', {
                            title: 'Terms of Service',
                            content: 'These are the terms of service. By using this app, you agree to...'
                        })}
                    />
                    <SettingItem
                        icon="shield-checkmark-outline"
                        label="Privacy Policy"
                        onPress={() => navigation.navigate('Legal', {
                            title: 'Privacy Policy',
                            content: 'Your privacy is important to us. We collect data to improve...'
                        })}
                    />

                    <View style={styles.versionContainer}>
                        <Text style={styles.versionText}>App Version 1.0.0</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    content: {
        flex: 1,
        padding: theme.spacing.screenPadding,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: '600',
        color: theme.colors.white,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    settingCard: {
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingLabel: {
        color: theme.colors.white,
        fontSize: theme.typography.body,
        fontWeight: '500',
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    versionText: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
    },
});
