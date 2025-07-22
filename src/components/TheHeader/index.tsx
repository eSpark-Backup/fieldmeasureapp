import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Back } from '../../assets';
import TheText from '../TheText';
import { border } from '../../constants/colors';
import GapView from '../GapView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TheHeaderProps {
  onBackPress: () => void;
  projectId?: string;
  title?: string;
  address?: string;
  date?: string;
  extraInfo?: string;
}

const TheHeader: React.FC<TheHeaderProps> = ({
  onBackPress,
  projectId = '123135',
  title = 'Default Title',
  address = 'Default Address',
  date = '21/07/2025',
  extraInfo = 'Default Extra Info',
}) => {
  return (
    <View style={styles.container}>
      <Back onPress={onBackPress} />
      <View>
        <View style={styles.row}>
          <View style={styles.badge}>
            <TheText style={styles.badgeText} text={projectId} size={10} />
          </View>
          <TheText style={styles.title} text={title} size={16} />
        </View>
        <View style={[styles.row]}>
          <TheText style={styles.subText} size={10} text={address} />
          <Separator />
          <TheText style={styles.subText} size={10} text={extraInfo} />
          <Separator />
          <TheText style={styles.subText} size={10} text={date} />
        </View>
      </View>
    </View>
  );
};

const Separator = () => {
  return (
    <View
      style={{
        aspectRatio: 1,
        backgroundColor: 'grey',
        width: 3,
        alignSelf: 'center',
        borderRadius: 50,
        marginTop: 2,
        marginHorizontal: 3,
      }}
    />
  );
};

export default TheHeader;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subText: {
    color: '#555',
  },
});
