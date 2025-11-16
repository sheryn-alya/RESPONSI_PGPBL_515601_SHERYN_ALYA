import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#fff' }}
      headerImage={
        <IconSymbol
          size={300}
          color="#ffe4ec"
          name="map.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            color: '#ff4d6d',
          }}>
          📍 Explore Lokasi
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.descText}>
        Temukan dan tambahkan lokasi menarik di sekitar kamu 💕
      </ThemedText>

      <Collapsible title="Tentang Aplikasi">
        <ThemedText>
          Aplikasi ini memungkinkan kamu menyimpan, mengelola, dan menelusuri titik lokasi
          menggunakan database realtime Firebase. Desain ini bertema pink lembut agar tampak
          manis dan nyaman digunakan 🌸
        </ThemedText>
      </Collapsible>

      <Collapsible title="Fitur">
        <ThemedText>✨ Simpan lokasi secara realtime.</ThemedText>
        <ThemedText>✨ Lihat semua titik yang tersimpan di peta.</ThemedText>
        <ThemedText>✨ Hapus atau tambahkan lokasi dengan cepat.</ThemedText>
      </Collapsible>

      <Collapsible title="Dokumentasi">
        <ExternalLink href="https://docs.expo.dev">
          <ThemedText type="link" style={{ color: '#ff4d6d' }}>
            Pelajari lebih lanjut di dokumentasi Expo.
          </ThemedText>
        </ExternalLink>
      </Collapsible>

      {/* FAB (Floating Action Button) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/forminput')} // 👈 arahkan ke halaman FormInput
      >
        <IconSymbol
          size={30}
          color="#000000ff"
          name="add.circle.fill"
        />
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#ffb6c1',
    bottom: -80,
    left: -30,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  descText: {
    color: '#ffb6c1',
    fontSize: 15,
    marginBottom: 15,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: '#ffb6c1',
    borderRadius: 28,
    elevation: 8,
    shadowColor: 'rgba(255, 255, 255, 1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
