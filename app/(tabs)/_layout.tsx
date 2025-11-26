import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Foundation } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-heart" size={30} color="pink" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clover-outline" size={30} color="pink" />,
        }}
      />

      <Tabs.Screen
        name="mahasiswa"
        options={{
          title: 'Mahasiswa',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user-graduate" size={25} color="pink" />
        }}
      />

      <Tabs.Screen
        name="location"
        options={{
          title: 'Location',
          tabBarIcon: ({ color }) => <FontAwesome6 name="map-location" size={22} color="pink" />
        }}
      />

      <Tabs.Screen
        name="mapwebview"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Foundation name="map" size={22} color="pink" />
        }}
      />

      <Tabs.Screen
        name="gmap"
        options={{
          title: 'GMap',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={22} color="pink" />
        }}
      />
      

    </Tabs>
  );
}
