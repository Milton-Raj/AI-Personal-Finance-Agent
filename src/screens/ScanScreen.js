import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export const ScanScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [lastScannedData, setLastScannedData] = useState(null);

    if (!permission) {
        // Camera permissions are still loading
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const isPaymentQR = (data) => {
        // Check if QR code is a payment QR
        // Common payment QR patterns: UPI, PayTM, PhonePe, GPay, etc.
        const paymentPatterns = [
            /^upi:\/\//i,           // UPI payment
            /paytm/i,               // PayTM
            /phonepe/i,             // PhonePe
            /gpay/i,                // Google Pay
            /bhim/i,                // BHIM
            /^https?:\/\/.*pay/i,   // Generic payment URLs
        ];

        // Filter out Expo dev URLs and other non-payment QR codes
        if (data.includes('expo.dev') || data.includes('localhost') || data.includes('snack-channel')) {
            return false;
        }

        return paymentPatterns.some(pattern => pattern.test(data));
    };

    const resetScanner = () => {
        setScanned(false);
        setLastScannedData(null);
    };

    const handleBarCodeScanned = ({ type, data }) => {
        // Prevent multiple scans of the same QR code
        if (scanned || lastScannedData === data) {
            return;
        }

        setScanned(true);
        setLastScannedData(data);

        // Validate if it's a payment QR
        if (!isPaymentQR(data)) {
            Alert.alert(
                'Invalid QR Code',
                'This is not a payment QR',
                [
                    {
                        text: 'OK',
                        onPress: resetScanner
                    }
                ],
                { cancelable: false }
            );
            return;
        }

        // Valid payment QR - process payment
        Alert.alert(
            'Payment QR Detected',
            'Processing payment...',
            [
                {
                    text: 'Cancel',
                    onPress: resetScanner,
                    style: 'cancel'
                },
                {
                    text: 'Pay',
                    onPress: () => {
                        // Navigate to payment confirmation or process payment
                        navigation.goBack();
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                enableTorch={torch}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                            <Ionicons name="close" size={32} color={theme.colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Scan QR Code</Text>
                        <View style={{ width: 32 }} />
                    </View>

                    <View style={styles.scannerContainer}>
                        {/* Removed yellow box overlay as requested */}
                        <Text style={styles.instruction}>Align QR code to pay</Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.flashButton, torch && styles.flashButtonActive]}
                            onPress={() => setTorch(!torch)}
                        >
                            <Ionicons
                                name={torch ? "flashlight" : "flashlight-outline"}
                                size={24}
                                color={theme.colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    camera: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        color: theme.colors.white,
        fontSize: theme.typography.h5,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instruction: {
        color: theme.colors.white,
        fontSize: theme.typography.body,
        textAlign: 'center',
        opacity: 0.8,
        marginTop: 200, // Push text down a bit
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    footer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: 20,
    },
    flashButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    flashButtonActive: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
});
