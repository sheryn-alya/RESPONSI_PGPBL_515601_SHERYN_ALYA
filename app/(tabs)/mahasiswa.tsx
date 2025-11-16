import React from 'react';
import { StyleSheet, Text, View, SectionList, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // install: expo install @expo/vector-icons

const DATA = [
    {
        title: 'Kelas A',
        data: ['Sheryn', 'Nadine', 'Dias', 'Adinda', 'Fauzil', 'Ammar', 'Agung', 
                'Rico', 'Arin', 'Fildzah', 'Risma'],
    },
    {
        title: 'Asisten PGPBL',
        data: ['Saiful', 'Rini', 'Hayyu'],
    },
    {
        title: 'Dosen',
        data: ['Bapak Ansori'],
    },
];

const App = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <FontAwesome5 name="user-graduate" size={16} color="#d63384" style={styles.icon} />
                        <Text style={styles.title}>{item}</Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // latar putih polos
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        color: '#d63384', // pink elegan
        backgroundColor: '#fff',
        paddingVertical: 8,
        marginLeft: 10, // jarak kiri pada judul
        marginTop: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fde6ee', // pink pastel lembut
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginVertical: 4,
        marginHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 15,
        color: '#333', // teks netral
    },
});

export default App;
