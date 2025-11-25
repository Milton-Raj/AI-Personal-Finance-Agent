import React, { useState } from 'react';
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
import { mockLeakInsights } from '../services/mockData';
import { formatCurrency, getCategoryColor } from '../utils/helpers';

export const InsightsScreen = () => {
    const [selectedSeverity, setSelectedSeverity] = useState('all');

    const filteredLeaks = selectedSeverity === 'all'
        ? mockLeakInsights
        : mockLeakInsights.filter(leak => leak.severity === selectedSeverity);

    const totalSavings = mockLeakInsights.reduce((sum, leak) => sum + leak.savings, 0);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>💡 Insights</Text>
                <Text style={styles.headerSubtitle}>
                    Potential savings: {formatCurrency(totalSavings)}/month
                </Text>
            </View>

            {/* Filter Pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        selectedSeverity === 'all' && styles.filterPillActive
                    ]}
                    onPress={() => setSelectedSeverity('all')}
                >
                    <Text style={[
                        styles.filterText,
                        selectedSeverity === 'all' && styles.filterTextActive
                    ]}>
                        All ({mockLeakInsights.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        selectedSeverity === 'high' && styles.filterPillActive,
                        { borderColor: theme.colors.leakHigh }
                    ]}
                    onPress={() => setSelectedSeverity('high')}
                >
                    <Text style={[
                        styles.filterText,
                        selectedSeverity === 'high' && styles.filterTextActive
                    ]}>
                        High ({mockLeakInsights.filter(l => l.severity === 'high').length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        selectedSeverity === 'medium' && styles.filterPillActive,
                        { borderColor: theme.colors.leakMedium }
                    ]}
                    onPress={() => setSelectedSeverity('medium')}
                >
                    <Text style={[
                        styles.filterText,
                        selectedSeverity === 'medium' && styles.filterTextActive
                    ]}>
                        Medium ({mockLeakInsights.filter(l => l.severity === 'medium').length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        selectedSeverity === 'low' && styles.filterPillActive,
                        { borderColor: theme.colors.leakLow }
                    ]}
                    onPress={() => setSelectedSeverity('low')}
                >
                    <Text style={[
                        styles.filterText,
                        selectedSeverity === 'low' && styles.filterTextActive
                    ]}>
                        Low ({mockLeakInsights.filter(l => l.severity === 'low').length})
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.leaksList}>
                    {filteredLeaks.map((leak) => (
                        <Card key={leak.id} style={styles.leakCard}>
                            <View style={styles.leakHeader}>
                                <View style={[
                                    styles.leakIconContainer,
                                    { backgroundColor: getCategoryColor(leak.category) + '20' }
                                ]}>
                                    <Ionicons
                                        name={leak.icon}
                                        size={28}
                                        color={getCategoryColor(leak.category)}
                                    />
                                </View>
                                <View style={[
                                    styles.severityBadge,
                                    {
                                        backgroundColor: leak.severity === 'high'
                                            ? theme.colors.leakHigh + '20'
                                            : leak.severity === 'medium'
                                                ? theme.colors.leakMedium + '20'
                                                : theme.colors.leakLow + '20'
                                    }
                                ]}>
                                    <Text style={[
                                        styles.severityText,
                                        {
                                            color: leak.severity === 'high'
                                                ? theme.colors.leakHigh
                                                : leak.severity === 'medium'
                                                    ? theme.colors.leakMedium
                                                    : theme.colors.leakLow
                                        }
                                    ]}>
                                        {leak.severity.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.leakTitle}>{leak.title}</Text>
                            <Text style={styles.leakDescription}>{leak.description}</Text>

                            <View style={styles.savingsContainer}>
                                <View style={styles.savingsBox}>
                                    <Ionicons name="trending-up" size={20} color={theme.colors.success} />
                                    <Text style={styles.savingsLabel}>Potential Savings</Text>
                                    <Text style={styles.savingsAmount}>
                                        {formatCurrency(leak.savings)}/month
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.alternativeContainer}>
                                <View style={styles.alternativeHeader}>
                                    <Ionicons name="bulb" size={18} color={theme.colors.accent} />
                                    <Text style={styles.alternativeTitle}>Suggestion</Text>
                                </View>
                                <Text style={styles.alternativeText}>{leak.alternative}</Text>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="close-circle" size={20} color={theme.colors.danger} />
                                    <Text style={styles.actionButtonText}>Dismiss</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.white} />
                                    <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
                                        Take Action
                                    </Text>
                                </TouchableOpacity>
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
    filterContainer: {
        marginBottom: theme.spacing.md,
    },
    filterContent: {
        paddingHorizontal: theme.spacing.screenPadding,
        gap: theme.spacing.sm,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.round,
        borderWidth: 1,
        borderColor: theme.colors.grayDark,
        marginRight: theme.spacing.sm,
    },
    filterPillActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterText: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    filterTextActive: {
        color: theme.colors.white,
    },
    scrollView: {
        flex: 1,
    },
    leaksList: {
        paddingHorizontal: theme.spacing.screenPadding,
    },
    leakCard: {
        marginBottom: theme.spacing.md,
    },
    leakHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    leakIconContainer: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.sm,
    },
    severityText: {
        fontSize: theme.typography.caption,
        fontWeight: 'bold',
    },
    leakTitle: {
        fontSize: theme.typography.h5,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    leakDescription: {
        fontSize: theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    savingsContainer: {
        marginBottom: theme.spacing.md,
    },
    savingsBox: {
        backgroundColor: theme.colors.success + '10',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.success,
    },
    savingsLabel: {
        fontSize: theme.typography.caption,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    savingsAmount: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.success,
        marginTop: 4,
    },
    alternativeContainer: {
        backgroundColor: theme.colors.accent + '10',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    alternativeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: theme.spacing.sm,
    },
    alternativeTitle: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.accent,
    },
    alternativeText: {
        fontSize: theme.typography.body,
        color: theme.colors.text,
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
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundLight,
    },
    actionButtonPrimary: {
        backgroundColor: theme.colors.primary,
    },
    actionButtonText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
});
