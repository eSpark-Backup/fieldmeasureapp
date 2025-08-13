import { StyleProp, StyleSheet } from 'react-native';
import React from 'react';
import {
  Corner,
  Laser,
  Note,
  Rake,
  Rectangle,
  RoundUp,
  Tape,
} from '../../assets';
import TheButton from '../TheButton';
import { toolNames } from '../../types';
import { ViewStyle } from 'react-native';

const TheTool = ({
  toolName,
  onPress,
  style,
}: {
  toolName: toolNames;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TheButton
      onPress={onPress}
      style={[styles.toolContainer, style]}
      btnColor={IconAndColor(toolName).color}
      // icon={IconAndColor(toolName).icon}
      btnTitle={IconAndColor(toolName).title}
      titleColor={IconAndColor(toolName).btnColor}
      titleStyle={{ fontWeight: '500' }}
    />
  );
};

const IconAndColor = (value: toolNames) => {
  switch (value) {
    case 'Tape':
      return {
        // icon: <Tape width={30} height={30} color={'#1d4ed8'} />,
        title: 'Tape',
        color: '#DBEAFE',
        btnColor: '#1d4ed8',
      };
    case 'Laser':
      return {
        // icon: <Laser width={30} height={30} color={'#b91c1c'} />,
        title: 'Laser',
        color: '#FCE2E2',
        btnColor: '#b91c1c',
      };
    case 'Rake':
      return {
        // icon: <Rake width={30} height={30} color={'#7e22ce'} />,
        title: 'Rake',
        color: '#F3E8FF',
        btnColor: '#7e22ce',
      };
    case 'Rectangle':
      return {
        // icon: <Rectangle width={30} height={30} color={'#15803d'} />,
        title: 'Rectangle',
        color: '#DCFCE7',
        btnColor: '#15803d',
      };
    case 'Corner':
      return {
        // icon: <Corner width={30} height={30} color={'#c2410c'} />,
        title: 'Corner',
        color: '#FDEDD5',
        btnColor: '#c2410c',
      };
    case 'Note':
      return {
        // icon: <Note width={30} height={30} color={'#a16207'} />,
        title: 'Note',
        color: '#FEF9C3',
        btnColor: '#a16207',
      };
    // case 'RoundUp':
    //   return {
    //     icon: <RoundUp width={30} height={30} color={'#424866'} />,
    //     color: '#EAEBEB',
    //   };
    default:
      return {
        // icon: <RoundUp width={30} height={30} color={'#A5A8B6'} />,
        title: 'Note',
        color: '#EAEBEB',
      };
  }
};

export default TheTool;

const styles = StyleSheet.create({
  toolContainer: {
    flex: 1,
    paddingHorizontal: 0,
    borderRadius: 10,
    elevation: 1,
  },
});
