import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function MenuScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const lists = [
    { name: "Phim Mới", slug: "phim-moi" },
    { name: "Phim Bộ", slug: "phim-bo" },
    { name: "Phim Lẻ", slug: "phim-le" },
    { name: "TV Shows", slug: "tv-shows" },
    { name: "Hoạt Hình", slug: "hoat-hinh" },
    { name: "Phim Vietsub", slug: "phim-vietsub" },
    { name: "Phim Thuyết Minh", slug: "phim-thuyet-minh" },
    { name: "Phim Lồng Tiếng", slug: "phim-long-tien" },
    { name: "Phim Bộ Đang Chiếu", slug: "phim-bo-dang-chieu" },
    { name: "Phim Bộ Hoàn Thành", slug: "phim-bo-hoan-thanh" },
    { name: "Phim Sắp Chiếu", slug: "phim-sap-chieu" },
    { name: "Subteam", slug: "subteam" },
    { name: "Phim Chiếu Rạp", slug: "phim-chieu-rap" },
  ];

  useEffect(() => {
    Promise.all([
      axios.get("https://ophim1.com/v1/api/the-loai"),
      axios.get("https://ophim1.com/v1/api/quoc-gia")
    ])
      .then(([catRes, countryRes]) => {
        setCategories(catRes.data.data.items || []);
        setCountries(countryRes.data.data.items || []);
      })
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Chọn thể loại</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(item) => {
          setSelectedCategory(item);
          if (item) {
            navigation.navigate("Category", { slug: item.slug, name: item.name });
          }
        }}
      >
        <Picker.Item label="-- Chọn thể loại --" value={null} />
        {categories.map((item) => (
          <Picker.Item key={item._id} label={item.name} value={item} />
        ))}
      </Picker>

      <Text style={styles.header}>🌍 Chọn quốc gia</Text>
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(item) => {
          setSelectedCountry(item);
          if (item) {
            navigation.navigate("Country", { slug: item.slug, name: item.name });
          }
        }}
      >
        <Picker.Item label="-- Chọn quốc gia --" value={null} />
        {countries.map((item) => (
          <Picker.Item key={item._id} label={item.name} value={item} />
        ))}
      </Picker>

      <Text style={styles.header}>📺 Chọn danh mục đặc biệt</Text>
      <Picker
        selectedValue={selectedList}
        onValueChange={(item) => {
          setSelectedList(item);
          if (item) {
            navigation.navigate("ListScreen", { slug: item.slug, name: item.name });
          }
        }}
      >
        <Picker.Item label="-- Chọn danh mục --" value={null} />
        {lists.map((item) => (
          <Picker.Item key={item.slug} label={item.name} value={item} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
});
