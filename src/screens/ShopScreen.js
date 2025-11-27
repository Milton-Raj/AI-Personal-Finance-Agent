import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const ShopScreen = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isPremium, setIsPremium] = useState(route.params?.isPremium || false);
    const [redeemLoading, setRedeemLoading] = useState(null);

    useEffect(() => {
        // Update premium status if passed via params
        if (route.params?.isPremium) {
            setIsPremium(true);
        }
    }, [route.params]);

    const handleUpgrade = () => {
        Alert.alert(
            'Upgrade to Premium',
            'Unlock exclusive rewards and shop access for just $5 (Lifetime)!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay Now',
                    onPress: () => navigation.navigate('Wallet', { upgrade: true })
                }
            ]
        );
    };

    const handleRedeem = async (itemId, itemName, cost) => {
        setRedeemLoading(itemId);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In real app, check balance and deduct coins
            Alert.alert('Success', `You have redeemed ${itemName} for ${cost} coins!`);
        } catch (error) {
            Alert.alert('Error', 'Failed to redeem item. Please try again.');
        } finally {
            setRedeemLoading(null);
        }
    };

    // Show Premium Upgrade screen for non-premium users
    if (!isPremium) {
        navigation.replace('PremiumUpgrade');
        return null;
    }

    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Shop</Text>
                    <View style={styles.headerRight}>
                        {isPremium && (
                            <View style={styles.premiumBadge}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.premiumText}>Premium</Text>
                            </View>
                        )}
                        <View style={styles.coinBalance}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/fluency/48/coin-wallet.png' }}
                                style={styles.coinIcon}
                            />
                            <Text style={styles.coinText}>2,450</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={theme.colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search rewards..."
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured Rewards</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                        {[1, 2, 3].map((item) => (
                            <GlassCard key={item} style={styles.productCard}>
                                <View style={styles.productImagePlaceholder} />
                                <Text style={styles.productName}>Premium Headset</Text>
                                <Text style={styles.productCost}>500 Coins</Text>
                                <TouchableOpacity
                                    style={styles.redeemButton}
                                    onPress={() => handleRedeem(item, 'Premium Headset', 500)}
                                    disabled={redeemLoading === item}
                                >
                                    {redeemLoading === item ? (
                                        <ActivityIndicator size="small" color={theme.colors.white} />
                                    ) : (
                                        <Text style={styles.redeemButtonText}>Redeem</Text>
                                    )}
                                </TouchableOpacity>
                            </GlassCard>
                        ))}
                    </ScrollView>

                    <Text style={styles.sectionTitle}>Trending Now</Text>
                    <View style={styles.grid}>
                        {[1, 2, 3, 4].map((item) => (
                            <GlassCard key={item} style={styles.gridCard}>
                                <View style={styles.productImagePlaceholderSmall} />
                                <Text style={styles.productNameSmall}>Gift Card</Text>
                                <Text style={styles.productCostSmall}>200 Coins</Text>
                                <TouchableOpacity
                                    style={styles.redeemButtonSmall}
                                    onPress={() => handleRedeem(`grid-${item}`, 'Gift Card', 200)}
                                    disabled={redeemLoading === `grid-${item}`}
                                >
                                    {redeemLoading === `grid-${item}` ? (
                                        <ActivityIndicator size="small" color={theme.colors.white} />
                                    ) : (
                                        <Text style={styles.redeemButtonTextSmall}>Redeem</Text>
                                    )}
                                </TouchableOpacity>
                            </GlassCard>
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    coinBalance: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    coinIcon: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    coinText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: theme.typography.body,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    premiumText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 10,
        marginLeft: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.inputBackground,
        marginHorizontal: theme.spacing.screenPadding,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        height: 48,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        color: theme.colors.white,
        fontSize: theme.typography.body,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    seeAllText: {
        color: theme.colors.primary,
        fontSize: theme.typography.body,
    },
    featuredScroll: {
        marginBottom: theme.spacing.lg,
    },
    productCard: {
        width: 160,
        marginRight: theme.spacing.md,
        padding: theme.spacing.md,
    },
    productImagePlaceholder: {
        width: '100%',
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.sm,
    },
    productName: {
        color: theme.colors.white,
        fontWeight: '600',
        marginBottom: 4,
    },
    productCost: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    redeemButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
    },
    redeemButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: theme.typography.bodySmall,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%',
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    productImagePlaceholderSmall: {
        width: '100%',
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.sm,
    },
    productNameSmall: {
        color: theme.colors.white,
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
        marginBottom: 2,
    },
    productCostSmall: {
        color: theme.colors.primary,
        fontSize: theme.typography.caption,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    redeemButtonSmall: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
    },
    redeemButtonTextSmall: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    lockedIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    lockedTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    lockedText: {
        fontSize: theme.typography.body,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 24,
    },
    upgradeButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    upgradeButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
});
