import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, LeakBadge } from '../components';
import { mockStats, mockLeakInsights, mockTransactions } from '../services/mockData';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../utils/helpers';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
    const leaksByCategory = mockLeakInsights.reduce((acc, leak) => {
        acc[leak.severity] = (acc[leak.severity] || 0) + 1;
        return acc;
    }, {});

    const recentTransactions = mockTransactions.slice(0, 5);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Evening 👋</Text>
                        <Text style={styles.userName}>Milton Raj</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Main Balance Card */}
                <View style={styles.balanceCard}>
                    <LinearGradient
                        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceGradient}
                    >
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Safe to Spend</Text>
                            <TouchableOpacity>
                                <Ionicons name="eye-outline" size={20} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.balanceAmount}>{formatCurrency(mockStats.safeToSpend)}</Text>
                        <Text style={styles.balanceSubtext}>
                            Out of {formatCurrency(mockStats.monthlyBudget)} monthly budget
                        </Text>

                        {/* Quick Stats */}
                        <View style={styles.quickStats}>
                            <View style={styles.statItem}>
                                <Ionicons name="trending-down" size={20} color={theme.colors.danger} />
                                <View style={styles.statText}>
                                    <Text style={styles.statValue}>{formatCurrency(mockStats.totalSpent)}</Text>
                                    <Text style={styles.statLabel}>Spent</Text>
                                </View>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Ionicons name="alert-circle" size={20} color={theme.colors.warning} />
                                <View style={styles.statText}>
                                    <Text style={styles.statValue}>{formatCurrency(mockStats.totalLeaks)}</Text>
                                    <Text style={styles.statLabel}>Leaks</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Leak Detection Summary */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🔍 Leaks Detected</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Insights')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <Card gradient style={styles.leakSummaryCard}>
                        <View style={styles.leakSummaryHeader}>
                            <View>
                                <Text style={styles.leakCount}>{mockStats.leaksDetected}</Text>
                                <Text style={styles.leakLabel}>Money Leaks Found</Text>
                            </View>
                            <View style={styles.savingsPill}>
                                <Ionicons name="trending-up" size={16} color={theme.colors.success} />
                                <Text style={styles.savingsText}>
                                    Save {formatCurrency(mockStats.potentialSavings)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.leakBadges}>
                            {leaksByCategory.high > 0 && (
                                <LeakBadge severity="high" count={leaksByCategory.high} />
                            )}
                            {leaksByCategory.medium > 0 && (
                                <LeakBadge severity="medium" count={leaksByCategory.medium} />
                            )}
                            {leaksByCategory.low > 0 && (
                                <LeakBadge severity="low" count={leaksByCategory.low} />
                            )}
                        </View>
                    </Card>
                </View>

                {/* Top Leaks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🚨 Top Leaks</Text>
                    {mockLeakInsights.slice(0, 3).map((leak) => (
                        <Card
                            key={leak.id}
                            style={styles.leakCard}
                            onPress={() => navigation.navigate('Insights')}
                        >
                            <View style={styles.leakCardHeader}>
                                <View style={[
                                    styles.leakIcon,
                                    { backgroundColor: getCategoryColor(leak.category) + '20' }
                                ]}>
                                    <Ionicons
                                        name={leak.icon}
                                        size={24}
                                        color={getCategoryColor(leak.category)}
                                    />
                                </View>
                                <View style={styles.leakCardContent}>
                                    <Text style={styles.leakTitle}>{leak.title}</Text>
                                    <Text style={styles.leakDescription}>{leak.description}</Text>
                                    <View style={styles.leakAlternative}>
                                        <Ionicons name="bulb" size={14} color={theme.colors.accent} />
                                        <Text style={styles.alternativeText}>{leak.alternative}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.leakSavings}>
                                <Text style={styles.savingsAmount}>
                                    +{formatCurrency(leak.savings)}
                                </Text>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {recentTransactions.map((transaction) => (
                        <Card key={transaction.id} style={styles.transactionCard}>
                            <View style={styles.transactionRow}>
                                <View style={[
                                    styles.transactionIcon,
                                    { backgroundColor: getCategoryColor(transaction.category) + '20' }
                                ]}>
                                    <Ionicons
                                        name={getCategoryIcon(transaction.category)}
                                        size={20}
                                        color={getCategoryColor(transaction.category)}
                                    />
                                </View>
                                <View style={styles.transactionDetails}>
                                    <Text style={styles.merchantName}>{transaction.merchant}</Text>
                                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                                </View>
                                <View style={styles.transactionAmount}>
                                    <Text style={[
                                        styles.amountText,
                                        { color: transaction.type === 'credit' ? theme.colors.success : theme.colors.text }
                                    ]}>
                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </Text>
                                    {transaction.isLeak && (
                                        <View style={styles.leakIndicator}>
                                            <Ionicons name="warning" size={12} color={theme.colors.warning} />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.md,
    },
    greeting: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
    },
    userName: {
        fontSize: theme.typography.h3,
        color: theme.colors.text,
        fontWeight: 'bold',
        marginTop: 4,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.danger,
    },
    balanceCard: {
        marginHorizontal: theme.spacing.screenPadding,
        marginVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.large,
    },
    balanceGradient: {
        padding: theme.spacing.lg,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.white,
        opacity: 0.9,
    },
    balanceAmount: {
        fontSize: 42,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginTop: theme.spacing.sm,
    },
    balanceSubtext: {
        fontSize: theme.typography.caption,
        color: theme.colors.white,
        opacity: 0.8,
        marginTop: theme.spacing.xs,
    },
    quickStats: {
        flexDirection: 'row',
        marginTop: theme.spacing.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: theme.spacing.md,
    },
    statText: {
        flex: 1,
    },
    statValue: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.white,
    },
    statLabel: {
        fontSize: theme.typography.caption,
        color: theme.colors.white,
        opacity: 0.8,
    },
    section: {
        paddingHorizontal: theme.spacing.screenPadding,
        marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.h5,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    seeAll: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    leakSummaryCard: {
        marginBottom: theme.spacing.md,
    },
    leakSummaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    leakCount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    leakLabel: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    savingsPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.success + '20',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.round,
        gap: 6,
    },
    savingsText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.success,
    },
    leakBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    leakCard: {
        marginBottom: theme.spacing.md,
    },
    leakCardHeader: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    leakIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leakCardContent: {
        flex: 1,
    },
    leakTitle: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    leakDescription: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    leakAlternative: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: theme.spacing.sm,
        backgroundColor: theme.colors.accent + '10',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    alternativeText: {
        fontSize: theme.typography.caption,
        color: theme.colors.accent,
        flex: 1,
    },
    leakSavings: {
        marginTop: theme.spacing.sm,
        alignItems: 'flex-end',
    },
    savingsAmount: {
        fontSize: theme.typography.h5,
        fontWeight: 'bold',
        color: theme.colors.success,
    },
    transactionCard: {
        marginBottom: theme.spacing.sm,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionDetails: {
        flex: 1,
    },
    merchantName: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    transactionDate: {
        fontSize: theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: theme.typography.body,
        fontWeight: '600',
    },
    leakIndicator: {
        marginTop: 4,
    },
});
