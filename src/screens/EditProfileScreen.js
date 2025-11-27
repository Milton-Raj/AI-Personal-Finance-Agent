import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme';
import { GlassCard } from '../components';
import { profileService } from '../services/profileService';

export const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [age, setAge] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone || '');
            setImage(data.profile_image);
            if (data.dob) {
                const date = new Date(data.dob);
                setDob(date);
                calculateAge(date);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile');
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setAge(age.toString());
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDob(selectedDate);
            calculateAge(selectedDate);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            try {
                await profileService.uploadProfileImage(result.assets[0].uri);
            } catch (error) {
                console.error('Failed to upload image', error);
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const formattedDob = dob.toISOString().split('T')[0];
            await profileService.updateProfile({ name, email, phone, dob: formattedDob });
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
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
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatarImage} />
                            ) : (
                                <Ionicons name="person" size={48} color={theme.colors.white} />
                            )}
                            <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
                                <Ionicons name="pencil" size={16} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </View>

                    <GlassCard style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={theme.colors.textMuted}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {dob.toISOString().split('T')[0]}
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

                        {age ? (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Age</Text>
                                <View style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                    <Text style={{ color: theme.colors.textMuted }}>{age} years old</Text>
                                </View>
                            </View>
                        ) : null}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter your phone number"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </GlassCard>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
                    </TouchableOpacity>
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
    content: {
        flex: 1,
        padding: theme.spacing.screenPadding,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    changePhotoText: {
        color: theme.colors.primary,
        fontSize: theme.typography.body,
        fontWeight: '600',
    },
    formCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.bodySmall,
        marginBottom: theme.spacing.xs,
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
});
