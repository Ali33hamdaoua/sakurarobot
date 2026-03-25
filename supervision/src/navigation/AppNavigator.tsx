import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MissionsScreen } from '../screens/MissionsScreen';
import { ManualControlScreen } from '../screens/ManualControlScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.mediumBlue,
          tabBarInactiveTintColor: COLORS.gray,
          headerStyle: { backgroundColor: COLORS.darkBlue },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Supervision' }}
        />
        <Tab.Screen
          name="Missions"
          component={MissionsScreen}
          options={{ title: 'Missions' }}
        />
        <Tab.Screen
          name="ManualControl"
          component={ManualControlScreen}
          options={{ title: 'Manuel' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Parametres' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
