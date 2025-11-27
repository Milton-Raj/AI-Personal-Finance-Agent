import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const PersonalInformationScreen = ({ navigation }) => {
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await profileService.getProfile();
            if (data.monthly_income) {
                setMonthlyIncome(data.monthly_income.toString());
            }
        } catch (error) {
            console.log('Failed to load data');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await profileService.updateProfile({
                monthly_income: parseFloat(monthlyIncome)
            });
            Alert.alert('Success', 'Personal information updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update information');
        } finally {
            setLoading(false);
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Personal Information</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content}>
                    <GlassCard style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Monthly Income</Text>
                                <TouchableOpacity onPress={() => setShowInfo(true)}>
                                    <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={monthlyIncome}
                                onChangeText={setMonthlyIncome}
                                placeholder="Enter monthly income"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="numeric"
                            />
                        </View>
                    </GlassCard>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Modal
                    transparent={true}
                    visible={showInfo}
                    onRequestClose={() => setShowInfo(false)}
                    animationType="fade"
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowInfo(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Monthly Income</Text>
                            <Text style={styles.modalText}>
                                Please include all sources of income, such as:
                            </Text>
                            <View style={styles.bulletList}>
                                <Text style={styles.bulletItem}>• Salary / Wages</Text>
                                <Text style={styles.bulletItem}>• Rental Income</Text>
                                <Text style={styles.bulletItem}>• Side Business / Freelancing</Text>
                                <Text style={styles.bulletItem}>• Investments / Dividends</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowInfo(false)}
                            >
                                <Text style={styles.closeButtonText}>Got it</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
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
    formCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        gap: theme.spacing.xs,
    },
    label: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.bodySmall,
        fontWeight: '600',
    },
    input: {
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        color: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        fontSize: theme.typography.body,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    saveButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth: 320,
    },
    modalTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginBottom: theme.spacing.md,
    },
    modalText: {
        color: theme.colors.textDark,
        fontSize: theme.typography.body,
        marginBottom: theme.spacing.md,
    },
    bulletList: {
        marginBottom: theme.spacing.lg,
    },
    bulletItem: {
        color: theme.colors.textDark,
        fontSize: theme.typography.body,
        marginBottom: theme.spacing.xs,
        paddingLeft: theme.spacing.sm,
    },
    closeButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    closeButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
    },
});
