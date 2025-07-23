import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  CornerTool,
  LaserTool,
  RakeTool,
  ReactangleTool,
  TapeTool,
  TheText,
  TheTool,
  TheButton,
  TheDropdown,
  TheTextInput,
  TheToggle,
} from '../../components';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg from 'react-native-svg';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Camera,
  Export,
  Eye,
  EyeClosed,
  Minus,
  Plus,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MeasurementProps = NativeStackScreenProps<RootNavParamList, 'Measurement'>;

const Measurement = () => {
  const navigation = useNavigation<MeasurementProps['navigation']>();
  const bottomInset = useSafeAreaInsets().bottom;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [mainLock, setMainLock] = useState(false);
  const snapPoints = useMemo(() => [bottomInset + 30, 650], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const handleToolPress = (toolName: string) => {
    console.log('Selected tool:', toolName);
    setSelectedTools(prev => [...prev, toolName]);
    // Optionally expand the bottom sheet when a tool is selected
    // bottomSheetRef.current?.snapToIndex(1);
  };

  const handleToolDelete = (toolIndex: number) => {
    setSelectedTools(prev => prev.filter((_, index) => index !== toolIndex));
  };

  const renderToolContent = () => {
    return selectedTools.map((tool, index) => {
      const commonProps = {
        onDelete: () => handleToolDelete(index),
        type: tool,
      };

      switch (tool) {
        case 'Tape':
          return (
            <MeasureCard
              key={index + tool}
              {...commonProps}
              color={primaryColor}
            />
          );
        case 'Laser':
          return (
            <MeasureCard key={index + tool} {...commonProps} color="#FBBF24" />
          );
        case 'Rake':
          return (
            <MeasureCard key={index + tool} {...commonProps} color="#BB86FC" />
          );
        case 'Rectangle':
          return (
            <MeasureCard
              key={index + tool}
              {...commonProps}
              color="#86b9fcff"
            />
          );
        case 'Corner':
          return (
            <MeasureCard
              key={index + tool}
              {...commonProps}
              color="#ca5056ff"
            />
          );
        case 'Note':
          return (
            <MeasureCard
              key={index + tool}
              {...commonProps}
              color="#50cac0ff"
            />
          );
        case 'RoundUp':
          bottomSheetRef.current?.snapToIndex(1);
        default:
          return null;
      }
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          marginBottom: bottomInset + 20,
          backgroundColor: '#F9FAFB',
        }}
      >
        {!selectedPhoto ? (
          <TouchableOpacity style={styles.noPhoto} onPress={getImage}>
            <Camera color={'#9CA3AF'} />
            <TheText
              text="No Photo Selected"
              size={18}
              style={{ fontWeight: '500' }}
            />
            <TheText text="Upload a photo to start adding measurements" />
          </TouchableOpacity>
        ) : (
          <>
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
          </>
        )}
        <View style={styles.tools}>
          {TOOLS.map((item, index) => (
            <TheTool
              key={index}
              toolName={item}
              onPress={() => handleToolPress(item)}
            />
          ))}
        </View>
      </View>

      <BottomSheet
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
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
              btnTitle="View Details"
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
              text="Measurements"
              size={24}
              style={{ fontWeight: 'bold', marginVertical: 20 }}
            />
            <TheToggle value={mainLock} onValueChange={setMainLock} large />
          </View>

          {renderToolContent()}
          <TheButton
            btnTitle="Export Report"
            titleStyle={{ fontWeight: 'bold' }}
            icon={<Export />}
            // onPress={handleSaveMeasurements}
          />
        </BottomSheetScrollView>
      </BottomSheet>
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
}: {
  type: string;
  onDelete: () => void;
  color?: string;
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
  ) => (
    <View
      style={[styles.rowContainer, { justifyContent: 'flex-start', gap: 15 }]}
    >
      {label && <TheText text={`${label}:`} style={{ width: '18%' }} />}
      <TheTextInput
        placeholder="Enter length"
        value="0"
        label=""
        style={{ width: 70, marginTop: 10 }}
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
        style={{ width: 70, marginTop: 10 }}
      />
    </View>
  );

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
          renderInputRow(label, false, `corner-${index}`),
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
    marginVertical: 10,
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
    flex: 1,
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
    marginBottom: 20,
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
  scrollContent: {
    paddingBottom: 10,
  },
  handleIndicator: {
    backgroundColor: '#DCDCDC',
    width: 50,
    height: 4,
    borderRadius: 2,
  },
});

export default Measurement;
