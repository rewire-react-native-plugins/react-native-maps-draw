import React, { FC, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import type { TGestureControl, TTouchPoint } from '../../types';

const GestureHandler: FC<TGestureControl> = ({
  onEndTouchEvents,
  onStartTouchEvents,
  onChangeTouchEvents,
}) => {
  const pathRef = useRef<TTouchPoint[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: (e, gestureState) => {
      pathRef.current = [];
      onStartTouchEvents?.(e, gestureState);
    },
    onPanResponderMove: (event) => {
      pathRef.current.push({
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      });
      onChangeTouchEvents?.([...pathRef.current]);
    },
    onPanResponderRelease: () => {
      const points = [...pathRef.current];
      onChangeTouchEvents(points);

      onEndTouchEvents?.(points);
    },
  });

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
      }}
      {...panResponder.panHandlers}
    />
  );
};

export default GestureHandler;
