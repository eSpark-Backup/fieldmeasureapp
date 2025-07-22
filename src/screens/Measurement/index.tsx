import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { TheText, TheTool } from '../../components';
import { Camera } from '../../assets';
import { TOOLS } from '../../constants';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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
        <Image
          resizeMode="center"
          style={{ flex: 1 }}
          source={{ uri: selectedPhoto }}
        />
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
