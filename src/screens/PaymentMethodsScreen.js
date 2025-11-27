import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const PaymentMethodsScreen = ({ navigation }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newUpiId, setNewUpiId] = useState('');
    const [newName, setNewName] = useState('');

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        try {
            const data = await profileService.getPaymentMethods();
            setPaymentMethods(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load payment methods');
        }
    };

    const handleAddUpi = async () => {
        if (!newUpiId) {
            Alert.alert('Error', 'Please enter a UPI ID');
            return;
        }
        try {
            await profileService.addPaymentMethod({
                type: 'upi',
                identifier: newUpiId,
                name: newName || 'UPI ID'
            });
            setModalVisible(false);
            setNewUpiId('');
            setNewName('');
            loadPaymentMethods();
            Alert.alert('Success', 'Payment method added');
        } catch (error) {
            Alert.alert('Error', 'Failed to add payment method');
        }
    };

    const handleDelete = async (id) => {
        Alert.alert(
            'Delete Payment Method',
            'Are you sure you want to delete this payment method?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await profileService.deletePaymentMethod(id);
                            loadPaymentMethods();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete payment method');
                        }
                    }
                }
            ]
        );
    };

    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Payment Methods</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="add" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <Text style={styles.sectionTitle}>Saved UPI IDs</Text>
                    {paymentMethods.filter(pm => pm.type === 'upi').map((pm) => (
                        <GlassCard key={pm.id} style={styles.card}>
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="qr-code-outline" size={24} color={theme.colors.white} />
                                    </View>
                                    <View>
                                        <Text style={styles.methodName}>{pm.name}</Text>
                                        <Text style={styles.methodId}>{pm.identifier}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(pm.id)}>
                                    <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))}

                    <Text style={styles.sectionTitle}>Saved Cards</Text>
                    {paymentMethods.filter(pm => pm.type === 'card').map((pm) => (
                        <GlassCard key={pm.id} style={styles.card}>
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="card-outline" size={24} color={theme.colors.white} />
                                    </View>
                                    <View>
                                        <Text style={styles.methodName}>{pm.name}</Text>
                                        <Text style={styles.methodId}>**** **** **** {pm.identifier}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(pm.id)}>
                                    <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))}
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add UPI ID</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={theme.colors.textDark} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>UPI ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@upi"
                                    value={newUpiId}
                                    onChangeText={setNewUpiId}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Name (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Google Pay"
                                    value={newName}
                                    onChangeText={setNewName}
                                />
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleAddUpi}>
                                <Text style={styles.saveButtonText}>Save UPI ID</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    content: {
        flex: 1,
        padding: theme.spacing.screenPadding,
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: '600',
        color: theme.colors.white,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    card: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodName: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: theme.typography.body,
    },
    methodId: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
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
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: theme.typography.body,
        fontWeight: '600',
        color: theme.colors.textDark,
        marginBottom: theme.spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.body,
        color: theme.colors.textDark,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    saveButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
});
