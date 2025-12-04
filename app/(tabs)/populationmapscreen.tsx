import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import MapView, {
  Marker,
  Heatmap,
  UrlTile,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useLocalSearchParams } from "expo-router";

const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,capital,latlng,population";

function formatPopulation(n: number) {
  return n?.toLocaleString("id-ID");
}

export default function PopulationMapScreen() {
  const { countryName } = useLocalSearchParams();
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ------------- HIGHLIGHT GLOW ANIMASI -------------
  const glowScale = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const mapRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      try {
        let res = await fetch(API_URL);
        let json = await res.json();

        const cleaned = json
          .filter((c: any) => c.latlng && c.latlng.length === 2)
          .map((c: any, idx: number) => ({
            id: idx,
            name: c.name?.common ?? "",
            capital: c.capital ? c.capital[0] : "-",
            population: c.population ?? 0,
            coordinates: {
              latitude: c.latlng[0],
              longitude: c.latlng[1],
            },
          }));

        setCountries(cleaned);
        setLoading(false);

        const indonesia = cleaned.find(
          (x: { name: string; }) => x.name.toLowerCase() === "indonesia"
        );

        if (indonesia && !countryName) {
          mapRef.current?.animateCamera(
            { center: indonesia.coordinates, zoom: 5 },
            { duration: 900 }
          );
        }

        if (countryName) {
          const target = cleaned.find(
            (x: { name: string; }) => x.name.toLowerCase() === String(countryName).toLowerCase()
          );

          if (target) {
            setSelected(target);

            setTimeout(() => {
              mapRef.current?.animateCamera(
                {
                  center: target.coordinates,
                  zoom: 6,
                },
                { duration: 900 }
              );
            }, 300);

            // MULAI ANIMASI HIGHLIGHT
            startGlowAnimation();
          }
        }
      } catch (e) {
        console.log("Fetch gagal:", e);
        setLoading(false);
      }
    }

    load();
  }, [countryName]);

  // ------------ ANIMASI UNTUK GLOW -------------
  function startGlowAnimation() {
    glowScale.setValue(0.3);
    glowOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(glowScale, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function onPressCountry(country: any) {
    setSelected(country);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    mapRef.current?.animateCamera(
      { center: country.coordinates, zoom: 6 },
      { duration: 600 }
    );

    // Glow animasi muncul setiap marker ditekan
    startGlowAnimation();
  }

  // ------------ ZOOM BUTTON FUNCTION ------------
  function zoomIn() {
    mapRef.current?.getCamera().then((cam: any) => {
      mapRef.current?.animateCamera({ zoom: cam.zoom + 1 }, { duration: 200 });
    });
  }

  function zoomOut() {
    mapRef.current?.getCamera().then((cam: any) => {
      mapRef.current?.animateCamera({ zoom: cam.zoom - 1 }, { duration: 200 });
    });
  }

  const heatmapPoints = countries.map((c) => ({
    latitude: c.coordinates.latitude,
    longitude: c.coordinates.longitude,
    weight: c.population / 1_000_000,
  }));

  if (loading) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading data…</Text>
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
          latitude: -2.5,
          longitude: 118,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        <UrlTile
          urlTemplate="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          zIndex={-1}
        />

        <Heatmap points={heatmapPoints} radius={45} opacity={0.8} />

        {countries.map((c) => (
          <Marker
            key={c.id}
            coordinate={c.coordinates}
            pinColor="red"
            onPress={() => onPressCountry(c)}
          />
        ))}
      </MapView>

      {/* GLOW HIGHLIGHT DI ATAS PETA */}
      {selected && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
              top: "50%",
              left: "50%",
              marginLeft: -60,
              marginTop: -60,
            },
          ]}
        />
      )}

      {/* INFO BOX */}
      {selected && (
        <Animated.View style={[styles.infoBox, { opacity: fadeAnim }]}>
          <Text style={styles.infoTitle}>{selected.name}</Text>
          <Text style={styles.infoSub}>Ibu Kota: {selected.capital}</Text>
          <Text style={styles.infoSub}>
            Populasi: {formatPopulation(selected.population)}
          </Text>
        </Animated.View>
      )}

      {/* ZOOM BUTTONS */}
      <View style={styles.zoomContainer}>
        <Pressable style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomText}>＋</Text>
        </Pressable>

        <Pressable style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomText}>－</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  map: { ...StyleSheet.absoluteFillObject },

  loaderBox: {
    flex: 1,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
  },

  infoBox: {
    position: "absolute",
    top: "35%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 14,
    borderRadius: 10,
  },

  infoTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  infoSub: { color: "#ccc", fontSize: 13 },

  // ------------- ZOOM STYLE -------------
  zoomContainer: {
    position: "absolute",
    right: 15,
    bottom: 140,
    alignItems: "center",
    gap: 10,
  },
  zoomButton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  zoomText: {
    fontSize: 28,
    color: "#000",
    fontWeight: "600",
    marginTop: -2,
  },

  // ------------- GLOW BLUE HIGHLIGHT -------------
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: "rgba(0,122,255,0.35)",
  },
});
