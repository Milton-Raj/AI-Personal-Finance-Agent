import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { CoffeeIcon, SparkleIcon } from '../components/Icons';
import { mockLeakInsights } from '../services/mockData';

export const InsightsScreen = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All', icon: 'apps' },
        { id: 'high', label: 'High', icon: 'alert-circle' },
        { id: 'medium', label: 'Medium', icon: 'warning' },
        { id: 'low', label: 'Low', icon: 'information-circle' },
    ];

    const filteredInsights = selectedFilter === 'all'
        ? mockLeakInsights
        : mockLeakInsights.filter((insight) => insight.severity === selectedFilter);

    const totalSavings = filteredInsights.reduce((sum, insight) => sum + insight.potentialSavings, 0);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return theme.colors.danger;
            case 'medium':
                return theme.colors.warning;
            case 'low':
                return theme.colors.success;
            default:
                return theme.colors.gray;
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
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>AI Insights</Text>
                        <SparkleIcon size={24} color="#FFD93D" />
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Savings Summary */}
                <View style={styles.summaryContainer}>
                    <GlassCard style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Potential Monthly Savings</Text>
                        <Text style={styles.summaryAmount}>₹{totalSavings.toLocaleString('en-IN')}</Text>
                        <Text style={styles.summarySubtext}>
                            {filteredInsights.length} leak{filteredInsights.length !== 1 ? 's' : ''} detected
                        </Text>
                    </GlassCard>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContainer}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter.id && styles.filterChipActive,
                            ]}
                            onPress={() => setSelectedFilter(filter.id)}
                        >
                            <Ionicons
                                name={filter.icon}
                                size={16}
                                color={selectedFilter === filter.id ? theme.colors.textDark : theme.colors.white}
                            />
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedFilter === filter.id && styles.filterTextActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Insights List */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredInsights.map((insight, index) => (
                        <GlassCard key={index} style={styles.insightCard}>
                            <View style={styles.insightHeader}>
                                <View style={styles.insightLeft}>
                                    <View
                                        style={[
                                            styles.severityDot,
                                            { backgroundColor: getSeverityColor(insight.severity) },
                                        ]}
                                    />
                                    <Text style={styles.insightCategory}>{insight.category}</Text>
                                </View>
                                <View style={styles.savingsChip}>
                                    <Text style={styles.savingsText}>
                                        ₹{insight.potentialSavings}/mo
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.insightTitle}>{insight.title}</Text>
                            <Text style={styles.insightDescription}>{insight.description}</Text>

                            {insight.suggestion && (
                                <View style={styles.suggestionContainer}>
                                    <View style={styles.suggestionIcon}>
                                        <Ionicons name="bulb" size={20} color={theme.colors.accent} />
                                    </View>
                                    <Text style={styles.suggestionText}>{insight.suggestion}</Text>
                                </View>
                            )}

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionButtonText}>See Details</Text>
                                    <Ionicons name="chevron-forward" size={16} color={theme.colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.dismissButton}>
                                    <Text style={styles.dismissButtonText}>Dismiss</Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))}

                    {filteredInsights.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle" size={64} color="rgba(255, 255, 255, 0.5)" />
                            <Text style={styles.emptyText}>No leaks detected!</Text>
                            <Text style={styles.emptySubtext}>You're doing great with your spending</Text>
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
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
        marginBottom: theme.spacing.md,
    },
    summaryCard: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    summaryLabel: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
    },
    summaryAmount: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.white,
        marginBottom: theme.spacing.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
    },
    summarySubtext: {
        fontSize: theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.textMuted,
    },
    filterScroll: {
        marginBottom: theme.spacing.md,
    },
    filterContainer: {
        paddingHorizontal: theme.spacing.screenPadding,
        gap: theme.spacing.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20, // Pill shape
        backgroundColor: 'rgba(75, 60, 150, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        gap: 6,
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    filterText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.white,
    },
    filterTextActive: {
        color: theme.colors.textDark,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    insightCard: {
        marginBottom: theme.spacing.md,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    insightLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    insightCategory: {
        fontSize: theme.typography.caption,
        fontWeight: '700',
        color: theme.colors.white,
        textTransform: 'uppercase',
    },
    savingsChip: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.round,
    },
    savingsText: {
        fontSize: theme.typography.caption,
        fontWeight: '700',
        color: theme.colors.white,
    },
    insightTitle: {
        fontSize: theme.typography.h6,
        fontWeight: '800',
        color: theme.colors.white,
        marginBottom: theme.spacing.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    insightDescription: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.md,
        lineHeight: 20,
    },
    suggestionContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 217, 61, 0.15)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    suggestionIcon: {
        marginTop: 2,
    },
    suggestionText: {
        flex: 1,
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.white,
        lineHeight: 20,
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
        gap: 4,
    },
    actionButtonText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '700',
        color: theme.colors.white,
    },
    dismissButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    dismissButtonText: {
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        color: theme.colors.textMuted,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: theme.typography.h6,
        fontWeight: '700',
        color: theme.colors.white,
        marginTop: theme.spacing.md,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    emptySubtext: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xs,
    },
});
