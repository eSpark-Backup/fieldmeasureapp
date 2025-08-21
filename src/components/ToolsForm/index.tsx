import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import TheButton from '../TheButton';
import TheText from '../TheText';
import TheToggle from '../TheToggle';
import { Eye, EyeClosed, Minus, Plus, Trash } from '../../assets';
import ToolInput from '../ToolInput';
import { cornerLabels, rectangleLabels } from '../../constants';
import TheDescriptionBox from '../TheDescriptionBox';
import {
  CornerItem,
  LaserItem,
  MeasurementPair,
  NoteItem,
  OnChange,
  RakeItem,
  RectangleItem,
  TapeItem,
  Tool,
  ToolsList,
} from '../../types';
import { border } from '../../constants/colors';

interface FormProps {
  tools: ToolsList;
  onChange: OnChange;
  debounceMs?: number;
}

function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300,
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );
}

export default function ToolsForm({
  tools,
  onChange,
  debounceMs = 200,
}: FormProps) {
  const [items, setItems] = useState<ToolsList>(tools);

  console.log('Items me kia', items);

  useEffect(() => {
    setItems(tools);
  }, [tools]);

  const emitChange = useDebouncedCallback(
    (next: Tool[]) => onChange?.(next),
    debounceMs,
  );

  useEffect(() => {
    emitChange(items);
  }, [items]);

  const updatePair = (id: string, pair: MeasurementPair, key?: string) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        if (it.type === 'Note') return it; // not a pair
        console.log('it kia', it.data);

        const clone: any = { ...it, data: { ...it.data } };
        console.log('clone me kia', clone);
        if (key) {
          clone.data[key] = pair;
        } else {
          clone.data = pair;
        }
        return clone;
      }),
    );
  };

  const updateSingle = (id: string, value: string, key: string) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        if (it.type === 'Note') {
          return { ...it, data: { value } } as NoteItem;
        }
        const clone: any = { ...it, data: { ...(it as any).data } };
        clone.data[key] = value;
        return clone;
      }),
    );
  };

  const updateDist = (id: string, state: boolean) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        return {
          ...it,
          showDist: state,
        };
      }),
    );
  };

  const updateToggle = (id: string, state: boolean) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        return {
          ...it,
          locked: state,
        };
      }),
    );
  };

  const updateEye = (id: string, state: boolean) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        return {
          ...it,
          hidden: state,
        };
      }),
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const renderItem = ({ item }: { item: Tool }) => {
    switch (item.type) {
      case 'Tape': {
        const p = item.data as TapeItem['data'];
        return (
          <Card
            item={item}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            <ToolInput
              id={'tape'}
              pair={{ value: p.value, fraction: p.fraction }}
              selected={p.fraction}
              onChange={pair => updatePair(item.id, pair)}
              placeholder="0"
              style={{ width: 70 }}
            />
          </Card>
        );
      }
      case 'Laser': {
        const p = item.data as LaserItem['data'];
        return (
          <Card
            item={item}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            <ToolInput
              id={'laser'}
              label="Slide A"
              pair={p.SlideA}
              selected={p.SlideA.fraction}
              onChange={pair => updatePair(item.id, pair, 'SlideA')}
              placeholder="0"
              style={{ width: 70 }}
            />
            <ToolInput
              id={'laser'}
              label="Slide B"
              pair={p.SlideB}
              selected={p.SlideB.fraction}
              onChange={pair => updatePair(item.id, pair, 'SlideB')}
              placeholder="0"
              style={{ width: 70 }}
            />
          </Card>
        );
      }
      case 'Rake': {
        const p = item.data as RakeItem['data'];
        const rake = item as RakeItem;
        return (
          <Card
            item={item}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            <ToolInput
              id={'rake'}
              pair={{ value: p.value, fraction: p.fraction }}
              selected={p.fraction}
              onChange={pair =>
                updatePair(item.id, { ...pair, distance: p.distance })
              }
              placeholder="0"
              style={{ width: 70 }}
            />
            <TheButton
              btnTitle="Distance"
              icon={rake.showDist ? <Minus /> : <Plus />}
              onPress={() => updateDist(item.id, !item.showDist)}
              btnColor={rake.showDist ? '#fbeefdff' : border}
              titleStyle={{ fontWeight: 'bold' }}
              titleColor="black"
            />
            {rake.showDist && (
              <ToolInput
                id={'rake-distance'}
                pair={p.distance}
                selected={p.distance.fraction}
                onChange={pair =>
                  updatePair(
                    item.id,
                    { distance: pair, value: p.value, fraction: p.fraction },
                    'distance',
                  )
                }
                placeholder="0"
                style={{ width: 70 }}
              />
            )}
          </Card>
        );
      }
      case 'Rectangle': {
        const p = item.data as RectangleItem['data'];
        const keys = [
          'TopA',
          'TopB',
          'RightA',
          'RightB',
          'BotA',
          'BotB',
          'LeftA',
          'LeftB',
        ] as const;
        return (
          <Card
            item={item}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            {keys.map((k, index) => (
              <ToolInput
                id={`rectangle-${index}`}
                label={k}
                pair={p[k]}
                selected={p[k].fraction}
                onChange={pair => updatePair(item.id, pair, k)}
                placeholder="0"
                style={{ width: 70 }}
              />
            ))}
          </Card>
        );
      }
      case 'Corner': {
        const p = item.data as CornerItem['data'];
        const keys = [
          'TopLA',
          'TopLB',
          'TopRA',
          'TopRB',
          'LeftA',
          'LeftB',
          'CenterA',
          'CenterB',
          'RightA',
          'RightB',
          'BotLA',
          'BotLB',
          'BotRA',
          'BotRB',
        ] as const;
        return (
          <Card
            item={item}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            {keys.map((k, index) => (
              <ToolInput
                id={`corner-${index}`}
                label={k}
                pair={p[k]}
                selected={p[k].fraction}
                onChange={pair => updatePair(item.id, pair, k)}
                placeholder="0"
                style={{ width: 70 }}
              />
            ))}
          </Card>
        );
      }
      case 'Note': {
        return (
          <Card
            item={item}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            <TheDescriptionBox
              placeholder="Enter your note text here"
              value={(item as NoteItem).data.value}
              onChangeText={t => updateSingle(item.id, t, 'value')}
            />
          </Card>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {items.map((tool, index) => (
        <View style={{ zIndex: 10 + tools.length - index }}>
          {renderItem({ item: tool })}
        </View>
      ))}
      {/* <Card
          id={tool.id}
          type={tool.type}
          style={{ zIndex: 10 + tools.length - index }}
          data={tool.data}
          onValueChange={(id, label, value, fraction) => {
            onChange({
              id: id,
              label: label,
              value: value,
              fraction: fraction,
            });
            console.log(
              'value changed',
              'id',
              id,
              'label',
              label,
              'value',
              value,
              'fraction',
              fraction,
            );
          }}
        /> */}
      {/* <TheButton
        btnTitle="Save"
        titleStyle={{ fontWeight: 'bold' }}
        // icon={<Export />}
        onPress={() => console.log('hello')}
        style={{ marginTop: 10 }}
      /> */}
    </View>
  );
}

const Card = ({
  item,
  style,
  children,
  onDelete,
  onToggle,
  onEye,
}: {
  item: Tool;
  onToggle: () => void;
  onDelete: () => void;
  onEye: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}) => {
  return (
    <View style={[styles.initialContainer, style]}>
      {/* Header */}
      <View style={[styles.rowContainer, { justifyContent: 'space-between' }]}>
        <View style={[styles.rowContainer, { gap: 5, width: '70%' }]}>
          {/* <Badge color={color || '#FBBF24'} /> */}
          <TheText
            text={item.type == 'Note' ? item.type : `${item.type} Measurement`}
            size={18}
            numberOfLines={1}
            style={{ fontWeight: '600', width: '88%' }}
          />
        </View>
        <View style={[styles.rowContainer, { gap: 5 }]}>
          {item.hidden ? (
            <EyeClosed color="#6B7280" onPress={onEye} />
          ) : (
            <Eye color="#6B7280" onPress={onEye} />
          )}
          <TheToggle value={item.locked} onValueChange={onToggle} />
          <Trash onPress={onDelete} />
        </View>
      </View>

      {children}

      {/* Type-specific Inputs */}
      {/* {type === 'Tape' && (
        <RenderInputRow
          dropdownId="tape"
          value={data.value}
          fraction={data.fraction}
          onChange={({ key, value }) => console.log('key', key, 'value', value)}
        />
      )}
      {type === 'Laser' && (
        <>
          <RenderInputRow
            label="Slide A"
            dropdownId="laser-slide-a"
            value={data.SlideA.value}
            fraction={data.SlideA.fraction}
            onChange={({ key, value }) =>
              console.log('key', key, 'value', value)
            }
          />
          <RenderInputRow
            label="Slide B"
            dropdownId="laser-slide-b"
            value={data.SlideB.value}
            fraction={data.SlideB.fraction}
            onChange={({ key, value }) =>
              console.log('key', key, 'value', value)
            }
          />
        </>
      )}
      {type === 'Rectangle' &&
        rectangleLabels.map((label, index) => (
          <RenderInputRow
            label={label}
            dropdownId={`rectangle-${index}`}
            onChange={({ key, value }) =>
              console.log('key', key, 'value', value)
            }
          />
        ))}

      {type === 'Corner' &&
        cornerLabels.map((label, index) => (
          <RenderInputRow
            label={label}
            dropdownId={`corner-${index}`}
            index={index}
            length={cornerLabels.length}
            onChange={({ key, value }) =>
              console.log('key', key, 'value', value)
            }
          />
        ))}
      {type === 'Note' && (
        <TheDescriptionBox
          placeholder="Enter your note text here"
          value={data.value}
          onChangeText={text => console.log('value', text)}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
