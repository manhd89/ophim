import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://ophim1.com/v1/api/home")
      .then(res => {
        setMovies(res.data.data.items); // lấy danh sách phim từ API
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải phim...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flex: 1, margin: 5 }}
            onPress={() => navigation.navigate("Detail", { slug: item.slug })}
          >
            <Image
              source={{ uri: `https://img.ophim.live/uploads/movies/${item.thumb_url}` }}
              style={{ width: "100%", height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Text style={{ marginTop: 5, fontWeight: "bold" }} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={{ color: "gray" }}>{item.year} • {item.lang}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
