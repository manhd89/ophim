import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";

import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import axios from "axios";

const IMAGE_DOMAIN = "https://img.ophim.live/uploads/movies/";

/* ---------------- VIDEO PLAYER ---------------- */

function VideoPlayer({ uri }) {
  const player = useVideoPlayer(
    uri ? { uri, contentType: "hls" } : null,
    (p) => {
      if (uri) p.play();
    }
  );

  useEvent(player, "playingChange");

  if (!uri) return null;

  return (
    <VideoView
      style={styles.player}
      player={player}
      nativeControls
      fullscreenOptions={{ enable: true }}
      allowsPictureInPicture
    />
  );
}

/* ---------------- DETAIL SCREEN ---------------- */

export default function DetailScreen({ route }) {
  const { slug } = route.params;

  const [movie, setMovie] = useState(null);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [slug]);

  const fetchMovie = async () => {
    try {
      const res = await axios.get(
        `https://ophim1.com/v1/api/phim/${slug}`
      );

      const item = res.data?.data?.item;

      setMovie(item);

      if (item?.episodes?.length) {
        const firstServer = item.episodes[0];

        setServers(item.episodes);
        setSelectedServer(firstServer);

        // KHÔNG chọn tập mặc định
        setSelectedEpisode(null);
      }
    } catch (err) {
      console.log("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Đang tải phim...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy phim</Text>
      </View>
    );
  }

  const cleanContent = movie.content
    ? movie.content.replace(/<[^>]*>/g, "")
    : "";

  /* ---------------- UI ---------------- */

  return (
    <ScrollView style={styles.container}>

      {/* BANNER hoặc PLAYER */}

      {selectedEpisode ? (
        <VideoPlayer
          key={selectedEpisode.slug}
          uri={selectedEpisode.link_m3u8}
        />
      ) : (
        <Image
          source={{
            uri: IMAGE_DOMAIN + movie.thumb_url,
          }}
          style={styles.banner}
        />
      )}

      {/* TITLE */}

      <Text style={styles.title}>{movie.name}</Text>

      <Text style={styles.meta}>
        {movie.year} • {movie.lang} • {movie.time}
      </Text>

      {/* DESCRIPTION */}

      <Text style={styles.desc}>{cleanContent}</Text>

      {/* SERVER */}

      <Text style={styles.section}>Server</Text>

      <FlatList
        horizontal
        data={servers}
        keyExtractor={(item) => item.server_name}
        renderItem={({ item }) => {
          const active =
            selectedServer?.server_name === item.server_name;

          return (
            <TouchableOpacity
              style={[
                styles.button,
                active && styles.buttonActive,
              ]}
              onPress={() => {
                setSelectedServer(item);
                setSelectedEpisode(null);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  active && styles.buttonTextActive,
                ]}
              >
                {item.server_name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* EPISODES */}

      <Text style={styles.section}>Tập</Text>

      {selectedServer && (
        <FlatList
          horizontal
          data={selectedServer.server_data}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => {
            const active =
              selectedEpisode?.slug === item.slug;

            return (
              <TouchableOpacity
                style={[
                  styles.button,
                  active && styles.buttonActive,
                ]}
                onPress={() => setSelectedEpisode(item)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    active && styles.buttonTextActive,
                  ]}
                >
                  Tập {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </ScrollView>
  );
}

/* ---------------- STYLE ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  banner: {
    width: "100%",
    height: 220,
    borderRadius: 8,
  },

  player: {
    width: "100%",
    height: 220,
    backgroundColor: "black",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  meta: {
    color: "gray",
    marginVertical: 5,
  },

  desc: {
    marginVertical: 10,
    lineHeight: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  button: {
    padding: 10,
    backgroundColor: "#ddd",
    margin: 5,
    borderRadius: 6,
  },

  buttonActive: {
    backgroundColor: "#2196F3",
  },

  buttonText: {
    color: "#000",
  },

  buttonTextActive: {
    color: "#fff",
  },
});
