import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet
} from "react-native";
import axios from "axios";

const IMAGE_DOMAIN = "https://img.ophim.live/uploads/movies/";

export default function CategoryScreen({ route, navigation }) {
  const { slug, name } = route.params;
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://ophim1.com/v1/api/the-loai/${slug}?page=${pageNum}`);
      const newItems = res.data.data.items;
      setMovies((prev) => [...prev, ...newItems]);
      const { currentPage, pageRanges } = res.data.data.params.pagination;
      if (currentPage >= pageRanges) setHasMore(false);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thể loại: {name}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detail", { slug: item.slug })}
          >
            <Image source={{ uri: IMAGE_DOMAIN + item.thumb_url }} style={styles.poster} />
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReached={() => setPage((prev) => prev + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { flexDirection: "row", marginBottom: 10 },
  poster: { width: 100, height: 150, borderRadius: 6 },
  title: { marginLeft: 10, fontSize: 16, fontWeight: "bold" },
});
