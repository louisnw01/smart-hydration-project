import {VictoryThemeDefinition} from "victory-native";

// *
// * Colors
// *
const yellow200 = "#FFF59D";
const deepOrange600 = "#F4511E";
const lime300 = "#DCE775";
const lightGreen500 = "#8BC34A";
const teal700 = "#00796B";
const cyan900 = "#006064";
const colors = [
    deepOrange600,
    yellow200,
    lime300,
    lightGreen500,
    teal700,
    cyan900,
];
const blueGrey50 = "#ECEFF1";
const blueGrey300 = "#90A4AE";
const blueGrey700 = "#455A64";
const grey900 = "#212121";
// *
// * Typography
// *
const sansSerif = "'SF-Pro-Display-Regular.otf', sans-serif";
const letterSpacing = "normal";
const fontSize = 12;
// *
// * Layout
// *
const padding = 8;
const baseProps = {
    width: 350,
    height: 350,
    padding: 50,
};
// *
// * Labels
// *
const baseLabelStyles = {
    fontFamily: "SF-Pro-Display-Rounded",
    fontSize,
    letterSpacing,
    fontWeight: "bold",
    padding,
    fill: blueGrey700,
    stroke: "transparent",
    strokeWidth: 0,
};

const centeredLabelStyles = Object.assign(
    {textAnchor: "middle"},
    baseLabelStyles,
);
// *
// * Strokes
// *
const strokeDasharray = "10, 5";
const strokeLinecap = "round";
const strokeLinejoin = "round";

export const custom: VictoryThemeDefinition = {
    axis: Object.assign(
        {
            style: {
                axis: {
                    fill: "transparent",
                    stroke: blueGrey300,
                    strokeWidth: 0,
                    strokeLinecap,
                    strokeLinejoin,
                },
                axisLabel: Object.assign({}, centeredLabelStyles, {
                    padding,
                    stroke: "transparent",
                }),
                grid: {
                    fill: "none",
                    stroke: "transparent",
                    pointerEvents: "painted",
                },
                ticks: {
                    fill: "transparent",
                    size: 0,
                    strokeWidth: 0,
                },
                tickLabels: Object.assign({}, baseLabelStyles, {
                    fill: blueGrey700,
                }),
            },
        },
        baseProps,
    ),
    line: Object.assign(
        {
            style: {
                data: {
                    fill: "transparent",
                    opacity: 0.5,
                    stroke: "rgb(150, 150, 150)",
                    strokeWidth: 5,
                    cornerRadius: 12,
                },
                labels: baseLabelStyles,
            },
        },
        baseProps,
    ),
    chart: baseProps,
};
