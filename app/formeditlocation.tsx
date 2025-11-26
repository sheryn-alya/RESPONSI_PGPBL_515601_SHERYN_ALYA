import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update } from "firebase/database";

import { useLocalSearchParams, useRouter } from 'expo-router';

const App = () => {

    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, name: initialName, coordinates: initialCoordinates, accuration: initialAccuration } = params;

    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialCoordinates);
    const [accuration, setAccuration] = useState(initialAccuration);

    // Ambil lokasi pengguna
    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const coords = location.coords.latitude + ',' + location.coords.longitude;
        setLocation(coords);
        setAccuration(location.coords.accuracy + ' m');
        Alert.alert("Berhasil", "Lokasi saat ini berhasil didapatkan.");
    };

    // Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyDh4QSB5jq_hMuqlivhfyrUsj4cHOYmIbE",
        authDomain: "pgpbl2025-20755.firebaseapp.com",
        databaseURL: "https://pgpbl2025-20755-default-rtdb.firebaseio.com",
        projectId: "pgpbl2025-20755",
        storageBucket: "pgpbl2025-20755.firebasestorage.app",
        messagingSenderId: "618473656220",
        appId: "1:618473656220:web:fbe07106354736bdc0c259"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Alert success update
    const createOneButtonAlert = (callback:() => void) =>
        Alert.alert('Success', 'Berhasil memperbarui data', [
            { text: 'OK', onPress: callback },
        ]);


    // Handle update
    const handleUpdate = () => {
        if (!id) {
            Alert.alert("Error", "ID lokasi tidak ditemukan.");
            return;
        }
        const pointRef = ref(db, `points/${id}`);
        update(pointRef, {
            name: name,
            coordinates: location,
            accuration: accuration,
        }).then(() => {
            createOneButtonAlert(() => {
                router.back();
            });
        }).catch((e) => {
            console.error("Error updating document: ", e);
            Alert.alert("Error", "Gagal memperbarui data");
        });
    };



    return (
        <SafeAreaProvider style={styles.page}>
            <SafeAreaView>
                <Stack.Screen options={{ title: 'Form Edit Location' }} />
                <View style={styles.leftSection}>
                    <Text style={styles.header}>✏️ Form Edit Lokasi</Text>

                    <Text style={styles.inputTitle}>Nama</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Isikan nama objek'
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.inputTitle}>Koordinat</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Isikan koordinat (contoh: -6.200000,106.816666)"
                        value={location}
                        onChangeText={setLocation}
                    />

                    <Text style={styles.inputTitle}>Accuration</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Isikan accuration (contoh: 5 meter)"
                        value={accuration}
                        onChangeText={setAccuration}
                    />

                    <View style={styles.button}>
                        <Button
                            title="Get Current Location"
                            color="#ff8fb1" // pink lembut
                            onPress={getCoordinates}
                        />
                    </View>

                    <View style={styles.button}>
                        <Button
                            title="Save"
                            color="#ff4d6d" // pink tua
                            onPress={handleUpdate}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white', // putih dasar
    },
    leftSection: {
        padding: 24,
        alignItems: 'flex-start', // di kiri
        borderLeftWidth: 6,
        borderLeftColor: '#ffb6c1', // aksen pink pastel di sisi kiri
        height: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ff4d6d',
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ffc0cb',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff0f5',
    },
    inputTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#ff4d6d',
    },
    button: {
        marginTop: 15,
        width: '100%',
    },
});

export default App;
