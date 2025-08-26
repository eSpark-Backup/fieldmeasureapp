import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ViewStyle,
  FlatList,
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
  ToolInput,
} from '../../components';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Svg from 'react-native-svg';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import uuid from 'react-native-uuid';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import {
  Camera,
  Export,
  Eye,
  EyeClosed,
  Minus,
  Plus,
  RoundPlus,
  Trash,
  Upload,
} from '../../assets';

import {
  cornerLabels,
  fractionalInches,
  rectangleLabels,
  TOOLS,
} from '../../constants';
import { border, primaryColor } from '../../constants/colors';
import { RootNavParamList } from '../../types/navigationParams';
import TheDescriptionBox from '../../components/TheDescriptionBox';
import { pdfHTML } from './utils';
import { Coords, Measure, Project } from '../../types';
import { useProjectStore } from '../../store/ProjectsStore';
import { showToast } from '../../utils/showToast';

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
  const topInset = useSafeAreaInsets().top;
  const bottomInset = useSafeAreaInsets().bottom;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>('https://i.pinimg.com/736x/a7/09/1c/a7091c6f019f2e6838e867acc8d1361c.jpg');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [mainLock, setMainLock] = useState(false);
  const snapPoints = useMemo(() => [bottomInset + 30, 650], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [TapeT, setTapeT] = useState(false);
  const [LaserT, setLaserT] = useState(false);
  const [RakeT, setRakeT] = useState(false);
  const [RectanlgeT, setRectanlgeT] = useState(false);
  const [CornerT, setCornerT] = useState(false);

  const [TapeH, setTapeH] = useState(true);
  const [LaserH, setLaserH] = useState(true);
  const [RakeH, setRakeH] = useState(true);
  const [RectanlgeH, setRectanlgeH] = useState(true);
  const [CornerH, setCornerH] = useState(true);

  // Normalized initial coordinates (relative to image container, 0-1)
  const initialX = [0.3, 0.7];
  const initialY = [0.3, 0.7];

  const initialRX = [0.2, 0.2, 0.8, 0.8];
  const initialRY = [0.2, 0.8, 0.8, 0.2];

  const initialCX = [0.2, 0.2, 0.5, 0.8, 0.8, 0.5];
  const initialCY = [0.2, 0.8, 0.8, 0.8, 0.2, 0.2];

  const [TapeC, setTapeC] = useState<Coords>({ x: initialX, y: initialY });
  const [LaserC, setLaserC] = useState<Coords>({ x: initialX, y: initialY });
  const [RakeC, setRakeC] = useState<Coords>({ x: initialX, y: initialY });
  const [RectanlgeC, setRectanlgeC] = useState<Coords>({
    x: initialRX,
    y: initialRY,
  });
  const [CornerC, setCornerC] = useState<Coords>({
    x: initialCX,
    y: initialCY,
  });

  // Store measured image container size
  const [imageLayout, setImageLayout] = useState<{ width: number; height: number } | null>(null);

  const [scaleVal, setScaleVal] = useState(1);

  const ref = useRef<ViewShot>(null);

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const translateY = useSharedValue(0);

  const prevTranslationY = useSharedValue(0);

  const countTrueStates = () => {
    const states = [TapeT, LaserT, RakeT, RectanlgeT, CornerT];
    return states.filter(Boolean).length;
  };

  const setStatesFromMeasure = (measure: Measure) => {
    setTapeT(!!measure.toolsData?.tape);
    setLaserT(!!measure.toolsData?.laser);
    setRakeT(!!measure.toolsData?.rake);
    setRectanlgeT(!!measure.toolsData?.rectangle);
    setCornerT(!!measure.toolsData?.corner);
  };

  // Ensure loaded coords are normalized (0-1)
  const setStatesFromCoords = (measure: Measure) => {
    const mapping: Record<string, (value: any) => void> = {
      tape: setTapeC,
      laser: setLaserC,
      rake: setRakeC,
      rectangle: setRectanlgeC,
      corner: setCornerC,
    };
    Object.entries(mapping).forEach(([tool, setter]) => {
      const coords = measure.toolsData?.[tool]?.coords;
      if (coords != null) {
        // If values are > 1, treat as pixel and convert to normalized (for backward compatibility)
        if (imageLayout && coords.x.every((v: number) => v > 1)) {
          setter({
            x: coords.x.map((v: number) => v / imageLayout.width),
            y: coords.y.map((v: number) => v / imageLayout.height),
          });
        } else {
          setter(coords);
        }
      }
    });
  };

  // 🧠 On mount, prefill if editing
  useEffect(() => {
    console.log('existingMeasure', existingMeasure);
    if (existingMeasure) {
      console.log('existingMeasure', existingMeasure.toolsData);

      setTempMeasure(existingMeasure.details);
      setLocation(existingMeasure.location || '');
      // setSelectedPhoto(existingMeasure.photo || '');
      setStatesFromMeasure(existingMeasure);
      setStatesFromCoords(existingMeasure);
    } else {
      clearTempMeasure();
    }
  }, [existingMeasure]);

  console.log("existingMeasure", existingMeasure);
  
  // Utility: Collect all tool data for saving
  const collectAllToolsData = () => {
    const toolsData: Record<string, { coords: any; status: boolean }> = {};
    if (TapeT) {
      toolsData.tape = {
        coords: TapeC,
        status: TapeT,
      };
    }
    if (LaserT) {
      toolsData.laser = {
        coords: LaserC,
        status: LaserT,
      };
    }
    if (RakeT) {
      toolsData.rake = {
        coords: RakeC,
        status: RakeT,
      };
    }
    if (RectanlgeT) {
      toolsData.rectangle = {
        coords: RectanlgeC,
        status: RectanlgeT,
      };
    }
    if (CornerT) {
      toolsData.corner = {
        coords: CornerC,
        status: CornerT,
      };
    }
    return toolsData;
  };

 let toolData = {
    "tape": {
        "coords": {
            "x": [
                0.6722084367245656,
                0.6689826302729528
            ],
            "y": [
                0.6513362693050193,
                0.9088674891409266
            ]
        },
        "status": true
    },
    "laser": {
        "coords": {
            "x": [
                0.811473397758995,
                0.8096645762251861
            ],
            "y": [
                0.9622647200772201,
                0.0015444015444015444
            ]
        },
        "status": true
    },
    "rake": {
        "coords": {
            "x": [
                0.43027295285359796,
                0.6627791563275434
            ],
            "y": [
                0.4193118062258687,
                0.4073328909266408
            ]
        },
        "status": true
    },
    "rectangle": {
        "coords": {
            "x": [
                0.2589330024813896,
                0.26301978326612907,
                0.42663083514267996,
                0.4347753179280398
            ],
            "y": [
                0.6005044944498069,
                0.854031430984556,
                0.8115754705598456,
                0.5853462837837838
            ]
        },
        "status": true
    },
    "corner": {
        "coords": {
            "x": [
                0.18759305210918117,
                0.1968982630272953,
                0.42245657568238215,
                0.6599129575062036,
                0.6626542387174319,
                0.43263415012406947
            ],
            "y": [
                0.1024734555984556,
                0.4054287825772201,
                0.4236682553088803,
                0.40941949203667954,
                0.08801580598455598,
                0.16987361245173746
            ]
        },
        "status": true
    }
}
   useEffect(() => {
    restoreAllToolsFromData(toolData);
  }, [])
  

  // Utility: Restore all tool states and coordinates from saved data
  const restoreAllToolsFromData = (toolsData: Record<string, { coords: any; status: boolean }>) => {
    setTapeT(!!toolsData.tape?.status);
    setLaserT(!!toolsData.laser?.status);
    setRakeT(!!toolsData.rake?.status);
    setRectanlgeT(!!toolsData.rectangle?.status);
    setCornerT(!!toolsData.corner?.status);

    if (toolsData.tape?.coords) setTapeC(toolsData.tape.coords);
    if (toolsData.laser?.coords) setLaserC(toolsData.laser.coords);
    if (toolsData.rake?.coords) setRakeC(toolsData.rake.coords);
    if (toolsData.rectangle?.coords) setRectanlgeC(toolsData.rectangle.coords);
    if (toolsData.corner?.coords) setCornerC(toolsData.corner.coords);
  };

  // ✅ Save logic handles both create + update
  const handleSaveMeasurements = () => {
    console.log('yaha aya', tempMeasure);

    if (!projectId) {
      console.warn('No valid project ID.');
      return;
    }

    if (!location) {
      showToast('Location is required.');
      return;
    }

    if (!selectedPhoto) {
      showToast('Please select photo first.');
      return;
    }

    // if (tempMeasure == null) {
    //   showToast('Add measure details data to save.');
    //   return;
    // }

    const toolsData = collectAllToolsData();

    const newMeasure: Measure = {
      id: existingMeasure?.id || uuid.v4().toString(),
      location,
      details: tempMeasure,
      photo: selectedPhoto,
      toolsData,
      timestamp: Date.now(),
    };

    console.log(JSON.stringify({projectId, newMeasure}))
    addMeasureToProject(projectId, newMeasure);
    clearTempMeasure();

    console.log('✅ Measure saved for project:', projectId);

    const updated = useProjectStore
      .getState()
      .projects.find(p => p.id === projectId);
    console.log('📦 Updated Project:', updated);

    navigation.goBack(); // optional: return after save
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

  const handleToolPress = (toolName: string) => {
    if (!selectedPhoto) {
      showToast('Please select photo first.');
      return;
    }
    renderTool(toolName);
    console.log('Selected tool:', toolName);

    setSelectedTools(prev => [...prev, toolName]);
    // Optionally expand the bottom sheet when a tool is selected
    // bottomSheetRef.current?.snapToIndex(1);
  };

  const handleToolDelete = (toolIndex: number) => {
    setSelectedTools(prev => prev.filter((_, index) => index !== toolIndex));
  };

  // const renderToolContent = () => {
  //   return selectedTools.map((tool, index) => {
  //     const commonProps = {
  //       onDelete: () => handleToolDelete(index),
  //       type: tool,
  //     };

  //     switch (tool) {
  //       case 'Tape':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             onEyePress={val => setTapeH(val)}
  //             style={{ zIndex: 100 - index }}
  //             color={primaryColor}
  //           />
  //         );
  //       case 'Laser':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             onEyePress={val => setLaserH(val)}
  //             style={{ zIndex: 100 - index }}
  //             color="#FBBF24"
  //           />
  //         );
  //       case 'Rake':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             onEyePress={val => setRakeH(val)}
  //             style={{ zIndex: 100 - index }}
  //             color="#BB86FC"
  //           />
  //         );
  //       case 'Rectangle':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             onEyePress={val => setRectanlgeH(val)}
  //             style={{ zIndex: 100 - index }}
  //             color="#86b9fcff"
  //           />
  //         );
  //       case 'Corner':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             onEyePress={val => setCornerH(val)}
  //             style={{ zIndex: 100 - index }}
  //             color="#ca5056ff"
  //           />
  //         );
  //       // case 'Note':
  //       //   return (
  //       //     <MeasureCard
  //       //       key={index + tool}
  //       //       {...commonProps}
  //       //       style={{ zIndex: 100 + selectedTools.length - index }}
  //       //       color="#50cac0ff"
  //       //     />
  //       //   );
  //       // case 'RoundUp':
  //       //   bottomSheetRef.current?.snapToIndex(1);
  //       case 'RoundUp':
  //         exportReport();
  //       default:
  //         return null;
  //     }
  //   });
  // };

  const renderToolContent = () => {
    return (
      <View>
        {TapeT && (
          <MeasureCard
            onDelete={() => {
              setTapeT(false);
              setTapeC({ x: initialX, y: initialY });
            }}
            onEyePress={val => setTapeH(val)}
            type={'Tape'}
            style={{ zIndex: 10 }}
            color={primaryColor}
          />
        )}
        {LaserT && (
          <MeasureCard
            onDelete={() => {
              setLaserT(false);
              setLaserC({ x: initialX, y: initialY });
            }}
            onEyePress={val => setLaserH(val)}
            type={'Laser'}
            style={{ zIndex: 9 }}
            color="#FBBF24"
          />
        )}
        {RakeT && (
          <MeasureCard
            onDelete={() => {
              setRakeT(false);
              setRakeC({ x: initialX, y: initialY });
            }}
            onEyePress={val => setRakeH(val)}
            type={'Rake'}
            style={{ zIndex: 8 }}
            color="#BB86FC"
          />
        )}
        {RectanlgeT && (
          <MeasureCard
            onDelete={() => {
              setRectanlgeT(false);
              setRectanlgeC({ x: initialRX, y: initialRY });
            }}
            onEyePress={val => setRectanlgeH(val)}
            type={'Rectangle'}
            style={{ zIndex: 7 }}
            color="#86b9fcff"
          />
        )}
        {CornerT && (
          <MeasureCard
            onDelete={() => {
              setCornerT(false);
              setCornerC({ x: initialCX, y: initialCY });
            }}
            onEyePress={val => setCornerH(val)}
            type={'Corner'}
            style={{ zIndex: 6 }}
            color="#ca5056ff"
          />
        )}
      </View>
    );
  };

  const renderTool = (tool: string) => {
    switch (tool) {
      case 'Tape':
        return setTapeT(true);
      case 'Laser':
        return setLaserT(true);
      case 'Rake':
        return setRakeT(true);
      case 'Rectangle':
        return setRectanlgeT(true);
      case 'Corner':
        return setCornerT(true);
      // case 'Note':
      //   return (
      //     <MeasureCard key={index + tool} {...commonProps} color="#50cac0ff" />
      //   );
      // case 'RoundUp':
      //   bottomSheetRef.current?.snapToIndex(1);
      // case 'RoundUp':
      //   exportReport();
      default:
        return null;
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
          paddingHorizontal: 20,
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
                <View
                  style={{ flex: 1 }}
                  // onLayout={event => {
                  //   const { width, height } = event.nativeEvent.layout;
                  //   setImageLayout({ width, height });
                  // }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      width: "100%",
                      height: "100%",
                      // width: 250,
                      // height: 250,
                      position: 'absolute',
                      alignSelf: 'center',
                      // backgroundColor: 'blue'
                    }}
                    source={{ uri: selectedPhoto }}
                    onLayout={event => {
                      const { width, height } = event.nativeEvent.layout;
                      setImageLayout({ width, height });
                    }}
                  />
                  <Svg
                    height="100%"
                    width="100%"
                    // height={250}
                    // width={250}
                    style={
                      {
                        // position: 'absolute',
                        // backgroundColor: 'red',
                        //  alignSelf: 'center'
                      }
                    }
                  >
                    {TapeT && TapeH && imageLayout && (
                      <TapeTool
                        scaleValue={scaleVal}
                        getCoords={(xArr, yArr) => {
                          // Convert pixel coords to normalized
                          const normX = xArr.map(x => x / imageLayout.width);
                          const normY = yArr.map(y => y / imageLayout.height);
                          setTapeC({ x: normX, y: normY });
                        }}
                        xCoords={TapeC.x.map(x => x * imageLayout.width)}
                        yCoords={TapeC.y.map(y => y * imageLayout.height)}
                      />
                    )}
                    {LaserT && LaserH && imageLayout && (
                      <LaserTool
                        scaleValue={scaleVal}
                        getCoords={(xArr, yArr) => {
                          const normX = xArr.map(x => x / imageLayout.width);
                          const normY = yArr.map(y => y / imageLayout.height);
                          setLaserC({ x: normX, y: normY });
                        }}
                        xCoords={LaserC.x.map(x => x * imageLayout.width)}
                        yCoords={LaserC.y.map(y => y * imageLayout.height)}
                      />
                    )}
                    {RakeT && RakeH && imageLayout && (
                      <RakeTool
                        scaleValue={scaleVal}
                        getCoords={(xArr, yArr) => {
                          const normX = xArr.map(x => x / imageLayout.width);
                          const normY = yArr.map(y => y / imageLayout.height);
                          setRakeC({ x: normX, y: normY });
                        }}
                        xCoords={RakeC.x.map(x => x * imageLayout.width)}
                        yCoords={RakeC.y.map(y => y * imageLayout.height)}
                      />
                    )}
                    {RectanlgeT && RectanlgeH && imageLayout && (
                      <RectangleTool
                        scaleValue={scaleVal}
                        getCoords={(xArr, yArr) => {
                          const normX = xArr.map(x => x / imageLayout.width);
                          const normY = yArr.map(y => y / imageLayout.height);
                          setRectanlgeC({ x: normX, y: normY });
                        }}
                        xCoords={RectanlgeC.x.map(x => x * imageLayout.width)}
                        yCoords={RectanlgeC.y.map(y => y * imageLayout.height)}
                      />
                    )}
                    {CornerT && CornerH && imageLayout && (
                      <CornerTool
                        scaleValue={scaleVal}
                        getCoords={(xArr, yArr) => {
                          const normX = xArr.map(x => x / imageLayout.width);
                          const normY = yArr.map(y => y / imageLayout.height);
                          setCornerC({ x: normX, y: normY });
                        }}
                        xCoords={CornerC.x.map(x => x * imageLayout.width)}
                        yCoords={CornerC.y.map(y => y * imageLayout.height)}
                      />
                    )}
                  </Svg>
                </View>
              </Animated.View>
            </GestureDetector>
          </ViewShot>
        )}

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.tools}>
            <FlatList
              data={TOOLS}
              numColumns={3}
              contentContainerStyle={{ gap: 10 }}
              ItemSeparatorComponent={() => <GapView mode="horizontal" />}
              renderItem={({ item, index }) => (
                <TheTool
                  key={index}
                  toolName={item}
                  onPress={() => handleToolPress(item)}
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
              text={`Measurements(${countTrueStates()})`}
              size={20}
              style={{ fontWeight: 'bold', marginVertical: 20 }}
            />
            <View style={styles.rowContainer}>
              <TheText style={{ fontWeight: '500' }} text="Lock All" />
              <GapView mode="horizontal" />
              <TheToggle value={mainLock} onValueChange={setMainLock} large />
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
            onPress={handleSaveMeasurements}
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

function MeasureCard({
  type,
  onDelete,
  onEyePress,
  color,
  style,
}: {
  type: string;
  onDelete: () => void;
  onEyePress: (visible: boolean) => void;
  color?: string;
  style?: ViewStyle;
}) {
  const [visible, setVisible] = useState(true);
  const [lock, setLock] = useState(false);
  const [showDist, setShowDist] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [description, setDescription] = useState('');

  const renderInputRow = (
    label?: string,
    dropdownId?: string,
    index?: number,
    length?: number,
  ) => {
    return (
      <ToolInput
        label={label}
        data={fractionalInches}
        onSelect={() => {}}
        placeholder="0"
        id={dropdownId || ''}
        isOpen={openDropdownId === dropdownId}
        setOpenDropdownId={() =>
          setOpenDropdownId(prev =>
            prev === dropdownId ? null : dropdownId ?? null,
          )
        }
        style={{ width: 70 }}
      />
    );
  };

  const onEye = () => {
    onEyePress(!visible);
    setVisible(!visible);
  };

  return (
    <View style={[styles.initialContainer, style]}>
      {/* Header */}
      <View style={[styles.rowContainer, { justifyContent: 'space-between' }]}>
        <View style={[styles.rowContainer, { gap: 5, width: '70%' }]}>
          <Badge color={color || '#FBBF24'} />
          <TheText
            text={`${type} Measurement`}
            size={18}
            numberOfLines={1}
            style={{ fontWeight: '600', width: '88%' }}
          />
        </View>
        <View style={[styles.rowContainer, { gap: 5 }]}>
          {visible ? (
            <Eye color="#6B7280" onPress={onEye} />
          ) : (
            <EyeClosed color="#6B7280" onPress={onEye} />
          )}
          <TheToggle value={lock} onValueChange={setLock} />
          <Trash onPress={onDelete} />
        </View>
      </View>

      {/* Type-specific Inputs */}
      {type === 'Tape' && renderInputRow(undefined, 'tape')}

      {type === 'Rake' && (
        <>
          {renderInputRow(undefined, 'rake')}
          <TheButton
            btnTitle="Distance"
            icon={showDist ? <Minus /> : <Plus />}
            onPress={() => setShowDist(!showDist)}
            btnColor={showDist ? '#fbeefdff' : border}
            titleStyle={{ fontWeight: 'bold' }}
            titleColor="black"
          />
          {showDist && renderInputRow(undefined, 'rake-distance')}
        </>
      )}

      {type === 'Laser' && (
        <>
          {renderInputRow('Slide A', 'laser-slide-a')}
          {renderInputRow('Slide B', 'laser-slide-b')}
        </>
      )}

      {type === 'Rectangle' &&
        rectangleLabels.map((label, index) =>
          renderInputRow(label, `rectangle-${index}`),
        )}

      {type === 'Corner' &&
        cornerLabels.map((label, index) =>
          renderInputRow(label, `corner-${index}`, index, cornerLabels.length),
        )}
      {type === 'Note' && (
        <TheDescriptionBox
          placeholder="Enter your note text here"
          value={description}
          onChangeText={setDescription}
        />
      )}
    </View>
  );
}

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

