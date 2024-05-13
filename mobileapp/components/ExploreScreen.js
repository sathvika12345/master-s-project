import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  Button,
  Linking,
} from "react-native";
import { Video, ResizeMode, Audio } from "expo-av";
import { Header } from "@react-navigation/stack";
import api from "../apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LikeImage from "../assets/svgs/like.svg";

const ExploreScreen = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = React.useState({});

  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid: true,
    staysActiveInBackground: false,
    playThroughEarpieceAndroid: true,
  });

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((userid) => {
        console.log("Retrieved userID:", userid);
        setUserId(userid);
      })
      .catch((error) => {
        console.error("Error retrieving UserID:", error);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("role")
      .then((role) => {
        console.log("Retrieved user Role:", role);
        setRole(role);
      })
      .catch((error) => {
        console.error("Error retrieving UserID:", error);
      });
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("getting userId to get projects", userId);
      if (userId && role=='student') {
        try {
          const projects = await api.getProjectsByUserId(userId);
          console.log("getting projects by fetch", projects.data);
          setProjects(projects.data);
          console.log("projects", projects.data[0].likeCount);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }else if(userId &&( role=='admin' || role=="reviewer")){
        try {
          const projects = await api.getProjects();
          console.log("getting projects by fetch all", projects.data);
          setProjects(projects.data);
          console.log("projects", projects.data[0].likeCount);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    fetchProjects();
  }, [userId,role]);

  const handleLogout = () => {
    // Navigate to the login screen
    navigation.navigate("Login");
  };

  const handleProjectPress = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  console.log("projects", selectedProject);

  const handleLike = async (projectId, userId) => {
    console.log("projectId", projectId);
    console.log("userId", userId);
    try {
      const response = await api.likeProject(projectId, userId);
      console.log("response", response.response.data.error);
      const projects = await api.getProjectsByUserId(userId);
      console.log("getting projects by fetch", projects.data);
      setProjects(projects.data);
    } catch (error) {
      if (
        error.response.status === 500 &&
        error.response.data.error ===
          "Error liking project: User has already liked the post."
      ) {
        console.log("User has already liked the post");
      } else {
        console.error("Error liking project:", error.response.data.error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}
    >
      <TouchableOpacity
        style={styles.projectItem}
        onPress={() => {
          handleProjectPress(item);
          console.log("itemItemConsoleLog", item);
        }}
      >
        <Text style={styles.projectName}>{item.projectName}</Text>
        <Text>{item.status}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginRight: 10,
        }}
        onPress={() => {
          console.log("Like button pressed");
          console.log("PorjectID", item.projectId);
          console.log("userId", item?.User?.userId);
          console.log("item", item.likeCount);
          handleLike(item.projectId, item?.User?.userId);
        }}
      >
        <View style={styles.buttonImage}>
          <LikeImage width={30} height={30} />
        </View>
        <Text style={{ fontSize: 16 }}>{item.likeCount}</Text>
      </TouchableOpacity>
    </View>
  );

  const CustomHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={require("./logo2.png")} style={styles.logo} />
        </TouchableOpacity>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => navigation.navigate("About")}>
            <Text style={styles.tabText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
            <Text style={styles.tabText}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.tabText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getFileExtension = (filename) => {
    return filename?.split(".").pop()?.toLowerCase();
  };

  const fileExtension = getFileExtension(selectedProject?.projectAssetUrl);

  const renderMedia = () => {
    if (!fileExtension) return null;

    if (
      fileExtension === "mp4" ||
      fileExtension === "mov" ||
      fileExtension === "avi"
    ) {
      return (
        <View style={styles.container}>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: selectedProject?.projectAssetUrl,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          <View style={styles.buttons}>
            <Button
              title={status.isPlaying ? "Pause" : "Play"}
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
            />
          </View>
        </View>
      );
    } else if (
      fileExtension == "jpg" ||
      fileExtension == "jpeg" ||
      fileExtension == "png"
    ) {
      return (
        <Image
          source={{ uri: selectedProject?.projectAssetUrl }}
          style={{ width: "100%", height: 200, borderRadius: 8 }}
        />
      );
    } else if (fileExtension === "pdf") {
      return(
        <Button
          title="Open PDF"
          onPress={() => {
            Linking.openURL(selectedProject?.projectAssetUrl);
          }}
        />
      )
    } else {
      return null;
    }
  };

  return (
    <ImageBackground
      source={require("./bckend.avif")}
      style={styles.background}
    >
      <View style={styles.container}>
        <CustomHeader />

        <Image source={require("./explore.jpeg")} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.text, styles.purpleText]}>Explore</Text>
          <Text style={styles.title}>Projects</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("UploadProject")}
          >
            <Text style={[styles.text, styles.purpleText]}>
              Upload Project Here
            </Text>
          </TouchableOpacity>

          <FlatList
            data={projects}
            renderItem={renderItem}
            keyExtractor={(item) => item.projectId.toString()}
          />

          {/* Modal for displaying project details */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.title}>
                Project Name: {selectedProject?.projectName}
              </Text>
              <Text>Project ID: {selectedProject?.projectId}</Text>
              <Text style={styles.text}>
                Submitted By:{" "}
                {selectedProject?.User.displayPictureUrl && (
                  <Image
                    source={{ uri: selectedProject?.User?.displayPictureUrl }}
                    style={styles.avatar}
                  />
                )}{" "}
                &nbsp;&nbsp;{selectedProject?.User.name}
              </Text>
              <Button
                title="Download Abstract File"
                onPress={() => Linking.openURL(selectedProject?.abstractUrl)}
              />
              {/* Display other project details */}
              <Text style={styles.text}>
                {selectedProject?.projectDescription}
              </Text>
              {selectedProject?.projectAssetUrl && renderMedia()}
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: Header.HEIGHT,
    backgroundColor: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  logo: {
    width: 65,
    height: 50,
    borderRadius: 10,
  },
  tabs: {
    flexDirection: "row",
  },
  tabText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  purpleText: {
    color: "#800080",
    fontWeight: "bold",
    fontSize: 22,
  },
  buttonImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  text: {
    // marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 5,
    marginHorizontal: 5,
    textAlign: "justify",
  },
  uploadButton: {
    backgroundColor: "#800080",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    margin: 20,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  projectItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    color: "#800080",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Assuming the avatar is circular
    marginRight: 10,
    marginTop: 10,
  },
});

export default ExploreScreen;
