import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, PanResponder, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { trpc } from "../lib/trpc";

type Pin = { id: string; userId: string; name: string; lat: number; lng: number; rating?: number };

export default function ExploreScreen() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region>({ latitude: 40.73, longitude: -73.935, latitudeDelta: 0.08, longitudeDelta: 0.08 });
  const [selected, setSelected] = useState<Pin | null>(null);

  // Ask for location permission and set region
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion(r => ({ ...r, latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
      }
    })();
  }, []);

  const discovery = trpc.discovery.searchPros.useQuery({
    q,
    center: { lat: region.latitude, lng: region.longitude },
    radiusKm: 25,
  });

  const pins: Pin[] = useMemo(() => {
    const arr = discovery.data ?? [];
    if (arr.length) {
      return arr.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        name: p.user?.name || "Pro",
        lat: p.location?.lat ?? region.latitude + (Math.random()-0.5)*0.1,
        lng: p.location?.lng ?? region.longitude + (Math.random()-0.5)*0.1,
        rating: p.rating ?? 4.8,
      }));
    }
    return [
      { id: "1", userId: "u1", name: "Alex Trainer", lat: region.latitude+0.01, lng: region.longitude-0.01, rating: 4.9 },
      { id: "2", userId: "u2", name: "Nina Coach", lat: region.latitude-0.015, lng: region.longitude+0.02, rating: 4.7 },
      { id: "3", userId: "u3", name: "Chef Marco", lat: region.latitude+0.02, lng: region.longitude+0.01, rating: 4.8 },
    ];
  }, [discovery.data, region]);

  // Draggable sheet
  const sheetY = useRef(new Animated.Value(0)).current;
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
    onPanResponderMove: Animated.event([null, { dy: sheetY }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      const to = g.dy < -40 ? -360 : 0;
      Animated.spring(sheetY, { toValue: to, useNativeDriver: false, friction: 8 }).start();
    }
  }), []);

  return (
    <View style={{ flex: 1, backgroundColor: "#122017" }}>
      <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "rgba(56,224,123,0.3)", backgroundColor: "#122017" }}>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "700", color: "#f6f8f7" }}>Explore</Text>
      </View>

      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
        >
          {pins.map(p => (
            <Marker key={p.id} coordinate={{ latitude: p.lat, longitude: p.lng }} onPress={() => setSelected(p)}>
              <View style={{ backgroundColor: "#38e07b", padding: 6, borderRadius: 999 }} />
            </Marker>
          ))}
        </MapView>

        <View style={{ position: "absolute", left: 12, right: 12, top: 12 }}>
          <View style={{ backgroundColor: "rgba(18,32,23,0.85)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
            <TextInput value={q} onChangeText={setQ} placeholder="Search for Pros or Gyms" placeholderTextColor="rgba(246,248,247,0.7)" style={{ color: "#f6f8f7" }} />
          </View>
        </View>

        <Animated.View
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, transform: [{ translateY: sheetY }] }}
          {...panResponder.panHandlers}
        >
          <View style={{ backgroundColor: "#122017", borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: 12, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: -4 } }}>
            <View style={{ alignItems: "center", paddingVertical: 6 }}>
              <View style={{ width: 36, height: 6, backgroundColor: "#2c3d31", borderRadius: 999 }} />
            </View>
            {selected ? (
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <View style={{ width: 96, height: 96, borderRadius: 10, backgroundColor: "#0d1912" }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#f6f8f7", fontWeight: "700" }}>{selected.name}</Text>
                  <Text style={{ color: "rgba(246,248,247,0.7)", fontSize: 12 }}>★ {selected.rating ?? "—"}</Text>
                  <TouchableOpacity style={{ marginTop: 8, backgroundColor: "#38e07b", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                    <Text style={{ color: "#122017", fontWeight: "700", fontSize: 12 }}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={{ color: "#f6f8f7", fontWeight: "700", marginBottom: 8 }}>{discovery.isLoading ? "Loading…" : "Nearby Pros"}</Text>
                {pins.slice(0,6).map(p => (
                  <TouchableOpacity key={p.id} onPress={()=>setSelected(p)} style={{ paddingVertical: 8 }}>
                    <Text style={{ color: "#f6f8f7" }}>{p.name} • ★ {p.rating ?? "—"}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
