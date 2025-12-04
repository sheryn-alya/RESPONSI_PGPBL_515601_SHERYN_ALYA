import { useEffect, useState, useRef } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const POPULATION_GROWTH_PER_SECOND = 2.5; // More accurate estimate
const STORAGE_KEY = "worldStatsData";

export default function WorldStatsScreen() {
    // We store the original fetched country data separately to have a stable baseline
    const [originalCountries, setOriginalCountries] = useState<any[]>([]);
    // This state will hold the dynamically calculated population
    const [currentCountries, setCurrentCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const appState = useRef(AppState.currentState);

    const calculatePopulation = (baseCountries: any[], initialTimestamp: number) => {
        const elapsedSeconds = (Date.now() - initialTimestamp) / 1000;
        const totalGrowth = elapsedSeconds * POPULATION_GROWTH_PER_SECOND;
        const totalInitialPopulation = baseCountries.reduce((sum, c) => sum + c.population, 0);

        if (totalInitialPopulation === 0) {
            return baseCountries;
        }

        const updatedCountries = baseCountries.map(country => {
            const countryGrowth = (country.population / totalInitialPopulation) * totalGrowth;
            return {
                ...country,
                population: country.population + countryGrowth,
            };
        });
        return updatedCountries;
    };

    const loadData = async () => {
        try {
            const storedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const { countries, timestamp } = JSON.parse(storedData);
                setOriginalCountries(countries);
                const calculated = calculatePopulation(countries, timestamp);
                setCurrentCountries(calculated);
            } else {
                let res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=name,region,population"
                );
                let json = await res.json();
                const cleaned = json.map((c: any) => ({
                    name: c.name.common,
                    region: c.region,
                    population: c.population ?? 0,
                }));
                const dataToStore = { countries: cleaned, timestamp: Date.now() };
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
                setOriginalCountries(cleaned);
                setCurrentCountries(cleaned); // Start with the fetched data
            }
        } catch (error) {
            console.error("Failed to load data:", error);
            // Optionally, handle the error by trying to fetch fresh data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // App has come to the foreground, recalculate population
                loadData();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (currentCountries.length > 0) {
            const interval = setInterval(() => {
                // Simple incremental update for the live view
                const totalPop = currentCountries.reduce((sum, c) => sum + c.population, 0);
                setCurrentCountries(prevCountries =>
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
    }, [currentCountries.length]); // Depend on length to start the interval once

    if (loading)
        return (
            <View style={styles.loading}>
                <Text style={{ color: "#fff" }}>Loading data…</Text>
            </View>
        );

    const totalPop = currentCountries.reduce((sum, c) => sum + c.population, 0);
    
    const top10 = [...currentCountries]
        .sort((a, b) => b.population - a.population)
        .slice(0, 10);

    const continents = ["Asia", "Europe", "Africa", "Americas", "Oceania"];
    const popByCont = continents.map((r) => ({
        name: r,
        population: currentCountries
            .filter((c) => c.region === r)
            .reduce((sum, c) => sum + c.population, 0),
    }));

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Statistik Dunia</Text>

            {/* Total Populasi */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Populasi Dunia (Real-time)</Text>
                <Text style={styles.bigNumber}>
                    {Math.round(totalPop).toLocaleString("id-ID")}
                </Text>
            </View>

            {/* Populasi per Benua */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Populasi per Benua (Real-time)</Text>
                {popByCont.map((c) => (
                    <View key={c.name} style={styles.listItem}>
                        <Text style={styles.listText}>{c.name}</Text>
                        <Text style={styles.listText}>
                            {Math.round(c.population).toLocaleString("id-ID")}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Top 10 Negara Terpadat */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Top 10 Negara Terpadat (Real-time)</Text>
                {top10.map((c, index) => (
                    <View key={c.name} style={styles.listItem}>
                        <Text style={styles.listText}>{index + 1}. {c.name}</Text>
                        <Text style={styles.listText}>
                            {Math.round(c.population).toLocaleString("id-ID")}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0d1117", padding: 10 },
    loading: {
        flex: 1,
        backgroundColor: "#0d1117",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginVertical: 10,
        alignSelf: "center",
    },

    card: {
        backgroundColor: "#1a1f25",
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
    },
    cardTitle: { color: "#fff", fontSize: 16, marginBottom: 10 },
    bigNumber: {
        color: "#00aaff",
        fontSize: 28,
        fontWeight: "700",
        alignSelf: "center",
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    listText: {
        color: "#fff",
        fontSize: 14,
    },
});
