import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from "react-native";
import MapView, {
    Heatmap,
    UrlTile,
    PROVIDER_GOOGLE,
    Marker,
    Callout,
} from "react-native-maps";

const API_URL =
    "https://restcountries.com/v3.1/all?fields=name,region,latlng,population,capital";

export default function DensityMapScreen() {
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    const radius = 45;
    const mapRef = useRef<any>(null);

    useEffect(() => {
        (async () => {
            try {
                let res = await fetch(API_URL);
                let json = await res.json();

                const cleaned = json
                    .filter((c: any) => c.latlng && c.latlng.length === 2)
                    .map((c: any, idx: number) => ({
                        id: idx,
                        name: c.name?.common ?? "",
                        region: c.region ?? "",
                        population: c.population ?? 0,
                        capital: c.capital?.[0] ?? "N/A",
                        coordinates: {
                            latitude: c.latlng[0],
                            longitude: c.latlng[1],
                        },
                    }));

                setCountries(cleaned);
                setLoading(false);
            } catch (e) {
                console.log("Error:", e);
                setLoading(false);
            }
        })();
    }, []);

    const regions = ["All", "Asia", "Europe", "Africa", "Americas", "Oceania"];

    const filtered = filter === "All"
        ? countries
        : countries.filter((c) => c.region === filter);

    const heatmapPoints = filtered.map((c) => ({
        latitude: c.coordinates.latitude,
        longitude: c.coordinates.longitude,
        weight: c.population / 1_000_000,
    }));

    function zoomToRegion(region: string) {
        const regionCenters: any = {
            Asia: { latitude: 34, longitude: 100, zoom: 3 },
            Europe: { latitude: 54, longitude: 15, zoom: 4 },
            Africa: { latitude: 0, longitude: 20, zoom: 3 },
            Americas: { latitude: 15, longitude: -70, zoom: 3 },
            Oceania: { latitude: -20, longitude: 140, zoom: 4 },
            All: { latitude: 20, longitude: 10, zoom: 2 },
        };

        const target = regionCenters[region];

        mapRef.current?.animateCamera(
            { center: target, zoom: target.zoom },
            { duration: 800 }
        );
    }

    if (loading) {
        return (
            <View style={styles.loaderBox}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: "#fff" }}>Loading data…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 20,
                    longitude: 10,
                    latitudeDelta: 100,
                    longitudeDelta: 100,
                }}
            >
                <UrlTile
                    urlTemplate="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    zIndex={-1}
                />

                <Heatmap
                    points={heatmapPoints}
                    radius={radius}
                    opacity={0.8}
                />

                {filtered.map((country) => (
                    <Marker key={country.id} coordinate={country.coordinates}>
                        <Callout>
                            <View style={styles.calloutView}>
                                <Text style={styles.calloutTitle}>{country.name}</Text>
                                <Text>Capital: {country.capital}</Text>
                                <Text>Population: {country.population.toLocaleString()}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Filter Benua */}
            <View style={styles.regionBar}>
                {regions.map((r) => (
                    <Pressable
                        key={r}
                        onPress={() => {
                            setFilter(r);
                            zoomToRegion(r);
                        }}
                        style={[
                            styles.regionButton,
                            filter === r && styles.regionActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.regionText,
                                filter === r && styles.regionTextActive,
                            ]}
                        >
                            {r}
                        </Text>
                    </Pressable>
                ))}
            </View>
        <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Population Density</Text>
                <View style={styles.gradient}>
                    <Text style={styles.legendLabel}>Low</Text>
                    <View style={[styles.gradientBar, { backgroundColor: 'blue' }]} />
                    <View style={[styles.gradientBar, { backgroundColor: 'green' }]} />
                    <View style={[styles.gradientBar, { backgroundColor: 'yellow' }]} />
                    <View style={[styles.gradientBar, { backgroundColor: 'red' }]} />
                    <Text style={styles.legendLabel}>High</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0d1117" },
    map: { ...StyleSheet.absoluteFillObject },

    loaderBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d1117",
    },

    regionBar: {
        position: "absolute",
        top: 50,
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 6,
        borderRadius: 10,
    },

    regionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    regionActive: {
        backgroundColor: "#00aaff",
    },
    regionText: { color: "#fff", fontSize: 12 },
    regionTextActive: { fontWeight: "700" },
    calloutView: {
        width: 150,
    },
    calloutTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
    legendContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
    },
    legendTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gradientBar: {
        width: 20,
        height: 10,
    },
    legendLabel: {
        color: 'white',
        fontSize: 12,
        marginHorizontal: 5,
    },
});
