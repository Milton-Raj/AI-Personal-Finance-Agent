import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';

export const NotificationsScreen = ({ navigation }) => {
    const notifications = [
        {
            id: '1',
            title: 'High Spending Alert',
            message: 'You have exceeded your daily budget for Food & Dining.',
            time: '2 hours ago',
            type: 'alert',
            read: false,
        },
        {
            id: '2',
            title: 'Subscription Renewal',
            message: 'Netflix subscription will renew tomorrow for ₹649.',
            time: '5 hours ago',
            type: 'info',
            read: true,
        },
        {
            id: '3',
            title: 'New Insight Available',
            message: 'We found a way to save ₹500 on your grocery bills.',
            time: '1 day ago',
            type: 'success',
            read: true,
        },
        {
            id: '4',
            title: 'Weekly Report',
            message: 'Your weekly spending report is ready to view.',
            time: '2 days ago',
            type: 'info',
            read: true,
        },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return 'warning';
            case 'success': return 'checkmark-circle';
            default: return 'information-circle';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'alert': return theme.colors.danger;
            case 'success': return theme.colors.success;
            default: return theme.colors.info;
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.scrollView}>
                    {notifications.map((item) => (
                        <GlassCard key={item.id} style={[styles.notificationCard, !item.read && styles.unreadCard]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={getIcon(item.type)} size={24} color={getColor(item.type)} />
                            </View>
                            <View style={styles.contentContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.message}>{item.message}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            {!item.read && <View style={styles.unreadDot} />}
                        </GlassCard>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
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
    scrollView: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    unreadCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    iconContainer: {
        marginRight: theme.spacing.md,
        marginTop: 2,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginBottom: 4,
    },
    message: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textMuted,
        marginBottom: 8,
        lineHeight: 20,
    },
    time: {
        fontSize: theme.typography.caption,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.accent,
        marginLeft: theme.spacing.sm,
        marginTop: 6,
    },
});
