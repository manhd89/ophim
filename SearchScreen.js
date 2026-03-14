import React, { useState } from "react";
import {
  View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Text
} from "react-native";
import axios from "axios";

const IMAGE_DOMAIN = "https://img.ophim.live/uploads/movies/";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // gọi API mỗi khi gõ từ khóa
  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (!text) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(text)}&page=1`
      );
      setSuggestions(res.data.data.items || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên phim..."
        value={query}
        onChangeText={fetchSuggestions}
      />

      {loading && <ActivityIndicator size="small" />}

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detail", { slug: item.slug })}
          >
            <Image source={{ uri: IMAGE_DOMAIN + item.thumb_url }} style={styles.poster} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.info}>{item.year} • {item.quality}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 6 },
  card: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  poster: { width: 60, height: 90, borderRadius: 6 },
  title: { fontSize: 14, fontWeight: "bold" },
  info: { fontSize: 12, color: "#666" },
});
