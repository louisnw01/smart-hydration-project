import { Atom, useAtomValue } from 'jotai';
import { AtomWithMutationResult } from 'jotai-tanstack-query';
import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import StyledButton from './button';


interface CountdownProps{
  text:string,
  mutateAtom:Atom<AtomWithMutationResult<void, unknown, void, unknown>>,
  icon?: ReactNode,
}

export default function CountdownButton({text, mutateAtom, icon}:CountdownProps){
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [radius] = useState(10); // Radius of the circular countdown
  const [strokeWidth] = useState(3); // Width of the stroke

  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(circumference);
  const {mutate} = useAtomValue(mutateAtom);


  const handlePress = () => {
    mutate()
    setIsDisabled(true);
    setCountdown(60);
    setProgress(0);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setProgress((countdown - 1) / 60 * circumference);
      }, 1000);
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false);
      setProgress(circumference);
    }
    return () => clearTimeout(timer);
  }, [countdown, circumference, isDisabled]);

  return (
    <View className='flex flex-row'>
      <StyledButton
        text={text}
        onPress={handlePress}
        buttonClass="self-center mt-20 px-3"
        textClass="text-lg mt-[1px]"
        icon={icon}
        disabled={isDisabled}
        />
    {isDisabled && (
      <View className='flex flex-row absolute left-40 py-3 px-5 mt-20'>
        <Svg height={radius * 3 + strokeWidth} 
             width={radius * 3 + strokeWidth} 
             viewBox={`0 0 ${radius * 3 + strokeWidth} ${radius * 3 + strokeWidth}`}>
            <G transform={{ translateX: strokeWidth / 2, translateY: strokeWidth / 2 }}>
              <Circle
                stroke="gray"
                fill="none"
                cx={radius}
                cy={radius}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke="blue"
                fill="none"
                cx={radius}
                cy={radius}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={progress}
              />
              </G>
            </Svg>
            <Text className='px-1'>{countdown}s</Text>
          </View>
        )}
    </View>
  );
};