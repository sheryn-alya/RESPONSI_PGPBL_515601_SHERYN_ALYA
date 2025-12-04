import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BerandaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>Selamat Datang di Aplikasi Populasi Dunia</ThemedText>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=2070&auto=format&fit=crop' }} 
          style={styles.image} 
        />
        <ThemedText style={styles.paragraph}>
          Populasi dunia adalah jumlah total manusia yang hidup di planet Bumi. Pada saat ini, populasi dunia telah melampaui 8 miliar jiwa dan terus bertambah setiap detiknya.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Pertumbuhan populasi dipengaruhi oleh berbagai faktor, termasuk angka kelahiran, angka kematian, dan migrasi. Memahami dinamika populasi sangat penting untuk mengatasi berbagai tantangan global, seperti perubahan iklim, ketahanan pangan, dan perencanaan kota.
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Fitur Aplikasi</ThemedText>
        <ThemedText style={styles.featureText}>
          - <ThemedText style={styles.bold}>Peta Heatmap:</ThemedText> Visualisasikan kepadatan populasi di seluruh dunia.
        </ThemedText>
        <ThemedText style={styles.featureText}>
          - <ThemedText style={styles.bold}>Data Interaktif:</ThemedText> Klik pada negara untuk melihat nama, ibukota, dan simulasi data populasi yang terus bertambah.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Silakan buka tab "Population Map" untuk memulai eksplorasi Anda!
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  }
});
