import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card } from '../components';
import { mockTransactions } from '../services/mockData';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../utils/helpers';

export const TransactionsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'Food & Dining', 'Transportation', 'Shopping', 'Subscriptions'];

    const filteredTransactions = mockTransactions.filter(transaction => {
        const matchesSearch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📊 Transactions</Text>
                <Text style={styles.headerSubtitle}>
                    {mockTransactions.length} transactions this month
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={theme.colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions..."
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
                contentContainerStyle={styles.categoryContent}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryPill,
                            selectedCategory === category && styles.categoryPillActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.categoryTextActive
                        ]}>
                            {category === 'all' ? 'All' : category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Transactions List */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.transactionsList}>
                    {filteredTransactions.map((transaction) => (
                        <Card key={transaction.id} style={styles.transactionCard}>
                            <View style={styles.transactionRow}>
                                <View style={[
                                    styles.transactionIcon,
                                    { backgroundColor: getCategoryColor(transaction.category) + '20' }
                                ]}>
                                    <Ionicons
                                        name={getCategoryIcon(transaction.category)}
                                        size={24}
                                        color={getCategoryColor(transaction.category)}
                                    />
                                </View>

                                <View style={styles.transactionDetails}>
                                    <View style={styles.transactionHeader}>
                                        <Text style={styles.merchantName}>{transaction.merchant}</Text>
                                        {transaction.isLeak && (
                                            <View style={styles.leakBadge}>
                                                <Ionicons name="warning" size={12} color={theme.colors.warning} />
                                                <Text style={styles.leakBadgeText}>Leak</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.categoryName}>{transaction.category}</Text>
                                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                                    {transaction.isLeak && transaction.leakReason && (
                                        <View style={styles.leakReason}>
                                            <Ionicons name="information-circle" size={14} color={theme.colors.accent} />
                                            <Text style={styles.leakReasonText}>{transaction.leakReason}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.amountContainer}>
                                    <Text style={[
                                        styles.amountText,
                                        {
                                            color: transaction.type === 'credit'
                                                ? theme.colors.success
                                                : theme.colors.text
                                        }
                                    ]}>
                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}

                    {filteredTransactions.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="search" size={64} color={theme.colors.textMuted} />
                            <Text style={styles.emptyStateText}>No transactions found</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Try adjusting your search or filters
                            </Text>
                        </View>
                    )}
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
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.screenPadding,
        marginBottom: theme.spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        gap: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: theme.typography.body,
        color: theme.colors.text,
    },
    categoryContainer: {
        marginBottom: theme.spacing.md,
    },
    categoryContent: {
        paddingHorizontal: theme.spacing.screenPadding,
        gap: theme.spacing.sm,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.backgroundCard,
        marginRight: theme.spacing.sm,
    },
    categoryPillActive: {
        backgroundColor: theme.colors.primary,
    },
    categoryText: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: theme.colors.white,
    },
    scrollView: {
        flex: 1,
    },
    transactionsList: {
        paddingHorizontal: theme.spacing.screenPadding,
    },
    transactionCard: {
        marginBottom: theme.spacing.sm,
    },
    transactionRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionDetails: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    merchantName: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    leakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: theme.colors.warning + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    leakBadgeText: {
        fontSize: theme.typography.tiny,
        fontWeight: '600',
        color: theme.colors.warning,
    },
    categoryName: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    transactionDate: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    leakReason: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
        backgroundColor: theme.colors.accent + '10',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        alignSelf: 'flex-start',
    },
    leakReasonText: {
        fontSize: theme.typography.caption,
        color: theme.colors.accent,
    },
    amountContainer: {
        justifyContent: 'center',
    },
    amountText: {
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyStateText: {
        fontSize: theme.typography.h5,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
    },
    emptyStateSubtext: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xs,
    },
});
