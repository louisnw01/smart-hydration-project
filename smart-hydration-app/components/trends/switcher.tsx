import { chartTimeWindowAtom } from "@/atom/nav";
import useColorPalette from "@/util/palette";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { Pressable, View, Text } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const switcherValues = ["D", "W", "M", "Y"];

export default function Switcher() {
  const selected = useAtomValue(chartTimeWindowAtom);
  const animatedLeft = useSharedValue(0);
  const palette = useColorPalette();

  const newLeft = switcherValues.indexOf(selected) * 63;

  const animatedStyle = useAnimatedStyle(() => ({
    left: animatedLeft.value,
    backgroundColor: palette.fg,
  }));

  animatedLeft.value = withTiming(newLeft, {
    duration: 200,
    easing: Easing.out(Easing.quad),
  });

  return (
    <View className="flex flex-row justify-evenly mt-4">
      <View className="flex-row border border-gray-200 dark:border-neutral-900 rounded-3xl gap-6 h-8 items-center">
        <Animated.View
          className="absolute rounded-3xl h-full w-12"
          style={animatedStyle}
        />
        <SwitcherElement name="D" />
        <SwitcherElement name="W" />
        <SwitcherElement name="M" />
        <SwitcherElement name="Y" />
      </View>
    </View>
  );
}

function SwitcherElement({ name }) {
  const [selected, setSelected] = useAtom(chartTimeWindowAtom);
  const isSelected = selected == name;
  const palette = useColorPalette();

  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withTiming(isSelected ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(animation.value, [0, 1], [palette.fg, palette.bg]),
  }));

  return (
    <Pressable
      className="rounded-3xl w-12 items-center"
      // style={{
      // backgroundColor: isSelected ? "#5cb5e1" : "#E5E7EB",
      // }}
      // className="rounded-3xl"
      onPress={() => setSelected(name)}
    >
      <Animated.Text
        className="text-lg px-4 font-semibold dark:text-white"
        style={animatedStyle}
      >
        {name}
      </Animated.Text>
    </Pressable>
  );
}
