import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Button, Alert,StyleSheet } from 'react-native';
import moment from 'moment';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProjectUpload = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectFile, setProjectFile] = useState(null);
  const [abstractFile, setAbstractFile] = useState(null);

  const [userId,setUserId]=useState("");
  const [userName,setUserName]=useState("");

  const allowedFileTypes = [
    'application/pdf',
    'video/mp4',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/quicktime',
    'video/x-msvideo',
  ];

  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then(userid => {
        console.log('Retrieved userID:', userid);
        setUserId(userid);
      })
      .catch(error => {
        console.error('Error retrieving UserID:', error);
      });
    AsyncStorage.getItem('username')
      .then(username => {
        console.log('Retrieved userID:', username);
        setUserName(username);
      })
      .catch(error => {
        console.error('Error retrieving UserID:', error);
      });
  }, []); 



  const handleProjectUpload = async () => {
    setLoading(true);

    try {

      const projectData = {
        projectName: name,
        projectDescription: description,
        projectAssetUrl: "https://my-bucket-pg.s3.amazonaws.com/WhatsApp%20Image%202024-03-22%20at%2010.59.12%20PM.jpeg",
        abstractUrl: "https://my-bucket-pg.s3.amazonaws.com/dummy.pdf",
        dateOfSubmission: "2023-02-28T00:00:00Z",
        createdAt: null,
        submittedBy: userName,
        userId: userId,
      };

      const projectUpload=await api.uploadProject(projectData);
      console.log("getting project upload data",projectUpload);
      setLoading(false);
      setName('');
      setDescription('');
      setProjectFile(null);
      setAbstractFile(null);
      Alert.alert('Success', 'Project uploaded successfully');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to upload project');
    }
  };

  const handleSelectProjectFile = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel) {
          console.log(response);
          setProjectFile(response.assets[0].uri);
        }
      }
    )
  };

  const handleSelectAbstractFile = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel) {
          setAbstractFile(response.assets[0].uri);
        }
      }
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    form: {
      width: '100%',
    },
    label: {
      marginBottom: 10,
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
    },
    fileUri: {
      marginBottom: 10,
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,marginTop:'2rem' }}>
      <Button title="Project File" onPress={handleSelectProjectFile} />
        {projectFile && <Text style={styles.fileUri}>{projectFile}</Text>}
      <Text style={{ marginBottom: 10 }}>Project Name:</Text>
      <TextInput
        style={{ height: 40, width: '100%', borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={setName}
        value={name}
        placeholder="Enter project name"
      />
      <Text style={{ marginBottom: 10 }}>Project Description:</Text>
      <TextInput
        style={{ height: 100, width: '100%', borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={setDescription}
        value={description}
        placeholder="Enter project description"
        multiline={true}
      />
      <Button title="Upload" onPress={handleProjectUpload} disabled={!name || !description  || loading} />
    </View>
  );
};
