import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { mockTransactions } from '../services/mockData';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/helpers';

export const TransactionsScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);

    const getBrandIcon = (merchant) => {
        const brandIcons = {
            'Starbucks': { icon: 'cafe', color: '#00704A' },
            'Netflix': { icon: 'tv', color: '#E50914' },
            'Uber': { icon: 'car', color: '#000000' },
            'Amazon': { icon: 'cart', color: '#FF9900' },
            'Spotify': { icon: 'musical-notes', color: '#1DB954' },
        };
        return brandIcons[merchant] || getCategoryIcon('Other');
    };

    const filteredTransactions = mockTransactions.filter((transaction) => {
        const matchesSearch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

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
                    <Text style={styles.headerTitle}>Transactions</Text>
                    <TouchableOpacity onPress={() => setFilterVisible(!filterVisible)}>
                        <Ionicons name="filter" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                {filterVisible && (
                    <View style={styles.filterInfo}>
                        <Text style={styles.filterInfoText}>Filter options coming soon!</Text>
                    </View>
                )}

                {/* Search Bar */}
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={theme.colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions..."
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Transactions List */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                            <GlassCard key={transaction.id} style={styles.transactionCard}>
                                <TouchableOpacity style={styles.transactionItem}>
                                    <View style={styles.transactionLeft}>
                                        <View
                                            style={[
                                                styles.iconContainer,
                                                { backgroundColor: getBrandIcon(transaction.merchant).color },
                                            ]}
                                        >
                                            <Ionicons
                                                name={getBrandIcon(transaction.merchant).icon}
                                                size={24}
                                                color={theme.colors.white}
                                            />
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <Text style={styles.merchantName}>{transaction.merchant}</Text>
                                            <Text style={styles.categoryLabel}>{transaction.category}</Text>
                                            <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transactionRight}>
                                        <Text style={styles.amountText}>₹{transaction.amount}</Text>
                                        {transaction.isLeak && (
                                            <View style={styles.leakBadge}>
                                                <Ionicons name="warning" size={12} color={theme.colors.danger} />
                                                <Text style={styles.leakText}>{transaction.leakReason}</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </GlassCard>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={64} color="rgba(255, 255, 255, 0.5)" />
                            <Text style={styles.emptyText}>No transactions found</Text>
                        </View>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: theme.spacing.screenPadding,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        color: theme.colors.white,
        fontSize: theme.typography.body,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
        marginTop: 0, // Reset since filter is removed
    },
    transactionCard: {
        marginBottom: theme.spacing.md,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Changed from 'center' to align text properly
        justifyContent: 'space-between',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Changed from 'center' to align text properly
        flex: 1,
        gap: theme.spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2, // Small adjustment to align with first line of text
    },
    transactionInfo: {
        flex: 1,
        justifyContent: 'flex-start', // Ensure text starts from top
    },
    merchantName: {
        fontSize: theme.typography.body,
        fontWeight: '700',
        color: theme.colors.white,
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    categoryLabel: {
        fontSize: theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginBottom: 2,
    },
    dateText: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: theme.typography.h6,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    leakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.35)', // More visible background
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.md,
        gap: 6,
        marginTop: 6,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.6)', // Add border for better visibility
    },
    leakText: {
        fontSize: 11,
        color: '#FFB3B3', // Much brighter red/pink for better visibility
        fontWeight: '700',
    },
    filterInfo: {
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: theme.spacing.screenPadding,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    filterInfoText: {
        color: theme.colors.white,
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: theme.typography.body,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: theme.spacing.md,
        fontWeight: '600',
    },
});
