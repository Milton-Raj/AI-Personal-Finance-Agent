import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const WalletScreen = ({ navigation, route }) => {
    const [balance, setBalance] = useState(12450);
    const [addMoneyVisible, setAddMoneyVisible] = useState(false);
    const [sendMoneyVisible, setSendMoneyVisible] = useState(false);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (route.params?.upgrade) {
            handleMembershipPayment();
        }
    }, [route.params]);

    const handleMembershipPayment = () => {
        Alert.alert(
            'Confirm Membership Payment',
            'Pay $5 (approx ₹400) for Lifetime Premium Membership?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay & Upgrade',
                    onPress: async () => {
                        try {
                            // In real app, check balance first
                            await profileService.upgradeMembership();
                            Alert.alert('Success', 'Welcome to Premium!', [
                                { text: 'Go to Shop', onPress: () => navigation.navigate('Shop') }
                            ]);
                        } catch (error) {
                            Alert.alert('Error', 'Payment failed');
                        }
                    }
                }
            ]
        );
    };

    const renderModal = (visible, onClose, title, actionText, icon) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.textDark} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0"
                            keyboardType="numeric"
                            autoFocus
                        />
                    </View>

                    <View style={styles.presetContainer}>
                        {['500', '1000', '2000', '5000'].map((val) => (
                            <TouchableOpacity
                                key={val}
                                style={styles.presetChip}
                                onPress={() => setAmount(val)}
                            >
                                <Text style={styles.presetText}>+{val}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.actionButton} onPress={onClose}>
                        <Ionicons name={icon} size={20} color={theme.colors.white} />
                        <Text style={styles.actionButtonText}>{actionText}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );

    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Wallet</Text>
                    <TouchableOpacity>
                        <Ionicons name="time-outline" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <GlassCard style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
                        <View style={styles.balanceActions}>
                            <TouchableOpacity
                                style={styles.actionItem}
                                onPress={() => setAddMoneyVisible(true)}
                            >
                                <View style={styles.actionIcon}>
                                    <Ionicons name="add" size={24} color={theme.colors.white} />
                                </View>
                                <Text style={styles.actionText}>Add Money</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionItem}
                                onPress={() => setSendMoneyVisible(true)}
                            >
                                <View style={styles.actionIcon}>
                                    <Ionicons name="paper-plane-outline" size={24} color={theme.colors.white} />
                                </View>
                                <Text style={styles.actionText}>Send</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem}>
                                <View style={styles.actionIcon}>
                                    <Ionicons name="list-outline" size={24} color={theme.colors.white} />
                                </View>
                                <Text style={styles.actionText}>History</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>

                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    {/* Mock Transactions */}
                    {[1, 2, 3].map((item) => (
                        <GlassCard key={item} style={styles.transactionCard}>
                            <View style={styles.transactionLeft}>
                                <View style={styles.transactionIcon}>
                                    <Ionicons name="cart-outline" size={20} color={theme.colors.white} />
                                </View>
                                <View>
                                    <Text style={styles.transactionTitle}>Shopping</Text>
                                    <Text style={styles.transactionDate}>Today, 10:30 AM</Text>
                                </View>
                            </View>
                            <Text style={styles.transactionAmount}>-₹450</Text>
                        </GlassCard>
                    ))}
                </ScrollView>

                {renderModal(addMoneyVisible, () => setAddMoneyVisible(false), 'Add Money', 'Add to Wallet', 'wallet-outline')}
                {renderModal(sendMoneyVisible, () => setSendMoneyVisible(false), 'Send Money', 'Send Now', 'paper-plane-outline')}
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    content: {
        flex: 1,
        padding: theme.spacing.screenPadding,
    },
    balanceCard: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    balanceLabel: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.body,
        marginBottom: theme.spacing.xs,
    },
    balanceAmount: {
        color: theme.colors.white,
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xl,
    },
    balanceActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    actionItem: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xs,
    },
    actionText: {
        color: theme.colors.white,
        fontSize: theme.typography.caption,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: '600',
        color: theme.colors.white,
        marginBottom: theme.spacing.md,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionTitle: {
        color: theme.colors.white,
        fontWeight: '500',
    },
    transactionDate: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
    },
    transactionAmount: {
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.backgroundLight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: theme.spacing.xl,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: theme.spacing.xl,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginRight: theme.spacing.sm,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        paddingVertical: theme.spacing.sm,
    },
    presetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
    },
    presetChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.border,
    },
    presetText: {
        color: theme.colors.textDark,
        fontWeight: '500',
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.sm,
    },
    actionButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
});
