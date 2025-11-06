import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Svg, { Rect } from 'react-native-svg';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import uuid from 'react-native-uuid';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

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
// import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { Camera, RoundPlus, Upload } from '../../assets';

import { TOOLS } from '../../constants';
import { border } from '../../constants/colors';
import { RootNavParamList } from '../../types/navigationParams';
import { createNewTool, pdfHTML } from './utils';
import {
  CanvasVals,
  Measure,
  Project,
  Tool,
  ToolsList,
  RakeItem,
  MeasurementPair,
} from '../../types';
import { useProjectStore } from '../../store/ProjectsStore';
import { showToast } from '../../utils/showToast';
import ToolsForm from '../../components/ToolsForm';
import ToolMenu from '../../components/ToolMenu';

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

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (selectedPhoto) {
      Image.getSize(selectedPhoto, (w, h) => {
        setImageSize({ width: w, height: h });
      });
    }
  }, [selectedPhoto]);

  const getDisplayedSize = () => {
    if (containerSize.width === 0 || containerSize.height === 0)
      return { width: 0, height: 0, offsetX: 0, offsetY: 0 };

    const imageAspect = imageSize.width / imageSize.height;
    const containerAspect = containerSize.width / containerSize.height;

    if (imageAspect > containerAspect) {
      // limited by width
      const width = containerSize.width;
      const height = containerSize.width / imageAspect;
      return {
        width,
        height,
        offsetX: 0,
        offsetY: (containerSize.height - height) / 2, // vertical centering
      };
    } else {
      // limited by height
      const height = containerSize.height;
      const width = containerSize.height * imageAspect;
      return {
        width,
        height,
        offsetX: (containerSize.width - width) / 2, // horizontal centering
        offsetY: 0,
      };
    }
  };

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
      handleSaveMeasurements(() => {
        navigation.dispatch(e.data.action);
      });
      // Alert.alert(
      //   'Save Changes?',
      //   'Would you like to save your measurements before leaving?',
      //   [
      //     {
      //       text: "Don't Save",
      //       style: 'destructive',
      //       onPress: () => navigation.dispatch(e.data.action),
      //     },
      //     {
      //       text: 'Save',
      //       style: 'default',
      //       onPress: () => {
      //         handleSaveMeasurements(() => {
      //           navigation.dispatch(e.data.action);
      //         });
      //       },
      //     },
      //     { text: 'Cancel', style: 'cancel' },
      //   ],
      // );
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

    // if (tempMeasure == null) {
    //   showToast('Add measure details data to save.');
    //   skipPromptRef.current = false;
    //   return false;
    // }

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
    (newScale, prevScale) => {
      // update React state
      runOnJS(setScaleVal)(newScale);

      // reset pan position when scale returns to 1
      if (
        prevScale &&
        Math.abs(newScale - 1) < 0.01 &&
        Math.abs(prevScale - 1) >= 0.01
      ) {
        translateY.value = withTiming(0, { duration: 200 });
      }
    },
  );

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate(event => {
      scale.value = clamp(startScale.value * event.scale, 1, 2);
    });

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

  const updateFocus = (id: string, data: any) => {
    console.log('shared data', data);

    setTools(prev => {
      // First, find any tool that is currently focused
      const focusedTool = prev.find(tool => {
        const toolData = tool.data as any;
        // Check if the tool has focused state in any measurement
        if (tool.type === 'Rake') {
          // Check both main measurement and distance for Rake tools
          const rakeData = toolData as RakeItem['data'];
          return rakeData.focused || rakeData.distance?.focused;
        }
        return (
          toolData.focused || // Direct focus (like Note)
          (typeof toolData === 'object' &&
            Object.values(toolData).some(
              (val: any) => val?.focused, // Nested focus (like Rectangle/Corner measurements)
            ))
        );
      });

      return prev.map(it => {
        // If this is a currently focused tool that's not the target tool, unfocus it
        if (focusedTool && it.id === focusedTool.id && it.id !== id) {
          if (it.type === 'Rake') {
            // Handle Rake tool's main and distance measurements safely
            const rakeData = { ...(it.data as RakeItem['data']) };
            // Clear main measurement focus if it exists
            if ('focused' in rakeData) {
              rakeData.focused = false;
            }
            // Clear distance measurement focus if it exists
            if (rakeData.distance) {
              rakeData.distance = {
                ...rakeData.distance,
                focused: false,
              };
            }
            return { ...it, data: rakeData };
          }
          if (it.type === 'Laser') {
            // Properly unfocus both sides of Laser tool
            const laserData = { ...it.data };
            if (laserData.SideA?.focused) {
              laserData.SideA = { ...laserData.SideA, focused: false };
            }
            if (laserData.SideB?.focused) {
              laserData.SideB = { ...laserData.SideB, focused: false };
            }
            return { ...it, data: laserData };
          }
          if (it.type === 'Rectangle') {
            // Unfocus all sides of Rectangle
            const rectangleData = { ...it.data };
            (
              Object.keys(rectangleData) as Array<keyof typeof rectangleData>
            ).forEach(key => {
              rectangleData[key] = {
                ...rectangleData[key],
                focused: false,
              };
            });
            return { ...it, data: rectangleData };
          }
          if (it.type === 'Corner') {
            // Unfocus all sides of Rectangle
            const cornerData = { ...it.data };
            (Object.keys(cornerData) as Array<keyof typeof cornerData>).forEach(
              key => {
                cornerData[key] = {
                  ...cornerData[key],
                  focused: false,
                };
              },
            );
            return { ...it, data: cornerData };
          }
          const unfocusedData = { ...it.data };
          if ('focused' in unfocusedData) {
            unfocusedData.focused = false;
          } else {
            // For tools with multiple measurements (Rectangle/Corner/etc)
            Object.keys(unfocusedData).forEach(key => {
              if ((unfocusedData as any)[key]?.focused) {
                (unfocusedData as any)[key].focused = false;
              }
            });
          }
          return { ...it, data: unfocusedData };
        }
        // Update the target tool with new focus state
        if (it.id === id) {
          return { ...it, data };
        }
        return it;
      });
    });
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

  const toPercentCoords = (
    xArr: number[],
    yArr: number[],
    displayedSize: CanvasVals,
  ) => {
    const percentX = xArr.map(
      x => ((x - displayedSize.offsetX) / displayedSize.width) * 100,
    );
    const percentY = yArr.map(
      y => ((y - displayedSize.offsetY) / displayedSize.height) * 100,
    );
    return { x: percentX, y: percentY };
  };

  const toPixelCoords = (
    xPercent: number[],
    yPercent: number[],
    displayedSize: CanvasVals,
  ) => {
    const xCoords = xPercent?.map(
      x => displayedSize.offsetX + (x / 100) * displayedSize.width,
    );
    const yCoords = yPercent?.map(
      y => displayedSize.offsetY + (y / 100) * displayedSize.height,
    );
    return { x: xCoords, y: yCoords };
  };

  let tapeCount = 0;
  let laserCount = 0;
  let rakeCount = 0;

  const renderTools = (tool: Tool) => {
    if (tool.hidden) return null;

    // Convert percentage → pixels for rendering
    const { x: xCoords, y: yCoords } = toPixelCoords(
      tool.xCoords,
      tool.yCoords,
      displayedSize,
    );

    const { x: xCoordsDist, y: yCoordsDist } = toPixelCoords(
      tool.type == 'Rake' && tool.showDist ? tool?.xCoordsDist : [0, 0],
      tool.type == 'Rake' && tool.showDist ? tool?.yCoordsDist : [0, 0],
      displayedSize,
    );

    switch (tool.type) {
      case 'Tape': {
        tapeCount++;
        return (
          <TapeTool
            key={tool.id}
            scaleValue={scaleVal}
            baseColor={tool.color}
            getCoords={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateCoords(tool.id, x, y);
              console.log('Now at %:', x, y);
            }}
            xCoords={xCoords}
            yCoords={yCoords}
            tapeNumber={tapeCount}
            data={tool.data}
            locked={tool.locked}
            canvasSize={displayedSize}
            onLabelPress={data => updateFocus(tool.id, data)}
          />
        );
      }
      case 'Laser': {
        laserCount++;
        return (
          <LaserTool
            key={tool.id}
            scaleValue={scaleVal}
            baseColor={tool.color}
            getCoords={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateCoords(tool.id, x, y);
              console.log('Now at %:', x, y);
            }}
            xCoords={xCoords}
            yCoords={yCoords}
            laserNumber={laserCount}
            data={tool.data}
            locked={tool.locked}
            canvasSize={displayedSize}
            onLabelPress={data => updateFocus(tool.id, data)}
          />
        );
      }
      case 'Rake': {
        rakeCount++;
        return (
          <RakeTool
            key={tool.id}
            scaleValue={scaleVal}
            baseColor={tool.color}
            getCoords={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateCoords(tool.id, x, y);
              console.log('Now at %:', x, y);
            }}
            getCoordsDist={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateDistCoords(tool.id, x, y);
              console.log('Now at Dist%:', x, y);
            }}
            xCoords={xCoords}
            yCoords={yCoords}
            xCoordsDist={xCoordsDist}
            yCoordsDist={yCoordsDist}
            rakeNumber={rakeCount}
            showDist={tool.showDist}
            data={tool.data}
            locked={tool.locked}
            canvasSize={displayedSize}
            onLabelPress={data => updateFocus(tool.id, data)}
          />
        );
      }
      case 'Rectangle': {
        return (
          <RectangleTool
            key={tool.id}
            scaleValue={scaleVal}
            baseColor={tool.color}
            getCoords={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateCoords(tool.id, x, y);
              console.log('Now at %:', x, y);
            }}
            xCoords={xCoords}
            yCoords={yCoords}
            data={tool.data}
            locked={tool.locked}
            canvasSize={displayedSize}
            onLabelPress={data => updateFocus(tool.id, data)}
          />
        );
      }
      case 'Corner': {
        return (
          <CornerTool
            key={tool.id}
            scaleValue={scaleVal}
            baseColor={tool.color}
            getCoords={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateCoords(tool.id, x, y);
              console.log('Now at %:', x, y);
            }}
            xCoords={xCoords}
            yCoords={yCoords}
            data={tool.data}
            locked={tool.locked}
            canvasSize={displayedSize}
            onLabelPress={data => updateFocus(tool.id, data)}
          />
        );
      }
      case 'Note': {
        return (
          <NoteTool
            key={tool.id}
            scaleValue={scaleVal}
            baseColor={tool.color}
            getCoords={(xArr, yArr) => {
              const { x, y } = toPercentCoords(xArr, yArr, displayedSize);
              updateCoords(tool.id, x, y);
              console.log('Now at %:', x, y);
            }}
            xCoords={xCoords}
            yCoords={yCoords}
            data={tool.data}
            locked={tool.locked}
            canvasSize={displayedSize}
            onLabelPress={data => updateFocus(tool.id, data)}
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

  const displayedSize = getDisplayedSize();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'row',
          marginRight: 10,
          marginTop: bottomInset,
          marginBottom: bottomInset,
          backgroundColor: '#F9FAFB',
          gap: 10,
        }}
        nestedScrollEnabled={true}
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
              width: '76%',
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
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    alignSelf: 'center',
                  }}
                  source={{ uri: selectedPhoto }}
                  onLayout={event => {
                    const { width, height } = event.nativeEvent.layout;
                    setContainerSize({ width, height });
                    console.log('width', width);
                    console.log('height', height);
                  }}
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

        <ScrollView
          // style={{ backgroundColor: 'pink' }}
          // contentContainerStyle={{ width: '50%' }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.tools}>
            <ToolMenu TOOLS={TOOLS} addTool={addTool} />
            <TheButton
              btnTitle=""
              icon={<Upload />}
              titleStyle={{ fontWeight: 'bold' }}
              onPress={getImage}
              style={{ flex: 1 }}
            />
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
            style={{ marginTop: 20 }}
          />
          <GapView length={useSafeAreaInsets().bottom + 10} />
        </ScrollView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

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
    width: '76%',
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
