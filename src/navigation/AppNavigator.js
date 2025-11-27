import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { AllProductsScreen } from '../screens/AllProductsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { LegalScreen } from '../screens/LegalScreen';
import { PersonalInformationScreen } from '../screens/PersonalInformationScreen';
import { PremiumUpgradeScreen } from '../screens/PremiumUpgradeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { ScanScreen } from '../screens/ScanScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 4,
                borderColor: '#2D2B55', // Match tab bar background
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: theme.colors.accent,
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                tabBarStyle: {
                    backgroundColor: '#2D2B55',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 70,
                    paddingBottom: 12,
                    paddingTop: 12,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={TransactionsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="list" size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="scan" size={30} color={theme.colors.textDark} />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ),
                    tabBarLabel: () => null, // Hide label for scanner
                }}
            />
            <Tab.Screen
                name="Shop"
                component={ShopScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={24} color={color} />
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="Subs" component={SubscriptionsScreen} />
            <Stack.Screen name="Insights" component={InsightsScreen} />
            <Stack.Screen name="AllProducts" component={AllProductsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Legal" component={LegalScreen} />
            <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
            <Stack.Screen name="PremiumUpgrade" component={PremiumUpgradeScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: theme.colors.accent,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
