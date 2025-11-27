import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { paymentService } from '../services/paymentService';

export const PremiumUpgradeScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const benefits = [
        { icon: 'gift-outline', title: 'Exclusive Rewards', description: 'Access premium products and offers' },
        { icon: 'flash-outline', title: 'Priority Support', description: '24/7 dedicated customer service' },
        { icon: 'star-outline', title: 'Lifetime Access', description: 'One-time payment, forever premium' },
        { icon: 'trending-up-outline', title: 'Better Insights', description: 'Advanced financial analytics' },
    ];

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // Step 1: Initiate payment order
            const orderData = await paymentService.initiatePayment();

            // Step 2: Open Razorpay checkout
            const options = {
                description: 'Premium Membership - Lifetime',
                image: 'https://img.icons8.com/fluency/96/crown.png',
                currency: orderData.currency,
                key: 'rzp_test_1DP5mmOlF5G5ag', // Test key - replace with your key
                amount: orderData.amount,
                name: 'AI Personal Finance',
                order_id: orderData.order_id,
                prefill: {
                    email: 'user@example.com',
                    contact: '9999999999',
                    name: 'User Name'
                },
                theme: { color: theme.colors.primary }
            };

            RazorpayCheckout.open(options)
                .then(async (data) => {
                    // Step 3: Verify payment
                    const verificationData = {
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature,
                    };

                    const result = await paymentService.verifyPayment(verificationData);

                    if (result.success) {
                        Alert.alert(
                            '🎉 Welcome to Premium!',
                            'Your payment was successful. Enjoy exclusive benefits!',
                            [
                                {
                                    text: 'Start Shopping',
                                    onPress: () => navigation.replace('Shop')
                                }
                            ]
                        );
                    }
                })
                .catch((error) => {
                    console.log('Payment error:', error);
                    Alert.alert('Payment Failed', 'Your payment could not be processed. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });

        } catch (error) {
            console.error('Upgrade error:', error);
            Alert.alert('Error', 'Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="close" size={28} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Crown Icon */}
                    <View style={styles.crownContainer}>
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.crownCircle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="crown" size={64} color="#FFF" />
                        </LinearGradient>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Unlock Premium</Text>
                    <Text style={styles.subtitle}>Lifetime Access for Just $5</Text>

                    {/* Price Card */}
                    <GlassCard style={styles.priceCard}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>One-Time Payment</Text>
                            <View style={styles.priceBadge}>
                                <Text style={styles.savingText}>BEST VALUE</Text>
                            </View>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currency}>$</Text>
                            <Text style={styles.price}>5</Text>
                            <Text style={styles.priceSubtext}>.00</Text>
                        </View>
                        <Text style={styles.priceDescription}>Lifetime access • No recurring fees</Text>
                    </GlassCard>

                    {/* Benefits */}
                    <View style={styles.benefitsContainer}>
                        <Text style={styles.benefitsTitle}>What You Get</Text>
                        {benefits.map((benefit, index) => (
                            <GlassCard key={index} style={styles.benefitCard}>
                                <View style={styles.benefitIconContainer}>
                                    <Ionicons name={benefit.icon} size={24} color={theme.colors.primary} />
                                </View>
                                <View style={styles.benefitText}>
                                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                                </View>
                                <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
                            </GlassCard>
                        ))}
                    </View>

                    {/* Upgrade Button */}
                    <TouchableOpacity
                        style={[styles.upgradeButton, loading && styles.upgradeButtonDisabled]}
                        onPress={handleUpgrade}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.upgradeButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <>
                                    <Ionicons name="lock-open-outline" size={24} color="#000" />
                                    <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Payment Methods */}
                    <View style={styles.paymentMethods}>
                        <Text style={styles.paymentMethodsText}>Secure payment via</Text>
                        <View style={styles.paymentIcons}>
                            <Text style={styles.paymentIcon}>💳</Text>
                            <Text style={styles.paymentIcon}>📱</Text>
                            <Text style={styles.paymentIcon}>🏦</Text>
                        </View>
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
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.md,
        alignItems: 'flex-end',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.screenPadding,
    },
    crownContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    crownCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.white,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.typography.h6,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    priceCard: {
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    priceLabel: {
        fontSize: theme.typography.body,
        color: theme.colors.white,
        fontWeight: '600',
    },
    priceBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    savingText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    currency: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 8,
    },
    price: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFD700',
        lineHeight: 72,
    },
    priceSubtext: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 8,
    },
    priceDescription: {
        fontSize: theme.typography.bodySmall,
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
    benefitsContainer: {
        marginBottom: theme.spacing.xl,
    },
    benefitsTitle: {
        fontSize: theme.typography.h5,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginBottom: theme.spacing.md,
    },
    benefitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    benefitIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.white,
        marginBottom: 2,
    },
    benefitDescription: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
    },
    upgradeButton: {
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    upgradeButtonDisabled: {
        opacity: 0.6,
    },
    upgradeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    upgradeButtonText: {
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
        color: '#000',
    },
    paymentMethods: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    paymentMethodsText: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
    },
    paymentIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    paymentIcon: {
        fontSize: 32,
    },
});
