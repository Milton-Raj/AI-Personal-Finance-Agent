import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfettiCannon from 'react-native-confetti-cannon';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const PersonalInformationScreen = ({ navigation, route }) => {
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false);
    const isOnboarding = route.params?.isOnboarding || false;
    const confettiRef = useRef(null);

    useEffect(() => {
        if (!isOnboarding) {
            loadData();
        }
    }, []);

    const loadData = async () => {
        try {
            const data = await profileService.getProfile();
            if (data.monthly_income) {
                setMonthlyIncome(data.monthly_income.toString());
            }
            if (data.dob) {
                setDob(new Date(data.dob));
            }
        } catch (error) {
            console.log('Failed to load data');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
    };

    const handleSave = async () => {
        if (!monthlyIncome) {
            Alert.alert('Error', 'Please enter your monthly income');
            return;
        }

        setLoading(true);
        try {
            await profileService.updateProfile({
                monthly_income: parseFloat(monthlyIncome),
                dob: dob.toISOString().split('T')[0]
            });

            if (isOnboarding) {
                // Trigger confetti
                if (confettiRef.current) {
                    confettiRef.current.start();
                }

                // Wait for confetti animation before navigating
                setTimeout(() => {
                    navigation.replace('Main');
                }, 2000);
            } else {
                Alert.alert('Success', 'Personal information updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
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
                    {!isOnboarding && (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle}>Personal Information</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content}>
                    <GlassCard style={styles.formCard}>
                        {/* DOB Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {dob.toLocaleDateString()}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dob}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>

                        {/* Monthly Income Input */}
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

                    <TouchableOpacity
                        style={[styles.saveButton, isOnboarding && styles.continueButton]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={isOnboarding ? ['#FFD700', '#FFA500'] : [theme.colors.primary, theme.colors.primary]}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={[styles.saveButtonText, isOnboarding && styles.continueButtonText]}>
                                {isOnboarding ? 'Continue' : 'Save Changes'}
                            </Text>
                            {isOnboarding && <Ionicons name="arrow-forward" size={24} color="#000" />}
                        </LinearGradient>
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

                <ConfettiCannon
                    ref={confettiRef}
                    count={200}
                    origin={{ x: -10, y: 0 }}
                    autoStart={false}
                    fadeOut={true}
                />
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
        marginBottom: theme.spacing.xs,
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
    dateInput: {
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        color: theme.colors.white,
        fontSize: theme.typography.body,
    },
    saveButton: {
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
    },
    continueButton: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        transform: [{ scale: 1.02 }],
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    saveButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.h6,
        fontWeight: 'bold',
    },
    continueButtonText: {
        color: '#000',
        fontSize: 20,
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
