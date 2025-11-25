import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Insights') {
                        iconName = focused ? 'bulb' : 'bulb-outline';
                    } else if (route.name === 'Transactions') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Subscriptions') {
                        iconName = focused ? 'card' : 'card-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.colors.backgroundCard,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    ...theme.shadows.large,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="Subscriptions" component={SubscriptionsScreen} />
        </Tab.Navigator>
    );
};
