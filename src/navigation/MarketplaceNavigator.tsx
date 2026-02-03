import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import MarketplaceHomeScreen from '../screens/marketplace/MarketplaceHomeScreen';
import ProductDetailsScreen from '../screens/marketplace/ProductDetailsScreen';
import CartScreen from '../screens/marketplace/CartScreen';
import ShippingScreen from '../screens/marketplace/ShippingScreen';
import PaymentScreen from '../screens/marketplace/PaymentScreen';
import OrdersScreen from '../screens/marketplace/OrdersScreen';
import OrderDetailsScreen from '../screens/marketplace/OrderDetailsScreen';
import TrackOrderScreen from '../screens/marketplace/TrackOrderScreen';

const Stack = createNativeStackNavigator();

const MarketplaceNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="MarketplaceHome" component={MarketplaceHomeScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Shipping" component={ShippingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        </Stack.Navigator>
    );
};

export default MarketplaceNavigator;
