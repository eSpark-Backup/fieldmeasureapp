import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const TheTool = ({
  toolName,
  onPress,
}: {
  toolName: toolNames;
  onPress?: () => void;
}) => {
  return (
    <TheButton
      onPress={onPress}
      style={styles.toolContainer}
      btnColor={IconAndColor(toolName).color}
      icon={IconAndColor(toolName).icon}
      btnTitle=""
    />
  );
};

const IconAndColor = (value: toolNames) => {
  switch (value) {
    case 'Tape':
      return {
        icon: <Tape width={30} height={30} color={'#1d4ed8'} />,
        color: '#DBEAFE',
      };
    case 'Laser':
      return {
        icon: <Laser width={30} height={30} color={'#b91c1c'} />,
        color: '#FCE2E2',
      };
    case 'Rake':
      return {
        icon: <Rake width={30} height={30} color={'#7e22ce'} />,
        color: '#F3E8FF',
      };
    case 'Rectangle':
      return {
        icon: <Rectangle width={30} height={30} color={'#15803d'} />,
        color: '#DCFCE7',
      };
    case 'Corner':
      return {
        icon: <Corner width={30} height={30} color={'#c2410c'} />,
        color: '#FDEDD5',
      };
    case 'Note':
      return {
        icon: <Note width={30} height={30} color={'#a16207'} />,
        color: '#FEF9C3',
      };
    case 'RoundUp':
      return {
        icon: <RoundUp width={30} height={30} color={'#424866'} />,
        color: '#EAEBEB',
      };
    default:
      return {
        icon: <RoundUp width={30} height={30} color={'#A5A8B6'} />,
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
