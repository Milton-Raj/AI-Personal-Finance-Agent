import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { GlassCard } from '../components/GlassCard';

const allProducts = [
    {
        id: 1,
        name: 'Premium Coffee',
        price: 500,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
        brand: 'Starbucks'
    },
    {
        id: 2,
        name: 'Amazon Gift Card',
        price: 1000,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80',
        brand: 'Amazon'
    },
    {
        id: 3,
        name: 'Uber Ride Voucher',
        price: 750,
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80',
        brand: 'Uber'
    },
    {
        id: 4,
        name: 'Spotify Premium',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&q=80',
        brand: 'Spotify'
    },
    {
        id: 5,
        name: 'Netflix Subscription',
        price: 800,
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8efe85?w=500&q=80',
        brand: 'Netflix'
    },
    {
        id: 6,
        name: 'Apple Music',
        price: 900,
        image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&q=80',
        brand: 'Apple'
    },
];

export const AllProductsScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>All Rewards</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.productsGrid}>
                        {allProducts.map((product) => (
                            <GlassCard key={product.id} style={styles.productCard}>
                                <Image source={{ uri: product.image }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                    <Text style={styles.brandName}>{product.brand}</Text>
                                    <Text style={styles.productName}>{product.name}</Text>

                                    <TouchableOpacity style={styles.buyButton}>
                                        <Ionicons name="logo-bitcoin" size={16} color={theme.colors.white} />
                                        <Text style={styles.priceText}>{product.price}</Text>
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        ))}
                    </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.screenPadding,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: theme.typography.h4,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    scrollContent: {
        padding: theme.spacing.screenPadding,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    productCard: {
        width: '48%',
        padding: 0,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
    },
    productImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: theme.spacing.md,
    },
    brandName: {
        fontSize: theme.typography.caption,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    productName: {
        fontSize: theme.typography.body,
        fontWeight: 'bold',
        color: theme.colors.white,
        marginBottom: theme.spacing.md,
        height: 40,
    },
    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.md,
        gap: 4,
    },
    priceText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: theme.typography.bodySmall,
    },
});
