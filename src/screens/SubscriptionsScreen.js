import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card } from '../components';
import { mockSubscriptions } from '../services/mockData';
import { formatCurrency } from '../utils/helpers';

export const SubscriptionsScreen = () => {
    const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active');
    const inactiveSubscriptions = mockSubscriptions.filter(sub => sub.status === 'inactive');

    const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
        if (sub.frequency === 'monthly') return sum + sub.amount;
        if (sub.frequency === 'yearly') return sum + (sub.amount / 12);
        return sum;
    }, 0);

    const formatNextBilling = (date) => {
        const now = new Date();
        const diff = date - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return 'Overdue';
        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        if (days < 7) return `In ${days} days`;
        if (days < 30) return `In ${Math.ceil(days / 7)} weeks`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>💳 Subscriptions</Text>
                <Text style={styles.headerSubtitle}>
                    {formatCurrency(totalMonthly)}/month
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <View style={styles.section}>
                    <Card gradient style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>{activeSubscriptions.length}</Text>
                                <Text style={styles.summaryLabel}>Active</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryValue}>{formatCurrency(totalMonthly)}</Text>
                                <Text style={styles.summaryLabel}>Per Month</Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Active Subscriptions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Active Subscriptions</Text>
                    {activeSubscriptions.map((subscription) => (
                        <Card key={subscription.id} style={styles.subscriptionCard}>
                            <View style={styles.subscriptionHeader}>
                                <View style={styles.subscriptionIcon}>
                                    <Ionicons name="card" size={24} color={theme.colors.primary} />
                                </View>
                                <View style={styles.subscriptionInfo}>
                                    <View style={styles.subscriptionNameRow}>
                                        <Text style={styles.subscriptionName}>{subscription.name}</Text>
                                        {subscription.priceChange && (
                                            <View style={styles.priceChangeBadge}>
                                                <Ionicons name="trending-up" size={12} color={theme.colors.danger} />
                                                <Text style={styles.priceChangeText}>
                                                    +{formatCurrency(subscription.priceChange)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.subscriptionFrequency}>
                                        {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                                    </Text>
                                    <View style={styles.nextBillingRow}>
                                        <Ionicons name="calendar" size={14} color={theme.colors.textMuted} />
                                        <Text style={styles.nextBillingText}>
                                            Next billing: {formatNextBilling(subscription.nextBilling)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.subscriptionAmount}>
                                    <Text style={styles.amountText}>
                                        {formatCurrency(subscription.amount)}
                                    </Text>
                                    <Text style={styles.amountPeriod}>
                                        /{subscription.frequency === 'monthly' ? 'mo' : 'yr'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="pencil" size={16} color={theme.colors.textSecondary} />
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                                    <Ionicons name="close-circle" size={16} color={theme.colors.danger} />
                                    <Text style={[styles.actionButtonText, { color: theme.colors.danger }]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Inactive Subscriptions */}
                {inactiveSubscriptions.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Inactive Subscriptions</Text>
                        {inactiveSubscriptions.map((subscription) => (
                            <Card key={subscription.id} style={[styles.subscriptionCard, styles.inactiveCard]}>
                                <View style={styles.subscriptionHeader}>
                                    <View style={[styles.subscriptionIcon, styles.inactiveIcon]}>
                                        <Ionicons name="card" size={24} color={theme.colors.textMuted} />
                                    </View>
                                    <View style={styles.subscriptionInfo}>
                                        <Text style={[styles.subscriptionName, styles.inactiveText]}>
                                            {subscription.name}
                                        </Text>
                                        <Text style={styles.subscriptionFrequency}>
                                            {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                                        </Text>
                                        <View style={styles.inactiveBadge}>
                                            <Ionicons name="pause-circle" size={14} color={theme.colors.warning} />
                                            <Text style={styles.inactiveBadgeText}>Not in use</Text>
                                        </View>
                                    </View>
                                    <View style={styles.subscriptionAmount}>
                                        <Text style={[styles.amountText, styles.inactiveText]}>
                                            {formatCurrency(subscription.amount)}
                                        </Text>
                                        <Text style={styles.amountPeriod}>
                                            /{subscription.frequency === 'monthly' ? 'mo' : 'yr'}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={[styles.actionButton, styles.reactivateButton]}>
                                    <Ionicons name="play-circle" size={16} color={theme.colors.success} />
                                    <Text style={[styles.actionButtonText, { color: theme.colors.success }]}>
                                        Reactivate
                                    </Text>
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Subscription Button */}
            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity style={styles.floatingButton}>
                    <Ionicons name="add" size={24} color={theme.colors.white} />
                    <Text style={styles.floatingButtonText}>Add Subscription</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: theme.typography.h3,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerSubtitle: {
        fontSize: theme.typography.h5,
        color: theme.colors.primary,
        marginTop: 4,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: theme.spacing.screenPadding,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    summaryCard: {
        marginBottom: theme.spacing.md,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: theme.typography.h3,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    summaryLabel: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: theme.colors.grayDark,
    },
    subscriptionCard: {
        marginBottom: theme.spacing.md,
    },
    subscriptionHeader: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    subscriptionIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subscriptionInfo: {
        flex: 1,
    },
    subscriptionNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    subscriptionName: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    priceChangeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: theme.colors.danger + '20',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    priceChangeText: {
        fontSize: theme.typography.tiny,
        fontWeight: '600',
        color: theme.colors.danger,
    },
    subscriptionFrequency: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    nextBillingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    nextBillingText: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
    },
    subscriptionAmount: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: theme.typography.h5,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    amountPeriod: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundLight,
    },
    cancelButton: {
        backgroundColor: theme.colors.danger + '15',
    },
    actionButtonText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    inactiveCard: {
        opacity: 0.7,
    },
    inactiveIcon: {
        backgroundColor: theme.colors.grayDark + '20',
    },
    inactiveText: {
        color: theme.colors.textMuted,
    },
    inactiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    inactiveBadgeText: {
        fontSize: theme.typography.caption,
        color: theme.colors.warning,
    },
    reactivateButton: {
        backgroundColor: theme.colors.success + '15',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: theme.spacing.lg,
        left: theme.spacing.screenPadding,
        right: theme.spacing.screenPadding,
    },
    floatingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.large,
    },
    floatingButtonText: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.white,
    },
});
