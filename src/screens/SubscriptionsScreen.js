import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { mockSubscriptions } from '../services/mockData';
import { formatDate } from '../utils/helpers';

export const SubscriptionsScreen = ({ navigation }) => {
    const activeSubscriptions = mockSubscriptions.filter((sub) => sub.status === 'active');
    const inactiveSubscriptions = mockSubscriptions.filter((sub) => sub.status === 'inactive');

    const totalMonthlySpend = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    const getSubscriptionIcon = (name) => {
        const icons = {
            Netflix: 'tv',
            Spotify: 'musical-notes',
            'Amazon Prime': 'cart',
            'YouTube Premium': 'logo-youtube',
            'Apple Music': 'musical-note',
        };
        return icons[name] || 'card';
    };

    const getSubscriptionColor = (name) => {
        const colors = {
            Netflix: '#E50914',
            Spotify: '#1DB954',
            'Amazon Prime': '#FF9900',
            'YouTube Premium': '#FF0000',
            'Apple Music': '#FA243C',
        };
        return colors[name] || theme.colors.primary;
    };

    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { flex: 1 }]}>Subscriptions</Text>
                    <TouchableOpacity>
                        <Ionicons name="add-circle" size={28} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Summary Card */}
                <View style={styles.summaryContainer}>
                    <GlassCard style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Monthly Spend</Text>
                                <Text style={styles.summaryAmount}>₹{totalMonthlySpend}</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Active</Text>
                                <Text style={styles.summaryCount}>{activeSubscriptions.length}</Text>
                            </View>
                        </View>
                    </GlassCard>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Active Subscriptions */}
                    <Text style={styles.sectionTitle}>Active Subscriptions</Text>
                    {activeSubscriptions.map((subscription) => (
                        <GlassCard key={subscription.id} style={styles.subscriptionCard}>
                            <View style={styles.subscriptionHeader}>
                                <View style={styles.subscriptionLeft}>
                                    <View
                                        style={[
                                            styles.subscriptionIcon,
                                            { backgroundColor: getSubscriptionColor(subscription.name) },
                                        ]}
                                    >
                                        <Ionicons
                                            name={getSubscriptionIcon(subscription.name)}
                                            size={24}
                                            color={theme.colors.white}
                                        />
                                    </View>
                                    <View style={styles.subscriptionInfo}>
                                        <Text style={styles.subscriptionName}>{subscription.name}</Text>
                                        <Text style={styles.subscriptionFrequency}>
                                            {subscription.frequency} • Next: {formatDate(subscription.nextBilling)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.subscriptionRight}>
                                    <Text style={styles.subscriptionAmount}>₹{subscription.amount}</Text>
                                    {subscription.priceChange && (
                                        <View style={styles.priceChangeBadge}>
                                            <Ionicons
                                                name="trending-up"
                                                size={12}
                                                color={theme.colors.danger}
                                            />
                                            <Text style={styles.priceChangeText}>
                                                +₹{subscription.priceChange}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.editButton}>
                                    <Ionicons name="create-outline" size={16} color={theme.colors.white} />
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton}>
                                    <Ionicons name="close-circle-outline" size={16} color={theme.colors.danger} />
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))}

                    {/* Inactive Subscriptions */}
                    {inactiveSubscriptions.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Inactive Subscriptions</Text>
                            {inactiveSubscriptions.map((subscription) => (
                                <GlassCard key={subscription.id} style={styles.inactiveCard}>
                                    <View style={styles.subscriptionHeader}>
                                        <View style={styles.subscriptionLeft}>
                                            <View
                                                style={[
                                                    styles.subscriptionIcon,
                                                    styles.inactiveIcon,
                                                ]}
                                            >
                                                <Ionicons
                                                    name={getSubscriptionIcon(subscription.name)}
                                                    size={24}
                                                    color="rgba(255, 255, 255, 0.5)"
                                                />
                                            </View>
                                            <View style={styles.subscriptionInfo}>
                                                <Text style={styles.inactiveName}>{subscription.name}</Text>
                                                <Text style={styles.inactiveText}>Cancelled</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.reactivateButton}>
                                            <Text style={styles.reactivateText}>Reactivate</Text>
                                        </TouchableOpacity>
                                    </View>
                                </GlassCard>
                            ))}
                        </>
                    )}

                    <View style={{ height: 100 }} />
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
        fontWeight: '800',
        color: theme.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    summaryContainer: {
        paddingHorizontal: theme.spacing.screenPadding,
        marginBottom: theme.spacing.lg,
    },
    summaryCard: {
        paddingVertical: theme.spacing.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    summaryLabel: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: '900',
        color: theme.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    summaryCount: {
        fontSize: 32,
        fontWeight: '900',
        color: theme.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: theme.spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subscriptionCard: {
        marginBottom: theme.spacing.md,
    },
    subscriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    subscriptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.md,
    },
    subscriptionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subscriptionInfo: {
        flex: 1,
    },
    subscriptionName: {
        fontSize: theme.typography.body,
        fontWeight: '700',
        color: theme.colors.white,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subscriptionFrequency: {
        fontSize: theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.textMuted,
    },
    subscriptionRight: {
        alignItems: 'flex-end',
    },
    subscriptionAmount: {
        fontSize: theme.typography.h6,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    priceChangeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        gap: 4,
    },
    priceChangeText: {
        fontSize: theme.typography.tiny,
        fontWeight: '700',
        color: theme.colors.danger,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 10,
        borderRadius: theme.borderRadius.md,
        gap: 6,
    },
    editButtonText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '700',
        color: theme.colors.white,
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Light red background
        borderWidth: 1,
        borderColor: theme.colors.danger,
        gap: 6,
    },
    cancelButtonText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '700',
        color: '#FF8A8A', // Brighter red/pink for better contrast on dark
    },
    inactiveCard: {
        marginBottom: theme.spacing.md,
        opacity: 0.7,
    },
    inactiveIcon: {
        backgroundColor: 'rgba(75, 60, 150, 0.5)',
    },
    inactiveName: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 4,
    },
    inactiveText: {
        fontSize: theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.textMuted,
    },
    reactivateButton: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.md,
    },
    reactivateText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '700',
        color: theme.colors.white,
    },
});
