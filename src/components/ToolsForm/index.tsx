import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ColorValue,
  TextInput,
  Alert,
} from 'react-native';
import TheButton from '../TheButton';
import TheText from '../TheText';
import TheToggle from '../TheToggle';
import { Eye, EyeClosed, Minus, Plus, Trash } from '../../assets';
import ToolInput from '../ToolInput';
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
  // const [items, setItems] = useState<ToolsList>(tools);
  const [focusedPair, setFocusedPair] = useState<{
    toolId: string;
    key?: string;
    pair?: MeasurementPair;
    refKey?: string;
  } | null>(null);
  const inputRef = useRef<TextInput>(null);
  // map of input refs keyed by a unique id (we'll prefix with tool.id)
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  // map of tool.id -> (pairKey -> inputId) so we can find refs by pair key names
  const inputIdMap = useRef<Record<string, Record<string, string>>>({});
  // flag to skip focus/blur logic during programmatic updates (e.g. updatePair)
  const skipFocusRef = useRef(false);

  const findFocusedPair = (tool: Tool): void => {
    if (tool.type === 'Note') setFocusedPair(null);
    const data: any = tool.data;
    const map = inputIdMap.current[tool.id] || {};

    // Tape / Rake primary
    if (tool.type === 'Tape' || tool.type === 'Rake') {
      const pair: MeasurementPair = data as any;
      const refKey = map['primary'] || `${tool.id}-${tool.type.toLowerCase()}`;
      setFocusedPair({ toolId: tool.id, key: undefined, pair, refKey });
    }

    if (tool.type === 'Laser') {
      if (data.SideA?.focused)
        setFocusedPair({
          toolId: tool.id,
          key: 'SideA',
          pair: data.SideA,
          refKey: map['SideA'],
        });
      if (data.SideB?.focused)
        setFocusedPair({
          toolId: tool.id,
          key: 'SideB',
          pair: data.SideB,
          refKey: map['SideB'],
        });
      // default to SideA
      setFocusedPair({
        toolId: tool.id,
        key: 'SideA',
        pair: data.SideA,
        refKey: map['SideA'],
      });
    }

    // Rectangle / Corner: check map entries for focused flag
    for (const key of Object.keys(map)) {
      const pair = data[key];
      if (
        pair &&
        typeof pair === 'object' &&
        'focused' in pair &&
        pair.focused
      ) {
        setFocusedPair({ toolId: tool.id, key, pair, refKey: map[key] });
      }
    }

    // fallback: try to return first mapping
    const first = Object.keys(map)[0];
    if (first)
      setFocusedPair({
        toolId: tool.id,
        key: first,
        pair: data[first],
        refKey: map[first],
      });

    setFocusedPair(null);
  };

  // console.log('Items me kia', items);

  // useEffect(() => {
  //   setItems(tools);
  // }, [tools]);

  const emitChange = useDebouncedCallback(
    (next: Tool[]) => onChange?.(next),
    debounceMs,
  );

  // useEffect(() => {
  //   emitChange(items);
  // }, [items]);

  const updatePair = (id: string, pair: MeasurementPair, key?: string) => {
    // prevent focus/blur side-effects that run during render caused by this update
    skipFocusRef.current = true;
    const updatedTools = tools.map(it => {
      if (it.id !== id) return it;
      if (it.type === 'Note') return it;

      const clone: any = { ...it, data: { ...it.data } };
      if (key) {
        clone.data[key] = pair;
      } else {
        clone.data = pair;
      }
      return clone;
    });
    onChange(updatedTools);
    // clear the skip flag on next tick so normal focus handling resumes
    setTimeout(() => {
      skipFocusRef.current = false;
    }, 0);
  };

  const updateSingle = (id: string, value: string | boolean, key: string) => {
    const updatedTools = tools.map(it => {
      if (it.id !== id) return it;
      if (it.type === 'Note') {
        return { ...it, data: { ...it.data, [key]: value } } as NoteItem;
      }
      const clone: any = { ...it, data: { ...(it as any).data } };
      clone.data[key] = value;
      return clone;
    });
    onChange(updatedTools);
  };

  const updateDist = (id: string, state: boolean) => {
    const updatedTools = tools.map(it => {
      if (it.id !== id) return it;
      return {
        ...it,
        showDist: state,
      };
    });
    onChange(updatedTools);
  };

  const updateToggle = (id: string, state: boolean) => {
    const updatedTools = tools.map(it => {
      if (it.id !== id) return it;
      return {
        ...it,
        locked: state,
      };
    });
    onChange(updatedTools);
  };

  const updateEye = (id: string, state: boolean) => {
    const updatedTools = tools.map(it => {
      if (it.id !== id) return it;
      return {
        ...it,
        hidden: state,
      };
    });
    onChange(updatedTools);
  };

  const deleteItem = (id: string) => {
    Alert.alert('Deleting Tool', 'Are you sure you want to delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          console.log('❌ Save canceled');
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedTools = tools.filter(it => it.id !== id);
          onChange(updatedTools);
        },
      },
    ]);
  };

  // const updateFocus = (id: string, state: boolean) => {
  //   setItems(prev =>
  //     prev.map(it => {
  //       if (it.id !== id) return it;
  //       return {
  //         ...it,
  //         data: { ...it.data, focused: state },
  //       };
  //     }),
  //   );
  // };

  // const deleteItem = (id: string) => {
  //   setItems(prev => prev.filter(it => it.id !== id));
  // };

  let tapeCount = 0;
  let laserCount = 0;
  let rakeCount = 0;

  // Helper function to calculate variance between rectangle measurements
  const calculateVariance = (value1: number, value2: number): boolean => {
    const difference = Math.abs(value1 - value2);
    return difference > 0.5; // More than 1/2" difference
  };

  // Helper function to convert inches and fraction to decimal
  const convertToDecimal = (
    inches: number = 0,
    fractionStr: string = '0',
  ): number => {
    let fractionValue = 0;
    if (fractionStr !== '0') {
      const [numerator, denominator] = fractionStr.split('/').map(Number);
      fractionValue = numerator / denominator;
    }
    return inches + fractionValue;
  };

  // Helper function to check if measurement has variance warning
  const hasVarianceWarning = (
    type: Tool['type'],
    measurement: RectangleItem['data'] | CornerItem['data'],
    field: string,
  ): boolean => {
    const measure = measurement as RectangleItem['data'];

    if (type === 'Rectangle') {
      const topA = convertToDecimal(
        Number(measure.TopA.value || '0'),
        measure.TopA.fraction || '0',
      );
      const topB = convertToDecimal(
        Number(measure.TopB.value || '0'),
        measure.TopB.fraction || '0',
      );
      const bottomA = convertToDecimal(
        Number(measure.BotA.value || '0'),
        measure.BotA.fraction || '0',
      );
      const bottomB = convertToDecimal(
        Number(measure.BotB.value || '0'),
        measure.BotB.fraction || '0',
      );
      const leftA = convertToDecimal(
        Number(measure.LeftA.value || '0'),
        measure.LeftA.fraction || '0',
      );
      const leftB = convertToDecimal(
        Number(measure.LeftB.value || '0'),
        measure.LeftB.fraction || '0',
      );
      const rightA = convertToDecimal(
        Number(measure.RightA.value || '0'),
        measure.RightA.fraction || '0',
      );
      const rightB = convertToDecimal(
        Number(measure.RightB.value || '0'),
        measure.RightB.fraction || '0',
      );

      console.log('Cnverted topA', topA);
      console.log('Cnverted bottomA', bottomA);
      console.log(
        'calculateVariance(topA, bottomA)',
        calculateVariance(topA, bottomA),
      );

      switch (field) {
        case 'TopA':
        case 'BotA':
          return calculateVariance(topA, bottomA);
        case 'TopB':
        case 'BotB':
          return calculateVariance(topB, bottomB);
        case 'LeftA':
        case 'RightA':
          return calculateVariance(leftA, rightA);
        case 'LeftB':
        case 'RightB':
          return calculateVariance(leftB, rightB);
        default:
          return false;
      }
    } else if (type === 'Corner') {
      const m = measurement as CornerItem['data'];

      switch (field) {
        // Top L A to Bottom L A
        case 'TopLA':
        case 'BotLA':
          const topLA = convertToDecimal(
            Number(m.TopLA.value || '0'),
            m.TopLA.fraction || '0',
          );
          const bottomLA = convertToDecimal(
            Number(m.BotLA.value || '0'),
            m.BotLA.fraction || '0',
          );
          return calculateVariance(topLA, bottomLA);

        // Top R A to Bottom R A
        case 'TopRA':
        case 'BotRA':
          const topRA = convertToDecimal(
            Number(m.TopRA.value || '0'),
            m.TopRA.fraction || '0',
          );
          const bottomRA = convertToDecimal(
            Number(m.BotRA.value || '0'),
            m.BotRA.fraction || '0',
          );
          return calculateVariance(topRA, bottomRA);

        // Top L B to Bottom L B
        case 'TopLB':
        case 'BotLB':
          const topLB = convertToDecimal(
            Number(m.TopLB.value || '0'),
            m.TopLB.fraction || '0',
          );
          const bottomLB = convertToDecimal(
            Number(m.BotLB.value || '0'),
            m.BotLB.fraction || '0',
          );
          return calculateVariance(topLB, bottomLB);

        // Top R B to Bottom R B
        case 'TopRB':
        case 'BotRB':
          const topRB = convertToDecimal(
            Number(m.TopRB.value || '0'),
            m.TopRB.fraction || '0',
          );
          const bottomRB = convertToDecimal(
            Number(m.BotRB.value || '0'),
            m.BotRB.fraction || '0',
          );
          return calculateVariance(topRB, bottomRB);

        // Left A to Center A to Right A (triple relationship)
        case 'LeftA':
        case 'CenterA':
        case 'RightA':
          const leftA = convertToDecimal(
            Number(m.LeftA.value || '0'),
            m.LeftA.fraction || '0',
          );
          const centerA = convertToDecimal(
            Number(m.CenterA.value || '0'),
            m.CenterA.fraction || '0',
          );
          const rightA = convertToDecimal(
            Number(m.RightA.value || '0'),
            m.RightA.fraction || '0',
          );
          return (
            calculateVariance(leftA, centerA) ||
            calculateVariance(centerA, rightA) ||
            calculateVariance(leftA, rightA)
          );

        // Left B to Center B to Right B (triple relationship)
        case 'LeftB':
        case 'CenterB':
        case 'RightB':
          const leftB = convertToDecimal(
            Number(m.LeftB.value || '0'),
            m.LeftB.fraction || '0',
          );
          const centerB = convertToDecimal(
            Number(m.CenterB.value || '0'),
            m.CenterB.fraction || '0',
          );
          const rightB = convertToDecimal(
            Number(m.RightB.value || '0'),
            m.RightB.fraction || '0',
          );
          return (
            calculateVariance(leftB, centerB) ||
            calculateVariance(centerB, rightB) ||
            calculateVariance(leftB, rightB)
          );

        default:
          return false;
      }
    }

    return false;
  };

  const renderItem = ({ item }: { item: Tool }) => {
    switch (item.type) {
      case 'Tape': {
        const p = item.data as TapeItem['data'];
        tapeCount++;
        const tooId = `${item.id}-tape`;

        const manageFocus = (
          refKey: string,
          shouldFocus: boolean | undefined,
        ) => {
          if (skipFocusRef.current) return;
          const ref = inputRefs.current[refKey];
          const isFocused = ref?.isFocused?.() === true;
          if (shouldFocus && !isFocused) ref?.focus?.();
          else if (!shouldFocus && isFocused) ref?.blur?.();
        };
        manageFocus(tooId, item.data.focused);
        return (
          <>
            <Card
              item={item}
              color={item.color}
              onDelete={() => deleteItem(item.id)}
              onEye={() => updateEye(item.id, !item.hidden)}
              onToggle={() => updateToggle(item.id, !item.locked)}
              count={tapeCount}
            >
              <ToolInput
                ref={r => {
                  inputRefs.current[tooId] = r;
                  inputIdMap.current[item.id] =
                    inputIdMap.current[item.id] || {};
                  inputIdMap.current[item.id]['primary'] = tooId;
                }}
                id={tooId}
                pair={{
                  value: p.value,
                  fraction: p.fraction,
                  focused: p.focused,
                }}
                selected={p.fraction}
                onChange={pair => {
                  updatePair(item.id, pair);
                  if (pair.focused) {
                    findFocusedPair(item);
                  }
                }}
                placeholder="0"
                isLocked={item.locked}
                style={{ width: 70 }}
              />
            </Card>
          </>
        );
      }
      case 'Laser': {
        const p = item.data as LaserItem['data'];
        laserCount++;
        const idA = `${item.id}-laser-SideA`;
        const idB = `${item.id}-laser-SideB`;

        const manageFocus = (
          refKey: string,
          shouldFocus: boolean | undefined,
        ) => {
          if (skipFocusRef.current) return;
          const ref = inputRefs.current[refKey];
          const isFocused = ref?.isFocused?.() === true;
          if (shouldFocus && !isFocused) ref?.focus?.();
          else if (!shouldFocus && isFocused) ref?.blur?.();
        };
        manageFocus(idA, p.SideA.focused);
        manageFocus(idB, p.SideB.focused);

        return (
          <Card
            item={item}
            color={item.color}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
            count={laserCount}
          >
            <ToolInput
              ref={r => {
                inputRefs.current[idA] = r;
                inputIdMap.current[item.id] = inputIdMap.current[item.id] || {};
                inputIdMap.current[item.id]['SideA'] = idA;
              }}
              id={idA}
              label="Side A"
              pair={p.SideA}
              selected={p.SideA.fraction}
              onChange={pair => updatePair(item.id, pair, 'SideA')}
              placeholder="0"
              style={{ width: 70 }}
              isLocked={item.locked}
            />
            <ToolInput
              ref={r => {
                inputRefs.current[idB] = r;
                inputIdMap.current[item.id] = inputIdMap.current[item.id] || {};
                inputIdMap.current[item.id]['SideB'] = idB;
              }}
              id={idB}
              label="Side B"
              pair={p.SideB}
              selected={p.SideB.fraction}
              onChange={pair => updatePair(item.id, pair, 'SideB')}
              placeholder="0"
              style={{ width: 70 }}
              isLocked={item.locked}
            />
          </Card>
        );
      }
      case 'Rake': {
        const p = item.data as RakeItem['data'];
        const rake = item as RakeItem;
        rakeCount++;
        const rakeId = `${item.id}-rake`;

        // compacted focus/blur logic and skip when flagged (skipFocusRef)
        const manageFocus = (
          refKey: string,
          shouldFocus: boolean | undefined,
        ) => {
          if (skipFocusRef.current) return;
          const ref = inputRefs.current[refKey];
          const isFocused = ref?.isFocused?.() === true;
          if (shouldFocus && !isFocused) ref?.focus?.();
          else if (!shouldFocus && isFocused) ref?.blur?.();
        };
        manageFocus(rakeId, !!item.data.focused);
        manageFocus(`${item.id}-rake-distance`, !!item.data.distance?.focused);

        return (
          <Card
            item={item}
            color={item.color}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
            count={rakeCount}
          >
            <ToolInput
              ref={r => {
                inputRefs.current[rakeId] = r;
                inputIdMap.current[item.id] = inputIdMap.current[item.id] || {};
                // inputIdMap.current[item.id]['primary'] = rakeId;
              }}
              id={rakeId}
              pair={{
                value: p.value,
                fraction: p.fraction,
                focused: p.focused,
              }}
              selected={p.fraction}
              onChange={pair =>
                updatePair(item.id, { ...pair, distance: p.distance })
              }
              placeholder="0"
              style={{ width: 70 }}
              isLocked={item.locked}
            />
            <TheButton
              btnTitle="Distance"
              icon={
                rake.showDist ? (
                  <Minus color={'#000'} />
                ) : (
                  <Plus color={'#33363F'} />
                )
              }
              onPress={() => updateDist(item.id, !item.showDist)}
              btnColor={rake.showDist ? '#fbeefdff' : border}
              titleStyle={{ fontWeight: 'bold' }}
              titleColor="black"
            />
            {rake.showDist && (
              <ToolInput
                ref={r => {
                  inputRefs.current[`${item.id}-rake-distance`] = r;
                  inputIdMap.current[item.id] =
                    inputIdMap.current[item.id] || {};
                  inputIdMap.current[item.id][
                    'distance'
                  ] = `${item.id}-rake-distance`;
                }}
                id={`${item.id}-rake-distance`}
                pair={p.distance}
                selected={p.distance?.fraction}
                onChange={pair => updatePair(item.id, pair, 'distance')}
                placeholder="0"
                isLocked={item.locked}
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

        // Add focus management for Rectangle
        const manageFocus = (
          refKey: string,
          shouldFocus: boolean | undefined,
        ) => {
          if (skipFocusRef.current) return;

          // First unfocus all other inputs in this Rectangle
          if (shouldFocus) {
            keys.forEach(key => {
              const rid = `${item.id}-rectangle-${key}`;
              if (rid !== refKey) {
                const ref = inputRefs.current[rid];
                if (ref?.isFocused?.()) {
                  ref.blur();
                }
              }
            });
          }

          // Then handle focus for the target input
          const ref = inputRefs.current[refKey];
          const isFocused = ref?.isFocused?.() === true;
          if (shouldFocus && !isFocused) {
            ref?.focus?.();
          } else if (!shouldFocus && isFocused) {
            ref?.blur?.();
          }
        };

        // Call manageFocus for each input that needs focus
        keys.forEach((k, index) => {
          const rid = `${item.id}-rectangle-${index}`;
          manageFocus(rid, p[k].focused);
        });

        return (
          <Card
            item={item}
            color={item.color}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            {keys.map((k, index) => {
              const rid = `${item.id}-rectangle-${index}`;
              return (
                <ToolInput
                  ref={r => {
                    inputRefs.current[rid] = r;
                    inputIdMap.current[item.id] =
                      inputIdMap.current[item.id] || {};
                    inputIdMap.current[item.id][k] = rid;
                  }}
                  id={rid}
                  label={k}
                  pair={p[k]}
                  showWarn={hasVarianceWarning(item.type, p, k)}
                  selected={p[k].fraction}
                  onChange={pair => updatePair(item.id, pair, k)}
                  placeholder="0"
                  style={{ width: 70 }}
                  isLocked={item.locked}
                />
              );
            })}
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

        // Add focus management for Rectangle
        const manageFocus = (
          refKey: string,
          shouldFocus: boolean | undefined,
        ) => {
          if (skipFocusRef.current) return;

          // First unfocus all other inputs in this Rectangle
          if (shouldFocus) {
            keys.forEach(key => {
              const cid = `${item.id}-corner-${key}`;
              if (cid !== refKey) {
                const ref = inputRefs.current[cid];
                if (ref?.isFocused?.()) {
                  ref.blur();
                }
              }
            });
          }

          // Then handle focus for the target input
          const ref = inputRefs.current[refKey];
          const isFocused = ref?.isFocused?.() === true;
          if (shouldFocus && !isFocused) {
            ref?.focus?.();
          } else if (!shouldFocus && isFocused) {
            ref?.blur?.();
          }
        };

        // Call manageFocus for each input that needs focus
        keys.forEach((k, index) => {
          const cid = `${item.id}-corner-${index}`;
          manageFocus(cid, p[k].focused);
        });

        return (
          <Card
            item={item}
            color={item.color}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            {keys.map((k, index) => {
              const cid = `${item.id}-corner-${index}`;
              return (
                <ToolInput
                  ref={r => {
                    inputRefs.current[cid] = r;
                    inputIdMap.current[item.id] =
                      inputIdMap.current[item.id] || {};
                    inputIdMap.current[item.id][k] = cid;
                  }}
                  id={cid}
                  label={k}
                  pair={p[k]}
                  showWarn={hasVarianceWarning(item.type, p, k)}
                  selected={p[k].fraction}
                  onChange={pair => updatePair(item.id, pair, k)}
                  placeholder="0"
                  style={{ width: 70 }}
                  isLocked={item.locked}
                />
              );
            })}
          </Card>
        );
      }
      case 'Note': {
        const p = item.data as NoteItem['data'];
        const tooId = `${item.id}-note`;
        const manageFocus = (
          refKey: string,
          shouldFocus: boolean | undefined,
        ) => {
          if (skipFocusRef.current) return;
          const ref = inputRefs.current[refKey];
          const isFocused = ref?.isFocused?.() === true;
          if (shouldFocus && !isFocused) ref?.focus?.();
          else if (!shouldFocus && isFocused) ref?.blur?.();
        };
        manageFocus(tooId, item.data.focused);
        return (
          <Card
            item={item}
            color={item.color}
            onDelete={() => deleteItem(item.id)}
            onEye={() => updateEye(item.id, !item.hidden)}
            onToggle={() => updateToggle(item.id, !item.locked)}
          >
            <TheDescriptionBox
              id={tooId}
              ref={r => {
                inputRefs.current[tooId] = r;
                inputIdMap.current[item.id] = inputIdMap.current[item.id] || {};
                inputIdMap.current[item.id]['primary'] = tooId;
              }}
              placeholder="Enter your note text here"
              value={(item as NoteItem).data.value}
              focus={(item as NoteItem).data.focused}
              onChangeText={t => updateSingle(item.id, t, 'value')}
              onChangeFocus={e => updateSingle(item.id, e, 'focused')}
              showSoftInputOnFocus={false}
            />
          </Card>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {tools.map((tool, index) => (
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
  color,
  style,
  children,
  onDelete,
  onToggle,
  onEye,
  count,
}: {
  item: Tool;
  color?: ColorValue;
  onToggle: () => void;
  onDelete: () => void;
  onEye: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
  count?: number;
}) => {
  return (
    <View style={[styles.initialContainer, style]}>
      {/* Header */}
      <View
        style={[
          styles.rowContainer,
          { justifyContent: 'space-between', paddingHorizontal: 10 },
        ]}
      >
        <View style={[styles.rowContainer, { gap: 5, width: '60%' }]}>
          <Badge color={color || '#FBBF24'} />
          <TheText
            text={
              item.type == 'Note' ? item.type : `${item.type} ${count ?? ''}`
            }
            size={18}
            numberOfLines={1}
            style={{ fontWeight: '600', width: '80%' }}
          />
        </View>
        <View style={[styles.rowContainer, { gap: 5 }]}>
          {item.hidden ? (
            <EyeClosed color="#6B7280" onPress={onEye} />
          ) : (
            <Eye color="#6B7280" onPress={onEye} />
          )}
          <TheToggle value={item.locked!} onValueChange={onToggle} />
          <Trash onPress={!item.locked ? onDelete : null} />
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

function Badge({ color }: { color: ColorValue }) {
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
    paddingVertical: 20,
    paddingHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    gap: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 10,
  },
  keyboardContainer: {
    // position: 'absolute',
    // bottom: 20,
    // left: 20,
    // right: 20,
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 10,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  key: {
    width: '8%',
    // paddingVertical: 5,
    backgroundColor: '#444',
    margin: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  // key: {
  //   flex: 1,
  //   margin: 3,
  //   backgroundColor: '#444',
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  spaceKey: {
    flex: 3,
  },
  okKey: {
    flex: 1,
    backgroundColor: '#5A8DEE',
  },
  keyText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
