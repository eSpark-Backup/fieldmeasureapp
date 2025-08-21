import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import {
  CornerTool,
  LaserTool,
  RakeTool,
  TapeTool,
  TheText,
  TheTool,
  TheButton,
  TheTextInput,
  TheToggle,
  GapView,
  RectangleTool,
  NoteTool,
} from '../../components';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Svg from 'react-native-svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import uuid from 'react-native-uuid';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import { Camera, RoundPlus, Upload } from '../../assets';

import { TOOLS } from '../../constants';
import { border } from '../../constants/colors';
import { RootNavParamList } from '../../types/navigationParams';
import { createNewTool, pdfHTML } from './utils';
import { Measure, Project, Tool, ToolsList } from '../../types';
import { useProjectStore } from '../../store/ProjectsStore';
import { showToast } from '../../utils/showToast';
import ToolsForm from '../../components/ToolsForm';

const { width, height } = Dimensions.get('screen');

type MeasurementProps = NativeStackScreenProps<RootNavParamList, 'Measurement'>;

type MeasurementRouteParams = Project & { existingMeasure?: Measure };

const Measurement = () => {
  const navigation = useNavigation<MeasurementProps['navigation']>();
  const route = useRoute<RouteProp<RootNavParamList, 'Measurement'>>();
  const { id: projectId, existingMeasure } =
    route.params as MeasurementRouteParams;
  const projectInfo: Project | undefined = route.params as Project | undefined;
  const { tempMeasure, setTempMeasure, clearTempMeasure, addMeasureToProject } =
    useProjectStore();
  const bottomInset = useSafeAreaInsets().bottom;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [mainLock, setMainLock] = useState(false);
  const [tools, setTools] = useState<ToolsList>([]);

  const [scaleVal, setScaleVal] = useState(1);

  const ref = useRef<ViewShot>(null);

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const translateY = useSharedValue(0);

  const prevTranslationY = useSharedValue(0);

  // 🧠 On mount, prefill if editing
  useEffect(() => {
    console.log('existingMeasure', existingMeasure);
    if (existingMeasure) {
      console.log('existingMeasure', existingMeasure.toolsData);
      setTempMeasure(existingMeasure.details);
      setLocation(existingMeasure.location || '');
      setSelectedPhoto(existingMeasure.photo || '');
      setTools(existingMeasure.toolsData);
    } else {
      clearTempMeasure();
    }
  }, [existingMeasure]);

  const stateRef = useRef({
    tools,
    location,
    tempMeasure,
    selectedPhoto,
    existingMeasure,
  });
  const skipPromptRef = useRef(false);

  useEffect(() => {
    stateRef.current = {
      tools,
      location,
      tempMeasure,
      selectedPhoto,
      existingMeasure,
    };
  }, [tools, location, tempMeasure, selectedPhoto, existingMeasure]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (skipPromptRef.current) {
        // ✅ reset so it doesn’t skip next time
        skipPromptRef.current = false;
        return;
      }
      const { tools, location, tempMeasure, selectedPhoto, existingMeasure } =
        stateRef.current;
      const sanitized = tools.map(({ locked, hidden, ...rest }) => rest);

      const exist: Measure = {
        id: existingMeasure?.id ?? '',
        location,
        details: tempMeasure,
        photo: selectedPhoto ?? '',
        toolsData: sanitized,
        timestamp: existingMeasure?.timestamp ?? Date.now(),
      };

      const clean = (obj: Measure) => {
        const { timestamp, ...rest } = obj;
        return rest;
      };

      // console.log('existingMeasure', existingMeasure);
      // console.log('exist', exist);

      if (
        existingMeasure != undefined &&
        JSON.stringify(clean(existingMeasure)) == JSON.stringify(clean(exist))
      ) {
        navigation.dispatch(e.data.action);
        return;
      } else if (
        location == '' &&
        !tempMeasure &&
        !selectedPhoto &&
        sanitized.length == 0
      ) {
        navigation.dispatch(e.data.action);
        return;
      }

      e.preventDefault();
      Alert.alert(
        'Save Changes?',
        'Would you like to save your measurements before leaving?',
        [
          {
            text: "Don't Save",
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
          {
            text: 'Save',
            style: 'default',
            onPress: () => {
              handleSaveMeasurements(() => {
                navigation.dispatch(e.data.action);
              });
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    });

    return unsubscribe;
  }, [navigation]);

  function hasEmptyOrZero(tools: Tool[]): boolean {
    const check = (obj: any): boolean => {
      if (obj && typeof obj === 'object') {
        return Object.values(obj).some(v => check(v));
      }
      return obj === '' || obj === '0';
    };

    return tools.some(tool => check(tool.data));
  }

  const handleSaveMeasurements = (onSuccess?: () => void) => {
    const { tools, location, tempMeasure, selectedPhoto, existingMeasure } =
      stateRef.current;

    if (!projectId) {
      console.warn('No valid project ID.');
      skipPromptRef.current = false;
      return false;
    }

    if (!location) {
      showToast('Location is required.');
      skipPromptRef.current = false;
      return false;
    }

    if (!selectedPhoto) {
      showToast('Please select photo first.');
      skipPromptRef.current = false;
      return false;
    }

    if (tempMeasure == null) {
      showToast('Add measure details data to save.');
      skipPromptRef.current = false;
      return false;
    }

    const sanitized = tools.map(({ locked, hidden, ...rest }) => rest);

    if (hasEmptyOrZero(sanitized)) {
      Alert.alert('Missing information', 'Are you sure you want to save?', [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            console.log('❌ Save canceled');
            skipPromptRef.current = false; // reset here
          },
        },
        {
          text: 'Save Anyway',
          style: 'destructive',
          onPress: () => {
            saveMeasure(sanitized);
            onSuccess?.();
          },
        },
      ]);
      return false; // initial return doesn’t matter anymore
    }

    saveMeasure(sanitized);
    onSuccess?.();
    return true;
  };

  // ✅ Extracted save logic (so it can be reused for both normal + override save)
  function saveMeasure(toolsData: any[]) {
    const { location, tempMeasure, selectedPhoto, existingMeasure } =
      stateRef.current;

    const newMeasure: Measure = {
      id: existingMeasure?.id || uuid.v4().toString(),
      location,
      details: tempMeasure,
      photo: selectedPhoto ?? '',
      toolsData,
      timestamp: Date.now(),
    };

    addMeasureToProject(projectId, newMeasure);
    clearTempMeasure();

    console.log('✅ Measure saved for project:', projectId);

    const updated = useProjectStore
      .getState()
      .projects.find(p => p.id === projectId);
    console.log('📦 Updated Project:', updated);

    return true;
  }

  const handleSaveAndGoBack = () => {
    skipPromptRef.current = true;
    handleSaveMeasurements(() => {
      navigation.goBack();
    });
  };

  useAnimatedReaction(
    () => scale.value,
    newScale => {
      runOnJS(setScaleVal)(newScale);
    },
  );

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate(event => {
      scale.value = clamp(startScale.value * event.scale, 1, 2);
    });

  console.log('scale val', scale.value);

  const panGesture = Gesture.Pan()
    .onStart(e => {
      if (scale.value < 1.2) {
        return;
      }
      prevTranslationY.value = translateY.value;
    })
    .onUpdate(e => {
      if (scale.value < 1.2) {
        return;
      }
      translateY.value = clamp(
        prevTranslationY.value + e.translationY,
        -height / 2,
        height / 2,
      );
    })
    .onEnd(e => {
      if (scale.value < 1.2) {
        return;
      }
      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [-height / 2, height / 2],
      });
    });

  const composedGesture = Gesture.Simultaneous(pinch, panGesture);

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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

  const captureImage = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true, // optional: saves the captured photo to gallery
        includeExtra: true,
      });

      console.log('camera result', result);

      if (result?.assets && result?.assets[0]?.uri) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const addTool = (type: Tool['type']) => {
    if (!selectedPhoto) {
      showToast('Please select photo first.');
      return;
    }
    const newTool = createNewTool(type);
    setTools(prev => [...prev, newTool]);
  };

  const renderToolContent = () => {
    return (
      <View>
        <ToolsForm
          tools={tools}
          onChange={tools => {
            const anyUnlocked = tools.some(it => !it.locked);
            setTools(tools);
            if (anyUnlocked) {
              setMainLock(false);
            }
          }}
        />
      </View>
    );
  };

  const updateCoords = (id: string, xCoords: number[], yCoords: number[]) => {
    setTools(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        return {
          ...it,
          xCoords,
          yCoords,
        };
      }),
    );
  };

  const lockAllTools = (locked: boolean) => {
    setTools(prev =>
      prev.map(it => ({
        ...it,
        locked, // set lock value for all
      })),
    );
  };

  const updateDistCoords = (
    id: string,
    xCoords: number[],
    yCoords: number[],
  ) => {
    setTools(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        return {
          ...it,
          xCoordsDist: xCoords,
          yCoordsDist: yCoords,
        };
      }),
    );
  };

  const renderTools = (tool: Tool) => {
    if (tool.hidden) return null;
    switch (tool.type) {
      case 'Tape': {
        return (
          <TapeTool
            key={tool.id}
            scaleValue={scaleVal}
            getCoords={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            xCoords={tool.xCoords}
            yCoords={tool.yCoords}
            data={tool.data}
            locked={tool.locked}
          />
        );
      }
      case 'Laser': {
        return (
          <LaserTool
            key={tool.id}
            scaleValue={scaleVal}
            getCoords={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            xCoords={tool.xCoords}
            yCoords={tool.yCoords}
            data={tool.data}
            locked={tool.locked}
          />
        );
      }
      case 'Rake': {
        return (
          <RakeTool
            key={tool.id}
            scaleValue={scaleVal}
            getCoords={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            getCoordsDist={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateDistCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            xCoords={tool.xCoords}
            yCoords={tool.yCoords}
            xCoordsDist={tool.xCoordsDist}
            yCoordsDist={tool.yCoordsDist}
            showDist={tool.showDist}
            data={tool.data}
            locked={tool.locked}
          />
        );
      }
      case 'Rectangle': {
        return (
          <RectangleTool
            key={tool.id}
            scaleValue={scaleVal}
            getCoords={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            xCoords={tool.xCoords}
            yCoords={tool.yCoords}
            data={tool.data}
            locked={tool.locked}
          />
        );
      }
      case 'Corner': {
        return (
          <CornerTool
            key={tool.id}
            scaleValue={scaleVal}
            getCoords={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            xCoords={tool.xCoords}
            yCoords={tool.yCoords}
            data={tool.data}
            locked={tool.locked}
          />
        );
      }
      case 'Note': {
        return (
          <NoteTool
            key={tool.id}
            scaleValue={scaleVal}
            getCoords={(xArr, yArr) => {
              const cData = { x: xArr, y: yArr };
              updateCoords(tool.id, cData.x, cData.y);
              console.log('X:', xArr, 'Y:', yArr);
            }}
            xCoords={tool.xCoords}
            yCoords={tool.yCoords}
            data={tool.data}
            locked={tool.locked}
          />
        );
      }
    }
  };

  const exportReport = async () => {
    ref.current?.capture!().then(async uri => {
      console.log('do something with ', uri);
      let options = {
        html: pdfHTML(uri),
        fileName: 'test',
        directory: 'Documents',
      };

      // let file = await RNHTMLtoPDF.convert(options);
      // console.log(file.filePath);
      // FileViewer.open(file.filePath!);
    });

    // alert(file.filePath);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginRight: 10,
          marginTop: bottomInset,
          marginBottom: bottomInset,
          backgroundColor: '#F9FAFB',
          gap: 10,
        }}
      >
        {!selectedPhoto ? (
          <View style={styles.noPhoto}>
            <Camera color={'#9CA3AF'} />
            <TheText
              text="No Photo Selected"
              size={18}
              style={{ fontWeight: '500' }}
            />
            <TheText text="Select a photo to start adding measurements" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TheButton
                btnTitle="Capture"
                icon={<RoundPlus width={20} height={20} color={'white'} />}
                onPress={captureImage}
              />
              <TheText text="OR" style={{ marginHorizontal: 10 }} />
              <TheButton
                btnTitle="Upload Image"
                icon={<RoundPlus width={20} height={20} color={'white'} />}
                onPress={getImage}
              />
            </View>
          </View>
        ) : (
          <ViewShot
            ref={ref}
            style={{
              // flex: 1,
              width: '65%',
              marginVertical: 10,
              justifyContent: 'center',
            }}
            options={{
              fileName: 'Your-File-Name',
              quality: 0.9,
            }}
          >
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={[{ flex: 1 }, boxAnimatedStyles]}>
                <Image
                  resizeMode="contain"
                  style={{ flex: 1 }}
                  source={{ uri: selectedPhoto }}
                />
                <Svg
                  height="100%"
                  width="100%"
                  style={{ position: 'absolute' }}
                >
                  {tools.map(tool => renderTools(tool))}
                </Svg>
              </Animated.View>
            </GestureDetector>
          </ViewShot>
        )}

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.tools}>
            <FlatList
              data={TOOLS}
              numColumns={3}
              contentContainerStyle={{
                gap: 10,
                paddingVertical: 10,
              }}
              ItemSeparatorComponent={() => <GapView mode="horizontal" />}
              renderItem={({ item, index }) => (
                <TheTool
                  key={index}
                  toolName={item}
                  onPress={() => addTool(item)}
                  style={{ marginHorizontal: 5 }}
                />
              )}
            />
            {/* {TOOLS.map((item, index) => (
              <TheTool
                key={index}
                toolName={item}
                onPress={() => handleToolPress(item)}
              />
            ))} */}
          </View>
          <View style={styles.initialContainer}>
            <TheTextInput
              label="Location"
              placeholder="Kitchen, Bathroom, Living Room"
              value={location}
              onChange={setLocation}
              required
            />
          </View>
          <View style={styles.initialContainer}>
            <TheButton
              btnTitle="Upload Photo"
              icon={<Upload />}
              titleStyle={{ fontWeight: 'bold' }}
              onPress={getImage}
            />
          </View>
          <View style={styles.initialContainer}>
            <TheButton
              btnTitle="Add Details"
              onPress={() => {
                if (projectInfo) {
                  navigation.navigate('AllDetails', {
                    qouteNumber: projectInfo?.qouteNumber!,
                    name: projectInfo.name,
                    address: projectInfo.address,
                    techName: projectInfo.techName,
                    date: projectInfo.date,
                  });
                }
              }}
              titleStyle={{ fontWeight: 'bold' }}
              btnColor={'#fcac17ff'}
            />
          </View>
          <View
            style={[styles.rowContainer, { justifyContent: 'space-between' }]}
          >
            <TheText
              text={`Measurements(${tools.length})`}
              size={20}
              style={{ fontWeight: 'bold', marginVertical: 20 }}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <TheText style={{ fontWeight: '500' }} text="Lock All" />
              <GapView mode="horizontal" />
              <TheToggle
                value={mainLock}
                onValueChange={() => {
                  setMainLock(!mainLock);
                  lockAllTools(!mainLock);
                }}
                large
              />
            </View>
          </View>
          <View style={{ zIndex: 1000 }}>{renderToolContent()}</View>
          {/* <TheButton
            btnTitle="Export Report"
            titleStyle={{ fontWeight: 'bold' }}
            icon={<Export />}
            // onPress={handleSaveMeasurements}
          /> */}
          <TheButton
            btnTitle="Save"
            titleStyle={{ fontWeight: 'bold' }}
            // icon={<Export />}
            onPress={handleSaveAndGoBack}
            style={{ marginTop: 10 }}
          />
          <GapView length={useSafeAreaInsets().bottom + 10} />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

function Badge({ color }: { color: string }) {
  return (
    <View
      style={{
        backgroundColor: color,
        width: 15,
        aspectRatio: 1,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: border,
      }}
    />
  );
}

// export function MeasureCard({
//   type,
//   onDelete,
//   onEyePress,
//   color,
//   style,
// }: {
//   type: string;
//   onDelete: () => void;
//   onEyePress: (visible: boolean) => void;
//   color?: string;
//   style?: ViewStyle;
// }) {
//   const [visible, setVisible] = useState(true);
//   const [lock, setLock] = useState(false);
//   const [showDist, setShowDist] = useState(false);
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

//   const [description, setDescription] = useState('');

//   const RenderInputRow = ({
//     label,
//     dropdownId,
//     index,
//     length,
//     onChange,
//   }: {
//     label?: string;
//     dropdownId?: string;
//     index?: number;
//     length?: number;
//     onChange: ({ key, value }: { key: string; value: string }) => void;
//   }) => {
//     return (
//       <ToolInput
//         label={label}
//         onSelect={onChange}
//         placeholder="0"
//         id={dropdownId || ''}
//         style={{ width: 70 }}
//       />
//     );
//   };

//   const onEye = () => {
//     onEyePress(!visible);
//     setVisible(!visible);
//   };

//   return (
//     <View style={[styles.initialContainer, style]}>
//       {/* Header */}
//       <View style={[styles.rowContainer, { justifyContent: 'space-between' }]}>
//         <View style={[styles.rowContainer, { gap: 5, width: '70%' }]}>
//           <Badge color={color || '#FBBF24'} />
//           <TheText
//             text={`${type} Measurement`}
//             size={18}
//             numberOfLines={1}
//             style={{ fontWeight: '600', width: '88%' }}
//           />
//         </View>
//         <View style={[styles.rowContainer, { gap: 5 }]}>
//           {visible ? (
//             <Eye color="#6B7280" onPress={onEye} />
//           ) : (
//             <EyeClosed color="#6B7280" onPress={onEye} />
//           )}
//           <TheToggle value={lock} onValueChange={setLock} />
//           <Trash onPress={onDelete} />
//         </View>
//       </View>

//       {/* Type-specific Inputs */}
//       {type === 'Tape' && (
//         <RenderInputRow
//           dropdownId="tape"
//           onChange={({ key, value }) => console.log('key', key, 'value', value)}
//         />
//       )}

//       {type === 'Rake' && (
//         <>
//           <RenderInputRow
//             dropdownId="rake"
//             onChange={({ key, value }) =>
//               console.log('key', key, 'value', value)
//             }
//           />
//           <TheButton
//             btnTitle="Distance"
//             icon={showDist ? <Minus /> : <Plus />}
//             onPress={() => setShowDist(!showDist)}
//             btnColor={showDist ? '#fbeefdff' : border}
//             titleStyle={{ fontWeight: 'bold' }}
//             titleColor="black"
//           />
//           {showDist && (
//             <RenderInputRow
//               dropdownId="rake-distance"
//               onChange={({ key, value }) =>
//                 console.log('key', key, 'value', value)
//               }
//             />
//           )}
//         </>
//       )}

//       {type === 'Laser' && (
//         <>
//           <RenderInputRow
//             label="Slide A"
//             dropdownId="laser-slide-a"
//             onChange={({ key, value }) =>
//               console.log('key', key, 'value', value)
//             }
//           />
//           <RenderInputRow
//             label="Slide B"
//             dropdownId="laser-slide-b"
//             onChange={({ key, value }) =>
//               console.log('key', key, 'value', value)
//             }
//           />
//         </>
//       )}

//       {type === 'Rectangle' &&
//         rectangleLabels.map((label, index) => (
//           <RenderInputRow
//             label={label}
//             dropdownId={`rectangle-${index}`}
//             onChange={({ key, value }) =>
//               console.log('key', key, 'value', value)
//             }
//           />
//         ))}

//       {type === 'Corner' &&
//         cornerLabels.map((label, index) => (
//           <RenderInputRow
//             label={label}
//             dropdownId={`corner-${index}`}
//             index={index}
//             length={cornerLabels.length}
//             onChange={({ key, value }) =>
//               console.log('key', key, 'value', value)
//             }
//           />
//         ))}
//       {type === 'Note' && (
//         <TheDescriptionBox
//           placeholder="Enter your note text here"
//           value={description}
//           onChangeText={setDescription}
//         />
//       )}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: { flex: 1 },
  initialContainer: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 20,
    marginVertical: 5,
    backgroundColor: 'white',
    gap: 10,
  },
  imageContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noPhoto: {
    width: '65%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  noToolSelected: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    gap: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  handleIndicator: {
    backgroundColor: '#DCDCDC',
    width: 50,
    height: 4,
    borderRadius: 2,
  },
});

export default Measurement;
