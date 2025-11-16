import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { HelloWave } from '@/components/hello-wave';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* HEADER LOGO */}
      <Image
        source={require('@/assets/images/logo-biru-ugm.png')}
        style={styles.logo}
      />

      {/* JUDUL */}
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          INTRODUCE
        </ThemedText>
        <HelloWave />
      </View>

      {/* DATA DIRI */}
      <View style={styles.content}>
        <ThemedText style={styles.label}>Nama</ThemedText>
        <ThemedText style={styles.value}>Sheryn Alya Azzahra</ThemedText>

        <ThemedText style={styles.label}>NIM</ThemedText>
        <ThemedText style={styles.value}>515601</ThemedText>

        <ThemedText style={styles.label}>Kelas 🎓</ThemedText>
        <ThemedText style={styles.value}>SIG A</ThemedText>

        <ThemedText style={styles.label}>Mata Kuliah</ThemedText>
        <ThemedText style={styles.value}>
          Praktikum Perangkat Geospasial Bergerak Lanjut (React Native & Expo)
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 25,
    borderLeftWidth: 12,        // efek garis pink di sisi kiri
    borderLeftColor: '#f2b6cf', // pink lembut elegan
  },
  logo: {
    height: 130,
    width: 130,
    marginBottom: 15,
    marginLeft: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    color: '#d97fa4',
    fontWeight: 'bold',
    fontSize: 30,
  },
  content: {
    marginTop: 10,
    width: '100%',
  },
  label: {
    color: '#d97fa4',
    fontWeight: '600',
    marginBottom: 3,
    marginTop: 10,
    fontSize: 16,
  },
  value: {
    color: '#333',
    fontSize: 16,
    marginLeft: 15,
  },
});
