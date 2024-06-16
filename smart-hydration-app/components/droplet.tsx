import { View } from "react-native";
import Svg, { Defs, Mask, Path, Rect } from "react-native-svg";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg";
import { useAtomValue } from "jotai";
import { hydrationAtom } from "@/atom/hydration";


const dropFillPath = "M132.281,264.564c51.24,0,92.931-41.681,92.931-92.918c0-50.18-87.094-164.069-90.803-168.891L132.281,0l-2.128,2.773c-3.704,4.813-90.802,118.71-90.802,168.882C39.352,222.883,81.042,264.564,132.281,264.564z"


export default function Droplet() {
    const hydration = useAtomValue(hydrationAtom);

    const scaledHydrationAmount = (((100-hydration)/100) * 252);
    const y = 8+scaledHydrationAmount;
    const height = 252-scaledHydrationAmount;

    return (
        <View className="flex flex-row justify-center mt-32">
            <View className="absolute">
                <Svg height="200" width="200" viewBox="0 0 264.564 264.564">
                    <Defs>
                        <Mask id="dropMask">
                            <Rect x="40" y={y} width="200" height={height} fill="white" />
                        </Mask>
                    </Defs>
                    <Path
                        d={dropFillPath}
                        fill='rgb(22, 104, 240)'
                        mask="url(#dropMask)"
                    />
                </Svg>
            </View>
            <Drop width={200} height={200}/>
        </View>
    )
}