import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard, DonutChart } from '../components';
import { MoneyBagIcon, TrendingUpIcon, CoffeeIcon, SparkleIcon, WalletIcon } from '../components/Icons';
import { mockStats, mockLeakInsights, mockTransactions, mockSubscriptions } from '../services/mockData';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/helpers';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
    // Chart data
    const chartData = [
        { label: 'Shopping', value: 11307, color: theme.colors.chartCyan, percentage: 25 },
        { label: 'Subscriptions', value: 13569, color: theme.colors.chartBlue, percentage: 30 },
        { label: 'Food', value: 20353, color: theme.colors.chartPurple, percentage: 45 },
    ];

    const recentTransactions = mockTransactions.slice(0, 2);
    const topSubscriptions = mockSubscriptions.slice(0, 3);

    // Auto-scroll logic for AI Insights
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= mockLeakInsights.length) {
                nextIndex = 0;
            }
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }, 4000); // Scroll every 4 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderInsightItem = ({ item }) => (
        <GlassCard variant="insight" style={styles.insightCardSmall}>
            <View style={styles.insightContent}>
                <View style={styles.insightLeft}>
                    <View style={styles.insightIconContainer}>
                        <Ionicons name={item.icon || 'bulb'} size={24} color={theme.colors.accent} />
                    </View>
                    <View style={styles.insightTextContainer}>
                        <Text style={styles.insightTitleSmall} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.insightSubtitleSmall} numberOfLines={1}>{item.description}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.seeHowButtonSmall}>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.insightText} />
                </TouchableOpacity>
            </View>
        </GlassCard>
    );

    const [coinModalVisible, setCoinModalVisible] = useState(false);

    // ... existing code ...

    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header Actions Row */}
                <View style={styles.header}>
                    {/* Left: AI Insights */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Insights')}
                    >
                        <Ionicons name="bulb" size={24} color={theme.colors.accent} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    {/* Right: Coins, Wallet, Notifications */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.balanceChip}
                            onPress={() => setCoinModalVisible(true)}
                        >
                            <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
                            <Text style={styles.balanceText}>2k+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.balanceChip}
                            onPress={() => navigation.navigate('Wallet')}
                        >
                            <Ionicons name="wallet" size={20} color={theme.colors.white} />
                            <Text style={styles.balanceText}>12k+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.notificationButton}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Ionicons name="notifications" size={24} color={theme.colors.white} />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Coin Details Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={coinModalVisible}
                    onRequestClose={() => setCoinModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Your Coins</Text>
                                <TouchableOpacity onPress={() => setCoinModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={theme.colors.textDark} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.coinBalanceContainer}>
                                <Ionicons name="logo-bitcoin" size={48} color="#FFD700" />
                                <Text style={styles.coinBalanceText}>2,450</Text>
                                <Text style={styles.coinSubtitle}>Total Vib Coins</Text>
                            </View>

                            <View style={styles.coinInfoSection}>
                                <Text style={[styles.sectionTitle, { color: '#000' }]}>How to earn?</Text>
                                <View style={styles.infoRow}>
                                    <Ionicons name="scan" size={20} color={theme.colors.primary} />
                                    <Text style={styles.infoText}>Scan receipts (+10 coins)</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Ionicons name="wallet" size={20} color={theme.colors.primary} />
                                    <Text style={styles.infoText}>Add Money to the wallet (+30 coins)</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.redeemButton}
                                onPress={() => {
                                    setCoinModalVisible(false);
                                    navigation.navigate('Shop');
                                }}
                            >
                                <Text style={styles.redeemButtonText}>Redeem in Shop</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Greeting */}
                <Text style={styles.greeting}>Good morning, Milton! 👋</Text>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Total Expense Card */}
                    <GlassCard style={styles.monthCard}>
                        <View style={styles.monthCardHeader}>
                            <View style={styles.monthCardLeft}>
                                <Text style={styles.monthLabel}>Total Expense</Text>
                                <Text style={styles.monthAmount}>₹45,230</Text>
                                <View style={styles.percentageBadge}>
                                    <Ionicons name="arrow-down" size={12} color={theme.colors.success} />
                                    <Text style={styles.percentageText}>12%</Text>
                                    <Text style={styles.percentageLabel}>vs last month</Text>
                                </View>
                            </View>
                            <View style={styles.monthCardIcon}>
                                <MoneyBagIcon size={64} color="#FFD93D" />
                            </View>
                        </View>
                    </GlassCard>

                    {/* AI Insights Carousel */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>AI Insights</Text>
                        <SparkleIcon size={20} color="#FFD93D" />
                    </View>
                    <View style={styles.carouselContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={mockLeakInsights}
                            renderItem={renderInsightItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            snapToInterval={width - 40} // Adjust based on card width + margin
                            onMomentumScrollEnd={(event) => {
                                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
                                setCurrentIndex(index);
                            }}
                        />
                        {/* Pagination Dots */}
                        <View style={styles.paginationDots}>
                            {mockLeakInsights.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentIndex === index && styles.activeDot,
                                    ]}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Spending by Category */}
                    <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Spending by Category</Text>
                    <GlassCard style={styles.chartCard}>
                        <View style={styles.chartContainer}>
                            {/* Chart */}
                            <View style={styles.chartWrapper}>
                                <DonutChart data={chartData} size={180} strokeWidth={35} />
                                <View style={styles.chartCenter}>
                                    <Ionicons name="wallet" size={32} color={theme.colors.white} />
                                    <Text style={styles.chartCenterText}>Spending</Text>
                                </View>
                            </View>

                            {/* Legend */}
                            <View style={styles.legend}>
                                {chartData.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <View style={styles.legendTextContainer}>
                                            <Text style={styles.legendLabel}>{item.label} {item.percentage}%</Text>
                                            <Text style={styles.legendValue}>₹{item.value.toLocaleString('en-IN')}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </GlassCard>

                    {/* Recent Transactions */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <GlassCard style={styles.transactionsCard}>
                        {recentTransactions.map((transaction, index) => (
                            <View key={transaction.id}>
                                <TouchableOpacity style={styles.transactionItem}>
                                    <View style={styles.transactionLeft}>
                                        <View style={[
                                            styles.appIconContainer,
                                            { backgroundColor: transaction.merchant === 'Swiggy' ? '#FC8019' : (transaction.merchant === 'Uber' ? '#000000' : '#1DB954') }
                                        ]}>
                                            <Ionicons
                                                name={transaction.merchant === 'Swiggy' ? 'fast-food' : (transaction.merchant === 'Uber' ? 'car' : 'musical-notes')}
                                                size={24}
                                                color={theme.colors.white}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.transactionName}>{transaction.merchant}</Text>
                                            <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transactionRight}>
                                        <Text style={styles.transactionAmount}>₹{transaction.amount}</Text>
                                        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                                    </View>
                                </TouchableOpacity>
                                {index < recentTransactions.length - 1 && <View style={styles.transactionDivider} />}
                            </View>
                        ))}
                    </GlassCard>

                    {/* Subscriptions Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Subscriptions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Subs')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <GlassCard style={styles.transactionsCard}>
                        {topSubscriptions.map((sub, index) => (
                            <View key={sub.id}>
                                <TouchableOpacity style={styles.transactionItem}>
                                    <View style={styles.transactionLeft}>
                                        <View style={[
                                            styles.appIconContainer,
                                            { backgroundColor: sub.name === 'Netflix' ? '#E50914' : (sub.name === 'Spotify' ? '#1DB954' : '#FF9900') }
                                        ]}>
                                            <Ionicons
                                                name={sub.name === 'Netflix' ? 'tv' : (sub.name === 'Spotify' ? 'musical-notes' : 'cart')}
                                                size={24}
                                                color={theme.colors.white}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.transactionName}>{sub.name}</Text>
                                            <Text style={styles.transactionDate}>{sub.frequency}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transactionRight}>
                                        <Text style={styles.transactionAmount}>₹{sub.amount}</Text>
                                        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                                    </View>
                                </TouchableOpacity>
                                {index < topSubscriptions.length - 1 && <View style={styles.transactionDivider} />}
                            </View>
                        ))}
                    </GlassCard>

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
    menuButton: {
        width: 40,
    },
    appName: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    notificationButton: {
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.danger,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    balanceText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: theme.typography.bodySmall,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: theme.spacing.xl,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    modalTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.textDark,
    },
    coinBalanceContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.xl,
        backgroundColor: '#FFF9C4',
        borderRadius: theme.borderRadius.lg,
    },
    coinBalanceText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginVertical: theme.spacing.sm,
    },
    coinSubtitle: {
        fontSize: theme.typography.body,
        color: theme.colors.textMuted,
    },
    coinInfoSection: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    infoText: {
        fontSize: theme.typography.body,
        color: theme.colors.textDark,
    },
    redeemButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
    },
    redeemButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
    greeting: {
        fontSize: theme.typography.h5,
        fontWeight: '700',
        color: theme.colors.white,
        paddingHorizontal: theme.spacing.screenPadding,
        marginBottom: theme.spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    monthCard: {
        marginBottom: theme.spacing.lg,
        backgroundColor: 'rgba(75, 60, 150, 0.7)',
        paddingVertical: theme.spacing.lg,
    },
    monthCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthCardLeft: {
        flex: 1,
    },
    monthCardIcon: {
        marginLeft: theme.spacing.md,
    },
    monthLabel: {
        fontSize: theme.typography.body,
        color: theme.colors.white,
        marginBottom: theme.spacing.xs,
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    monthAmount: {
        fontSize: 48,
        fontWeight: '900',
        color: theme.colors.white,
        marginBottom: theme.spacing.sm,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
    },
    percentageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.successBadge,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.round,
        alignSelf: 'flex-start',
        gap: 4,
    },
    percentageText: {
        fontSize: theme.typography.caption,
        fontWeight: 'bold',
        color: theme.colors.success,
    },
    percentageLabel: {
        fontSize: theme.typography.caption,
        color: theme.colors.textDark,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
        marginTop: 0, // Reduced spacing above AI Insights
    },
    sectionTitle: {
        fontSize: theme.typography.h5,
        fontWeight: '800',
        color: theme.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    viewAllText: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.accent,
        fontWeight: '600',
    },
    carouselContainer: {
        marginBottom: theme.spacing.sm, // Reduced from lg
    },
    insightCardSmall: {
        width: width - 40, // Full width minus padding
        marginRight: 0,
        padding: theme.spacing.md,
        height: 80, // Reduced height
        justifyContent: 'center',
    },
    insightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    insightLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.md,
    },
    insightIconContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(255, 159, 67, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    insightTextContainer: {
        flex: 1,
    },
    insightTitleSmall: {
        fontSize: theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.insightText,
        marginBottom: 2,
    },
    insightSubtitleSmall: {
        fontSize: theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.insightText,
        opacity: 0.8,
    },
    seeHowButtonSmall: {
        padding: 8,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.sm,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeDot: {
        backgroundColor: theme.colors.accent,
        width: 18,
    },
    chartCard: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.h5,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: theme.spacing.lg, // Increased from md (Green line)
        marginTop: theme.spacing.sm,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    chartContainer: {
        alignItems: 'center',
    },
    chartWrapper: {
        position: 'relative',
        marginBottom: theme.spacing.lg,
    },
    chartCenter: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartCenterText: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.white,
        marginTop: 4,
        fontWeight: '600',
    },
    legend: {
        width: '100%',
        gap: theme.spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    legendLabel: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.white,
        fontWeight: '500',
    },
    legendValue: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.white,
        fontWeight: '600',
    },
    transactionsCard: {
        marginBottom: theme.spacing.lg,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    appIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionName: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.white,
    },
    transactionDate: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    transactionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    transactionAmount: {
        fontSize: theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    transactionDivider: {
        height: 1,
        backgroundColor: theme.colors.glassCardBorder,
        marginVertical: theme.spacing.sm,
    },
});
