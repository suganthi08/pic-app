import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    Alert,
    Image,
    TouchableOpacity
} from "react-native";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import firebase from "firebase";

export default class AbstractScreen extends React.Component {

  state = {
    
    image: "#",
    cameraPermission : false
  };

   startCamera = async () => {
    const {status,uri} = await Camera.requestPermissionsAsync()
     if(status === 'granted'){
      this.setState({cameraPermission:true})
      const photo = await Camera.takePictureAsync()
      this.setState ({image:uri})
      this.uploadImage(uri, Date.now());
      } 
     else{
        Alert.alert("Access denied")
      }
   }
  
   takePicture = async function(Camera) {
    const options = { quality: 0.5, base64: true };
    const data = await Camera.takePictureAsync(options);
    //  eslint-disable-next-line
    this.setState ({image:uri})
    this.uploadImage(data.uri, Date.now());
    console.log(data.uri);
  };

  selectPicture = async () => {
     const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.setState ({image:uri})
      this.uploadImage(uri, Date.now());
    }
  };

  
  uploadImage = async (uri, imageName) => {

    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("abstract_pics/" + imageName );

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };
render(){

   return(
    <View style={styles.container}>

     <Image
          style={styles.imageIcon}
          source={{
            uri:
              'https://www.shareicon.net/data/128x128/2015/09/18/642535_logo_512x512.png',
          }}
        />
    
    <TouchableOpacity style = {styles.button}
          onPress = {this.selectPicture}>
         <Image source={require("../assets/upload.png")} style={styles.iconImage}></Image>
     </TouchableOpacity>

     <TouchableOpacity style = {styles.button}
          onPress={this.startCamera}>
         <Image source={require("../assets/camera.png")} style={styles.iconImage}></Image>

         <TouchableOpacity
      onPress = {this.takePicture}>
      <Text> Snap </Text>
      </TouchableOpacity>
      
     </TouchableOpacity>

      
       

    </View>
    
  )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,   
    backgroundColor: "lightblue",
  },

    button: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 15,
    marginTop: 60,
    marginBottom : 70,
    width: 250,
    height: 70,
    backgroundColor : 'gray'
  },

   buttonText: {
    textAlign: 'center',
    color: 'Black',
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight:50
  },

    imageIcon: {
    width: 150,
    height: 150,
    marginLeft: 90,
    marginTop : 20
  },

  iconImage: {
        position: "absolute",
        height: 200,
        width: 200,
        resizeMode: "contain",
        right: 20,
        top: -70
    }

})