import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import {
  CornerTool,
  LaserTool,
  RakeTool,
  ReactangleTool,
  TapeTool,
  TheText,
  TheTool,
} from '../../components';
import { Camera, Laser } from '../../assets';
import { TOOLS } from '../../constants';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg from 'react-native-svg';

const Measurement = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const getImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeExtra: true,
    });
    console.log('image result', result);
    if (result?.assets && result?.assets[0].uri) {
      setSelectedPhoto(result?.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      {!selectedPhoto ? (
        <View style={styles.noPhoto}>
          <TouchableOpacity onPress={getImage}>
            <Camera color={'#9CA3AF'} />
          </TouchableOpacity>
          <TheText
            text="No Photo Selected"
            size={18}
            style={{ fontWeight: '500' }}
          />
          <TheText text="Upload a photo to start adding measurements" />
        </View>
      ) : (
        <GestureHandlerRootView style={styles.container}>
          <Image
            resizeMode="center"
            style={{ flex: 1 }}
            source={{ uri: selectedPhoto }}
          />
          <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
            {/* <LaserTool /> */}
            {/* <ReactangleTool /> */}
            <CornerTool />
            {/* <RakeTool /> */}
            {/* <TapeTool /> */}
          </Svg>
        </GestureHandlerRootView>
      )}
      <View style={styles.tools}>
        {TOOLS.map((item, index) => (
          <TheTool key={index} toolName={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  noPhoto: { flex: 1, gap: 10, alignItems: 'center', justifyContent: 'center' },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    gap: 5,
    // backgroundColor: 'white',
    // borderRadius: 100,
    // paddingVertical: 10,
  },
});

export default Measurement;
