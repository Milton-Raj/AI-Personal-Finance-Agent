import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlassCard } from '../components';

export const HelpSupportScreen = ({ navigation }) => {
    const faqs = [
        { q: "How do I add money?", a: "Go to Wallet and click on 'Add Money'." },
        { q: "Is my data safe?", a: "Yes, we use bank-grade encryption." },
        { q: "How to contact support?", a: "Email us at support@vibcoding.com" },
    ];

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
                    <Text style={styles.headerTitle}>Help & Support</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content}>
                    <GlassCard style={styles.contactCard}>
                        <Ionicons name="headset" size={48} color={theme.colors.white} />
                        <Text style={styles.contactTitle}>Need help?</Text>
                        <Text style={styles.contactText}>Our support team is available 24/7</Text>
                        <TouchableOpacity style={styles.contactButton}>
                            <Text style={styles.contactButtonText}>Chat with Us</Text>
                        </TouchableOpacity>
                    </GlassCard>

                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {faqs.map((faq, index) => (
                        <GlassCard key={index} style={styles.faqCard}>
                            <Text style={styles.question}>{faq.q}</Text>
                            <Text style={styles.answer}>{faq.a}</Text>
                        </GlassCard>
                    ))}
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
    contactCard: {
        alignItems: 'center',
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    contactTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    contactText: {
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.lg,
    },
    contactButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    contactButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: theme.typography.h6,
        fontWeight: '600',
        color: theme.colors.white,
        marginBottom: theme.spacing.md,
    },
    faqCard: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    question: {
        color: theme.colors.white,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    answer: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.bodySmall,
    },
});
