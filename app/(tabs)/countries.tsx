import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const POPULATION_GROWTH_PER_SECOND = 2.5;

function formatPopulation(n: number) {
    try {
        return Math.round(n).toLocaleString('id-ID');
    } catch (e) {
        return String(Math.round(n));
    }
}

export default function CountriesScreen() {
    const router = useRouter();

    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        (async () => {
            try {
                let res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=name,capital,population,cca3"
                );
                let json = await res.json();
                const cleaned = json.map((c: any) => ({
                    id: c.cca3,
                    name: c.name.common,
                    capital: c.capital?.[0] ?? 'N/A',
                    population: c.population ?? 0,
                })).sort((a: { population: number; }, b: { population: number; }) => b.population - a.population);
                setCountries(cleaned);
                setLoading(false);
            } catch {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (countries.length > 0) {
            const interval = setInterval(() => {
                const totalPop = countries.reduce((sum, c) => sum + c.population, 0);

                setCountries(prevCountries =>
                    prevCountries.map(country => {
                        const growth = (country.population / totalPop) * POPULATION_GROWTH_PER_SECOND;
                        return {
                            ...country,
                            population: country.population + growth,
                        };
                    })
                );
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [countries]);

    const data = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return countries;

        return countries.filter(c =>
            c.name.toLowerCase().includes(q) ||
            (c.capital || '').toLowerCase().includes(q)
        );
    }, [countries, query]);

    function onPressCountry(country: any) {
        Alert.alert(
            'Konfirmasi',
            `Tampilkan ${country.name} (${formatPopulation(country.population)}) pada peta?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Tampilkan',
                    onPress: () => {
                        router.push({
                            pathname: '/populationmapscreen',
                            params: { countryName: country.name }
                        });

                    }
                }
            ]
        );
    }

    const renderItem = ({ item }: { item: any }) => (
        <Pressable onPress={() => onPressCountry(item)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <View style={styles.left}>
                <ThemedText type="subtitle" style={styles.name}>{item.name}</ThemedText>
                <Text style={styles.capital}>Ibu kota: {item.capital}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.population}>{formatPopulation(item.population)}</Text>
            </View>
        </Pressable>
    );

    if (loading) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading data...</Text>
            </ThemedView>
        )
    }

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Daftar Negara (Real-time)' }} />

            <View style={styles.searchBox}>
                <TextInput
                    placeholder="Cari negara atau ibu kota..."
                    placeholderTextColor="#9AA0A6"
                    value={query}
                    onChangeText={setQuery}
                    style={styles.searchInput}
                />
                {query.length > 0 && (
                    <Pressable onPress={() => setQuery('')} style={styles.clearButton}>
                        <Text style={styles.clearText}>Batal</Text>
                    </Pressable>
                )}
            </View>

            <FlatList
                data={data}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    list: {
        padding: 16,
        paddingBottom: 40
    },

    searchBox: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F5F6FA',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: 42,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E6E9EE',
        fontSize: 14,
        color: '#222',
    },
    clearButton: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    clearText: { color: '#FF4D6D', fontWeight: '700' },

    item: {
        padding: 18,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        // Soft, modern shadow
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },

    left: { flex: 1 },
    right: {
        marginLeft: 15,
        alignItems: 'flex-end',
    },

    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1D1D1D'
    },

    capital: {
        fontSize: 13,
        color: '#6F7480',
        marginTop: 4
    },

    population: {
        fontWeight: '700',
        fontSize: 15,
        color: '#2D5AF0'
    },
});

