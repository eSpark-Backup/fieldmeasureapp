import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import TheTool from '../TheTool';
import GapView from '../GapView';
import TheText from '../TheText';
import { toolNames } from '../../types';

type ToolMenuProps = {
  TOOLS: string[];
  addTool: (tool: toolNames) => void;
};

const ToolMenu: React.FC<ToolMenuProps> = ({ TOOLS, addTool }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelectTool = (tool: toolNames) => {
    addTool(tool);
    setIsMenuOpen(false);
  };

  return (
    <View>
      {/* Hamburger icon button */}
      <TouchableOpacity
        onPress={() => setIsMenuOpen(true)}
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Feather name="tool" size={22} color="#000" />
        <TheText
          text="Add Tool"
          size={16}
          style={{ fontWeight: 'bold', paddingHorizontal: 8 }}
        />
      </TouchableOpacity>

      {/* Modal for tool list */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          <View style={styles.menuContainer}>
            {/* <TheText
              text="Select a Tool"
              size={18}
              style={{ fontWeight: 'bold', paddingLeft: 5 }}
            /> */}
            <FlatList
              data={TOOLS}
              numColumns={2}
              contentContainerStyle={{
                gap: 10,
                paddingVertical: 10,
              }}
              ItemSeparatorComponent={() => <GapView mode="horizontal" />}
              renderItem={({ item, index }) => (
                <TheTool
                  toolName={item as toolNames}
                  onPress={() => handleSelectTool(item as toolNames)}
                  style={{ marginHorizontal: 5 }}
                  key={item + index}
                />
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    gap: 5,
    flex: 1,
    // paddingHorizontal: '8%',
  },
  overlay: {
    // flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 14.5,
    paddingTop: 125,
  },
  menuContainer: {
    width: '20%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    paddingTop: 10,
  },
});

export default ToolMenu;
