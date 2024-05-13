import React, { useState, useEffect,useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
  Modal,
  Button,
  ScrollView,
  FlatList,
  Linking,
  RefreshControl
} from "react-native";
import { Header } from "@react-navigation/stack";
import { Video, ResizeMode, Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../apis";
import LikeImage from "../assets/svgs/like.svg";
import { useFocusEffect } from '@react-navigation/native';
import CommentImage from "../assets/svgs/comments.svg";



const HomeScreen = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null); // State to hold the selected document
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsTemp, setCommentsTemp] = useState([]);
  const [status, setStatus] = React.useState({});
  const video = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

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
  },[]);

  useEffect(() => {
    AsyncStorage.getItem("role")
    .then((role) => {
      console.log("Retrieved userID:", role);
      setUserRole(role);
    })
    .catch((error) => {
      console.error("Error retrieving UserID:", error);
    });
  },[]);




  useEffect(() => {
    const fetchProjects = async () => {
      console.log("getting userId to get projects", userId);
      if(userId) {
        try {
          const projects = await api.getProjects();
          console.log("getting projects by fetch in home screen", projects.data);
          const filteredProjects = projects.data.filter(project => project.status == "APPROVED");
          console.log("setted Project now ",filteredProjects);
          setProjects(filteredProjects);
          console.log("projects", projects.data[0].likeCount);
          console.log("status", projects.data[0].status);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    fetchProjects();
  }, [userId,userRole]);

  const onRefresh =async () => {
    setRefreshing(true);
    // Fetch data again
    if(userId) {
      try {
        const projects = await api.getProjects();
        console.log("getting projects by fetch in home screen", projects.data);
        const filteredProjects = projects.data.filter(project => project.status == "APPROVED");
        console.log("setted Project now ",filteredProjects);
        setProjects(filteredProjects);
        console.log("projects", projects.data[0].likeCount);
        console.log("status", projects.data[0].status);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    setRefreshing(false);
  };

  const handleProjectPress = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };


  const handleLogout = () => {
    // Navigate to the login screen
    navigation.navigate("Login");
  };

  const handleUpload = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      console.log(document);
      setSelectedDocument(document); // Set the selected document in state
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  const handleSearch =async () => {
    // Implement your search functionality here
    const projects = await api.searchProjects(searchQuery);
    console.log("getting projects by fetch in home screen", projects.data);
    const filteredProjects = projects.data.filter(project => project.status == "APPROVED");
    console.log("setted Project now ",filteredProjects);
    setProjects(filteredProjects);
    console.log("projects", projects.data[0].likeCount);
    console.log("status", projects.data[0].status);
  };

  const handleLike = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const handleComment = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCommentBox = () => {
    setShowComment(true);
  };

  const handleCommentChange = (text) => {
    // Update the comment state whenever the input changes
    setComment(text);
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

  const handleCommentPost = () => {
    const data = {
      text: comment,
      parentId: null,
      userId: selectedProject.User.userId,
      projectId: selectedProject.projectId,
    };
    commentProject(selectedProject.projectId, data)
      .then((res) => {
        setCommentsTemp(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setComment("");
  };

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
    <ScrollView
     refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      <View style={styles.container}>
        <CustomHeader />
        <Image source={require("./li.jpg")} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              value={searchQuery}
            />
            <TouchableOpacity
              onPress={handleSearch}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.text, styles.purpleText]}>
            Our students turn their passion into purpose — see it in action.
          </Text>
          <Text style={styles.text}>
            Expo 
          </Text>
          <Text style={styles.uploadInfoText}>
            Have got any ideas? Submit your Abstracts here now!
          </Text>
        </View>

        <Text style={[styles.text, styles.purpleText]}>Projects</Text>
       
        <View style={styles.projectsContainer}>
        
            <FlatList
            data={projects}
            renderItem={renderItem}
            keyExtractor={(item) => item.projectId.toString()}
          />
          
          
        </View>
        
       

        {/* Modal */}
        <Modal
            visible={modalVisible}
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

        {userRole === "student" && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => navigation.navigate("UploadProject")}
          >
            <Text style={styles.uploadButtonText}>Upload Project</Text>
          </TouchableOpacity>
        )}
      </View>
      </ScrollView>
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
    backgroundColor: "#333333", // Background color of the header
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Border color
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
  buttonImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  logo: {
    width: 65, // Adjust the width of the logo as needed
    height: 50, // Adjust the height of the logo as needed
    borderRadius: 10,
  },
  tabs: {
    flexDirection: "row",
  },
  tabText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#fff", // Color of the tab text
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff", // Background color of the search bar
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#800080", // Purple color code
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10, // Add left margin for spacing
  },
  searchButtonText: {
    color: "#fff", // Text color
    fontSize: 16, // Font size
    fontWeight: "bold", // Font weight
  },
  image: {
    width: "100%", // Adjust the width of the image as needed
    height: 200, // Adjust the height of the image as needed
    resizeMode: "cover", // Adjust the image resizing mode as needed
    marginBottom: 10,
  },
  purpleText: {
    color: "#800080", // Purple color code
    fontWeight: "bold",
    fontSize: 22, // Optionally, make the text bold
  },
  text: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 15,
    marginHorizontal: 15,
    textAlign: "justify",
  },
  uploadButton: {
    backgroundColor: "#800080", // Purple color code
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: "#fff", // Text color
    fontSize: 18, // Font size
    fontWeight: "bold", // Font weight
    textAlign: "center", // Text alignment
    marginLeft: 10,
  },
  uploadInfoText: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 5,
    marginHorizontal: 15,
    textAlign: "justify",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  projectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  projectBox: {
    width: "48%", // Adjust the width of the project box as needed
    backgroundColor: "#ffffff", // Background color of the project box
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "10px",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
  },
  closeButton: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Assuming the avatar is circular
    marginRight: 10,
    marginTop: 10,
  },
  commentContainer: {
    backgroundColor: "#ADD8E6", // Sky blue color
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  postButton: {
    backgroundColor: "#800080",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default HomeScreen;
