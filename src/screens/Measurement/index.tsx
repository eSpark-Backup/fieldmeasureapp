import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Image, Dimensions, ViewStyle } from 'react-native';
import {
  CornerTool,
  LaserTool,
  RakeTool,
  TapeTool,
  TheText,
  TheTool,
  TheButton,
  TheDropdown,
  TheTextInput,
  TheToggle,
  GapView,
  RectangleTool,
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
import Animated, {
  clamp,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { Measure, Project } from '../../types';
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
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
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

  const [scaleVal, setScaleVal] = useState(1);

  const ref = useRef<ViewShot>(null);

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const translateY = useSharedValue(0);

  const prevTranslationY = useSharedValue(0);

  // 🧠 On mount, prefill if editing
  useEffect(() => {
    if (existingMeasure) {
      setTempMeasure(existingMeasure.details);
      setLocation(existingMeasure.location || '');
    } else {
      clearTempMeasure();
    }
  }, [existingMeasure]);

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

    if (tempMeasure == null) {
      showToast('Add measure details data to save.');
      return;
    }

    const newMeasure: Measure = {
      id: existingMeasure?.id || uuid.v4().toString(),
      location,
      details: tempMeasure,
      timestamp: Date.now(),
    };

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
      prevTranslationY.value = translateY.value;
    })
    .onUpdate(e => {
      translateY.value = clamp(
        prevTranslationY.value + e.translationY,
        -height / 2,
        height / 2,
      );
    })
    .onEnd(e => {
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
  //             style={{ zIndex: 1000 + selectedTools.length - index }}
  //             color={primaryColor}
  //           />
  //         );
  //       case 'Laser':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             style={{ zIndex: 100 + selectedTools.length - index }}
  //             color="#FBBF24"
  //           />
  //         );
  //       case 'Rake':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             style={{ zIndex: 100 + selectedTools.length - index }}
  //             color="#BB86FC"
  //           />
  //         );
  //       case 'Rectangle':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             style={{ zIndex: 100 + selectedTools.length - index }}
  //             color="#86b9fcff"
  //           />
  //         );
  //       case 'Corner':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             style={{ zIndex: 100 + selectedTools.length - index }}
  //             color="#ca5056ff"
  //           />
  //         );
  //       case 'Note':
  //         return (
  //           <MeasureCard
  //             key={index + tool}
  //             {...commonProps}
  //             style={{ zIndex: 100 + selectedTools.length - index }}
  //             color="#50cac0ff"
  //           />
  //         );
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
            onDelete={() => setTapeT(false)}
            type={'Tape'}
            style={{ zIndex: 1000 }}
            color={primaryColor}
          />
        )}
        {LaserT && (
          <MeasureCard
            onDelete={() => setTapeT(false)}
            type={'Laser'}
            style={{ zIndex: 1000 }}
            color="#FBBF24"
          />
        )}
        {RakeT && (
          <MeasureCard
            onDelete={() => setTapeT(false)}
            type={'Rake'}
            style={{ zIndex: 1000 }}
            color="#BB86FC"
          />
        )}
        {RectanlgeT && (
          <MeasureCard
            onDelete={() => setTapeT(false)}
            type={'Rectangle'}
            style={{ zIndex: 1000 }}
            color="#86b9fcff"
          />
        )}
        {CornerT && (
          <MeasureCard
            onDelete={() => setTapeT(false)}
            type={'Corner'}
            style={{ zIndex: 1000 }}
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
                  {TapeT && <TapeTool scaleValue={scaleVal} />}
                  {LaserT && <LaserTool />}
                  {RakeT && <RakeTool />}
                  {RectanlgeT && <RectangleTool />}
                  {CornerT && <CornerTool />}
                </Svg>
              </Animated.View>
            </GestureDetector>
          </ViewShot>
        )}

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.tools}>
            {TOOLS.map((item, index) => (
              <TheTool
                key={index}
                toolName={item}
                onPress={() => handleToolPress(item)}
              />
            ))}
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
              text={`Measurements(${selectedTools.length})`}
              size={23}
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

      {/* <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.handleIndicator}
        maxDynamicContentSize={650}
        animateOnMount={true}
        activeOffsetY={[-5, 5]}
        failOffsetX={[-5, 5]}
        simultaneousHandlers={undefined}
        handleStyle={{
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#DCDCDC',
          paddingBottom: 30,
        }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          keyboardShouldPersistTaps={'handled'}
        >
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
                navigation.navigate('AllDetails', {
                  projectId: '123135',
                  title: 'John',
                  address: '132132 adjvdjs',
                  date: '2024-01-01',
                  extraInfo: 'Additional info here',
                });
              }}
              titleStyle={{ fontWeight: 'bold' }}
              btnColor={'#fcac17ff'}
            />
          </View>
          <View
            style={[styles.rowContainer, { justifyContent: 'space-between' }]}
          >
            <TheText
              text={`Measurements(${selectedTools.length})`}
              size={23}
              style={{ fontWeight: 'bold', marginVertical: 20 }}
            />
            <View style={styles.rowContainer}>
              <TheText style={{ fontWeight: '500' }} text="Lock All" />
              <GapView mode="horizontal" />
              <TheToggle value={mainLock} onValueChange={setMainLock} large />
            </View>
          </View>

          {renderToolContent()}
          <TheButton
            btnTitle="Export Report"
            titleStyle={{ fontWeight: 'bold' }}
            icon={<Export />}
            // onPress={handleSaveMeasurements}
          />
          <GapView length={useSafeAreaInsets().bottom + 10} />
        </BottomSheetScrollView>
      </BottomSheet> */}
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
  color,
  style,
}: {
  type: string;
  onDelete: () => void;
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
    isNum?: boolean,
    dropdownId?: string,
    index?: number,
    length?: number,
  ) => {
    return (
      <View
        style={[
          styles.rowContainer,
          style,
          {
            justifyContent: 'flex-start',
            gap: 15,
          },
        ]}
      >
        {label && <TheText text={`${label}:`} style={{ width: '18%' }} />}
        <TheTextInput
          placeholder="Enter length"
          value="0"
          label=""
          style={{ width: 70 }}
          isNum={isNum}
        />
        <TheText text="in" size={16} />
        <TheDropdown
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
          style={{
            width: 70,
          }}
        />
      </View>
    );
  };
  return (
    <View style={styles.initialContainer}>
      {/* Header */}
      <View style={[styles.rowContainer, { justifyContent: 'space-between' }]}>
        <View style={[styles.rowContainer, { gap: 5, width: '70%' }]}>
          <Badge color={color || '#FBBF24'} />
          <TheText
            text={`${type} Measurement`}
            size={18}
            style={{ fontWeight: '600' }}
          />
        </View>
        <View style={[styles.rowContainer, { gap: 5 }]}>
          {visible ? (
            <Eye color="#6B7280" onPress={() => setVisible(false)} />
          ) : (
            <EyeClosed color="#6B7280" onPress={() => setVisible(true)} />
          )}
          <TheToggle value={lock} onValueChange={setLock} />
          <Trash onPress={onDelete} />
        </View>
      </View>

      {/* Type-specific Inputs */}
      {type === 'Tape' && renderInputRow(undefined, false, 'tape')}

      {type === 'Rake' && (
        <>
          {renderInputRow(undefined, false, 'rake')}
          <TheButton
            btnTitle="Distance"
            icon={showDist ? <Minus /> : <Plus />}
            onPress={() => setShowDist(!showDist)}
            btnColor={showDist ? '#fbeefdff' : border}
            titleStyle={{ fontWeight: 'bold' }}
            titleColor="black"
          />
          {showDist && renderInputRow(undefined, false, 'rake-distance')}
        </>
      )}

      {type === 'Laser' && (
        <>
          {renderInputRow('Slide A', true, 'laser-slide-a')}
          {renderInputRow('Slide B', true, 'laser-slide-b')}
        </>
      )}

      {type === 'Rectangle' &&
        rectangleLabels.map((label, index) =>
          renderInputRow(label, false, `rectangle-${index}`),
        )}

      {type === 'Corner' &&
        cornerLabels.map((label, index) =>
          renderInputRow(
            label,
            false,
            `corner-${index}`,
            index,
            cornerLabels.length,
          ),
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
