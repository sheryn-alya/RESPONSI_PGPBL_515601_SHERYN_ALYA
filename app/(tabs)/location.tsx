import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDh4QSB5jq_hMuqlivhfyrUsj4cHOYmIbE",
    authDomain: "pgpbl2025-20755.firebaseapp.com",
    databaseURL: "https://pgpbl2025-20755-default-rtdb.firebaseio.com",
    projectId: "pgpbl2025-20755",
    storageBucket: "pgpbl2025-20755.firebasestorage.app",
    messagingSenderId: "618473656220",
    appId: "1:618473656220:web:fbe07106354736bdc0c259"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function LokasiScreen() {
    const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // Fungsi untuk membuka Google Maps dengan koordinat tujuan
    const handlePress = (coordinates: string) => {
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    // Ambil data dari Firebase
    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(
            pointsRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const pointsArray = Object.keys(data)
                        .map((key) => ({
                            id: key,
                            ...data[key],
                        }))
                        .filter((item) => item.name && item.coordinates);

                    const formattedData = [
                        {
                            title: '📍 Lokasi Tersimpan',
                            data: pointsArray,
                        },
                    ];
                    setSections(formattedData);
                } else {
                    setSections([]);
                }
                setLoading(false);
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handleDelete = (id: string) => {
        const pointRef = ref(db, `points/${id}`);
        remove(pointRef)
            .then(() => alert('Data berhasil dihapus!'))
            .catch((error) => console.error(error));
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff4d6d" />
            </ThemedView>
        );
    }

    return (
        <View style={styles.page}>
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.itemRow}>
                                <FontAwesome6
                                    name="location-dot"
                                    size={20}
                                    color="#ff4d6d"
                                    style={{ marginRight: 8 }}
                                />
                                <View style={{ flex: 1 }}>
                                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                    <ThemedText style={styles.itemCoords}>{item.coordinates}</ThemedText>
                                    {item.accuration && (
                                        <ThemedText style={styles.itemAcc}>
                                            🎯 Akurasi: {item.accuration}
                                        </ThemedText>
                                    )}
                                </View>
                            </View>

                            {/* Tombol aksi */}
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={styles.mapButton}
                                    onPress={() => handlePress(item.coordinates)}
                                >
                                    <FontAwesome6 name="map-location-dot" size={16} color="white" />
                                    <ThemedText style={styles.actionText}>Lihat di Maps</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <FontAwesome6 name="trash" size={16} color="white" />
                                    <ThemedText style={styles.deleteText}>Hapus</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.headerRow}>
                            <ThemedText style={styles.header}>{title}</ThemedText>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => router.push('/forminputlocation')}
                            >
                                <FontAwesome6 name="plus" size={14} color="white" />
                                <ThemedText style={styles.addText}>Tambah</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#ff4d6d']}
                        />
                    }
                />
            ) : (
                <ThemedView style={styles.noData}>
                    <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
                    <TouchableOpacity
                        style={styles.addButtonEmpty}
                        onPress={() => router.push('/forminputlocation')}
                    >
                        <FontAwesome6 name="plus" size={14} color="white" />
                        <ThemedText style={styles.addText}>Tambah Lokasi</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffb6c1',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 10,
        shadowColor: '#ffb6c1',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4d6d',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addButtonEmpty: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4d6d',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 15,
    },
    addText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
    },
    item: {
        backgroundColor: '#ffe4ec',
        padding: 14,
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ff8fb1',
        shadowColor: '#ffcad4',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ff4d6d',
    },
    itemCoords: {
        fontSize: 14,
        color: '#333',
    },
    itemAcc: {
        fontSize: 13,
        color: '#777',
        marginTop: 3,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    actionText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 13,
        fontWeight: '600',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4d6d',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    deleteText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 13,
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
