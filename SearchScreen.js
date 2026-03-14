import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";

const IMAGE_DOMAIN = "https://img.ophim.live/uploads/movies/";

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}`
      );
      setResults(res.data?.data?.items || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ô nhập từ khóa */}
      <TextInput
        style={styles.input}
        placeholder="Nhập tên phim..."
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Kết quả */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detail", { slug: item.slug })}
          >
            <Image
              source={{ uri: IMAGE_DOMAIN + item.thumb_url }}
              style={styles.poster}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.year} • {item.lang} • {item.quality}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  searchText: { color: "#fff", fontWeight: "bold" },
  card: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
  },
  poster: { width: 100, height: 150 },
  title: { fontSize: 16, fontWeight: "bold" },
  meta: { color: "gray" },
});
