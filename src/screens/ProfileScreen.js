import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { paymentService } from '../services/paymentService';

export const ProfileScreen = ({ navigation }) => {
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const status = await paymentService.getPremiumStatus();
            setIsPremium(status.is_premium);
        } catch (error) {
            console.log('Failed to check premium status');
        }
    };

    const user = {
        name: 'Milton Raj',
        email: 'milton.raj@example.com',
        phone: '+91 98765 43210',
        memberSince: 'January 2024',
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', route: 'EditProfile' },
        { icon: 'document-text-outline', label: 'Personal Information', route: 'PersonalInformation' },
        { icon: 'card-outline', label: 'Payment Methods', route: 'PaymentMethods' },
        { icon: 'settings-outline', label: 'Settings', route: 'Settings' },
        { icon: 'help-circle-outline', label: 'Help & Support', route: 'HelpSupport' },
        { icon: 'log-out-outline', label: 'Log Out', color: theme.colors.danger },
    ];

    const handleMenuPress = (item) => {
        if (item.route) {
            navigation.navigate(item.route);
        }
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
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <ScrollView style={styles.content}>
                    <GlassCard style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={48} color={theme.colors.white} />
                            </View>
                            {isPremium && (
                                <View style={styles.premiumBadge}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                </View>
                            )}
                        </View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        {isPremium && (
                            <View style={styles.premiumTag}>
                                <Ionicons name="crown" size={14} color="#FFD700" />
                                <Text style={styles.premiumText}>Premium Member</Text>
                            </View>
                        )}
                    </GlassCard>

                    <GlassCard style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color={theme.colors.textMuted} />
                            <Text style={styles.infoText}>{user.phone}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
                            <Text style={styles.infoText}>Member since {user.memberSince}</Text>
                        </View>
                    </GlassCard>

                    <View style={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => handleMenuPress(item)}
                            >
                                <View style={styles.menuLeft}>
                                    <Ionicons
                                        name={item.icon}
                                        size={24}
                                        color={item.color || theme.colors.white}
                                    />
                                    <Text style={[styles.menuLabel, item.color && { color: item.color }]}>
                                        {item.label}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                        ))}
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
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    profileCard: {
        alignItems: 'center',
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    premiumBadge: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: '#000',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    premiumTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#FFD700',
        gap: 6,
    },
    premiumText: {
        color: '#FFD700',
        fontSize: theme.typography.caption,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: theme.typography.body,
        color: theme.colors.textMuted,
    },
    infoCard: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    infoText: {
        fontSize: theme.typography.body,
        color: theme.colors.white,
    },
    menuContainer: {
        marginBottom: theme.spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    menuLabel: {
        fontSize: theme.typography.body,
        color: theme.colors.white,
        fontWeight: '500',
    },
});
