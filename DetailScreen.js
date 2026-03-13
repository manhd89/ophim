import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import axios from "axios";

function VideoPlayer({ uri }) {
  const player = useVideoPlayer(
    uri ? { uri, contentType: "hls" } : null,
    (p) => {
      if (uri) p.play();
    }
  );

  useEvent(player, "playingChange");

  return (
    <VideoView
      style={{ flex: 1, minHeight: 220 }}
      player={player}
      nativeControls
      fullscreenOptions={{ enable: true }}
      allowsPictureInPicture
    />
  );
}

export default function DetailScreen({ route }) {
  const { slug } = route.params;
  const [movie, setMovie] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://ophim1.com/v1/api/phim/${slug}`)
      .then((res) => {
        const data = res.data.data.item;
        setMovie(data);
        // chọn server đầu tiên và tập đầu tiên mặc định
        const firstServer = data.episodes[0];
        setSelectedServer(firstServer);
        setSelectedEpisode(firstServer.server_data[0]);
      })
      .catch((err) => {
        console.error("Error fetching movie detail:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải chi tiết phim...</Text>
      </View>
    );
  }

  if (!movie) return <Text>Không tìm thấy phim</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", margin: 10 }}>
        {movie.name}
      </Text>
      <Text style={{ marginHorizontal: 10, color: "gray" }}>
        {movie.year} • {movie.lang}
      </Text>
      <Text style={{ marginHorizontal: 10, marginVertical: 5 }}>
        {movie.content.replace(/<[^>]+>/g, "")}
      </Text>

      {/* Danh sách server */}
      <FlatList
        data={movie.episodes}
        keyExtractor={(srv) => srv.server_name}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              margin: 5,
              backgroundColor:
                selectedServer?.server_name === item.server_name
                  ? "#2196F3"
                  : "#ddd",
              borderRadius: 5,
            }}
            onPress={() => {
              setSelectedServer(item);
              setSelectedEpisode(item.server_data[0]);
            }}
          >
            <Text
              style={{
                color:
                  selectedServer?.server_name === item.server_name
                    ? "#fff"
                    : "#000",
              }}
            >
              {item.server_name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Danh sách tập */}
      {selectedServer && (
        <FlatList
          data={selectedServer.server_data}
          keyExtractor={(ep) => ep.slug}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 10,
                margin: 5,
                backgroundColor:
                  selectedEpisode?.slug === item.slug ? "#2196F3" : "#ddd",
                borderRadius: 5,
              }}
              onPress={() => setSelectedEpisode(item)}
            >
              <Text
                style={{
                  color:
                    selectedEpisode?.slug === item.slug ? "#fff" : "#000",
                }}
              >
                Tập {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Player với expo-video */}
      {selectedEpisode?.link_m3u8 && (
        <VideoPlayer key={selectedEpisode.slug} uri={selectedEpisode.link_m3u8} />
      )}
    </View>
  );
}
