/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PointerType } from './pointer-type';
/** Label type */
export declare enum LabelType {
    /** Label above low pointer */
    Low = 0,
    /** Label above high pointer */
    High = 1,
    /** Label for minimum slider value */
    Floor = 2,
    /** Label for maximum slider value */
    Ceil = 3,
    /** Label below legend tick */
    TickValue = 4,
}
/** Function to translate label value into text */
export declare type TranslateFunction = (value: number, label: LabelType) => string;
/** Function to combind */
export declare type CombineLabelsFunction = (minLabel: string, maxLabel: string) => string;
/** Function to provide legend  */
export declare type GetLegendFunction = (value: number) => string;
export declare type GetStepLegendFunction = (step: CustomStepDefinition) => string;
/** Function converting slider value to slider position */
export declare type ValueToPositionFunction = (val: number, minVal: number, maxVal: number) => number;
/** Function converting slider position to slider value */
export declare type PositionToValueFunction = (percent: number, minVal: number, maxVal: number) => number;
/**
 * Custom step definition
 *
 * This can be used to specify custom values and legend values for slider ticks
 */
export interface CustomStepDefinition {
    /** Value */
    value: number;
    /** Legend (label for the value) */
    legend?: string;
}
/** Slider options */
export declare class Options {
    /** Minimum value for a slider.
      Not applicable when using stepsArray. */
    floor?: number;
    /** Maximum value for a slider.
      Not applicable when using stepsArray. */
    ceil?: number;
    /** Step between each value.
      Not applicable when using stepsArray. */
    step?: number;
    /** The minimum range authorized on the slider.
      Applies to range slider only.
      When using stepsArray, expressed as index into stepsArray. */
    minRange?: number;
    /** The maximum range authorized on the slider.
      Applies to range slider only.
      When using stepsArray, expressed as index into stepsArray. */
    maxRange?: number;
    /** Set to true to have a push behavior. When the min handle goes above the max,
      the max is moved as well (and vice-versa). The range between min and max is
      defined by the step option (defaults to 1) and can also be overriden by
      the minRange option. Applies to range slider only. */
    pushRange?: boolean;
    /** The minimum value authorized on the slider.
      When using stepsArray, expressed as index into stepsArray. */
    minLimit?: number;
    /** The maximum value authorized on the slider.
      When using stepsArray, expressed as index into stepsArray. */
    maxLimit?: number;
    /** Custom translate function. Use this if you want to translate values displayed
        on the slider. */
    translate?: TranslateFunction;
    /** Custom function for combining overlapping labels in range slider.
        It takes the min and max values (already translated with translate fuction)
        and should return how these two values should be combined.
        If not provided, the default function will join the two values with
        ' - ' as separator. */
    combineLabels?: CombineLabelsFunction;
    /** Use to display legend under ticks (thus, it needs to be used along with
       showTicks or showTicksValues). The function will be called with each tick
       value and returned content will be displayed under the tick as a legend.
       If the returned value is null, then no legend is displayed under
       the corresponding tick.You can also directly provide the legend values
       in the stepsArray option. */
    getLegend?: GetLegendFunction;
    /** Use to display a custom legend of a stepItem from stepsArray.
     It will be the same as getLegend but for stepsArray. */
    getStepLegend?: GetStepLegendFunction;
    /** If you want to display a slider with non linear/number steps.
       Just pass an array with each slider value and that's it; the floor, ceil and step settings
       of the slider will be computed automatically.
       By default, the value model and valueHigh model values will be the value of the selected item
       in the stepsArray.
       They can also be bound to the index of the selected item by setting the bindIndexForStepsArray
       option to true. */
    stepsArray?: CustomStepDefinition[];
    /** Set to true to bind the index of the selected item to value model and valueHigh model. */
    bindIndexForStepsArray?: boolean;
    /** When set to true and using a range slider, the range can be dragged by the selection bar.
      Applies to range slider only. */
    draggableRange?: boolean;
    /** Same as draggableRange but the slider range can't be changed.
      Applies to range slider only. */
    draggableRangeOnly?: boolean;
    /** Set to true to always show the selection bar before the slider handle. */
    showSelectionBar?: boolean;
    /** Set to true to always show the selection bar after the slider handle. */
    showSelectionBarEnd?: boolean;
    /**  Set a number to draw the selection bar between this value and the slider handle.
      When using stepsArray, expressed as index into stepsArray. */
    showSelectionBarFromValue?: number;
    /**  Only for range slider. Set to true to visualize in different colour the areas
      on the left/right (top/bottom for vertical range slider) of selection bar between the handles. */
    showOuterSelectionBars?: boolean;
    /** Set to true to hide pointer labels */
    hidePointerLabels?: boolean;
    /** Set to true to hide min / max labels  */
    hideLimitLabels?: boolean;
    /** Set to false to disable the auto-hiding behavior of the limit labels. */
    autoHideLimitLabels?: boolean;
    /** Set to true to make the slider read-only. */
    readOnly?: boolean;
    /** Set to true to disable the slider. */
    disabled?: boolean;
    /** Set to true to display a tick for each step of the slider. */
    showTicks?: boolean;
    /** Set to true to display a tick and the step value for each step of the slider.. */
    showTicksValues?: boolean;
    tickStep?: number;
    tickValueStep?: number;
    /** Use to display ticks at specific positions.
      The array contains the index of the ticks that should be displayed.
      For example, [0, 1, 5] will display a tick for the first, second and sixth values. */
    ticksArray?: number[];
    /** Used to display a tooltip when a tick is hovered.
      Set to a function that returns the tooltip content for a given value. */
    ticksTooltip?: (value: number) => string;
    /** Same as ticksTooltip but for ticks values. */
    ticksValuesTooltip?: (value: number) => string;
    /** Set to true to display the slider vertically.
      The slider will take the full height of its parent.
      Changing this value at runtime is not currently supported. */
    vertical?: boolean;
    /** Function that returns the current color of the selection bar.
      If your color won't change, don't use this option but set it through CSS.
      If the returned color depends on a model value (either value or valueHigh),
      you should use the argument passed to the function.
      Indeed, when the function is called, there is no certainty that the model
      has already been updated.*/
    getSelectionBarColor?: (minValue: number, maxValue?: number) => string;
    /** Function that returns the color of a tick. showTicks must be enabled. */
    getTickColor?: (value: number) => string;
    /** Function that returns the current color of a pointer.
      If your color won't change, don't use this option but set it through CSS.
      If the returned color depends on a model value (either value or valueHigh),
      you should use the argument passed to the function.
      Indeed, when the function is called, there is no certainty that the model has already been updated.
      To handle range slider pointers independently, you should evaluate pointerType within the given
      function where "min" stands for value model and "max" for valueHigh model values. */
    getPointerColor?: (value: number, pointerType: PointerType) => string;
    /** Handles are focusable (on click or with tab) and can be modified using the following keyboard controls:
      Left/bottom arrows: -1
      Right/top arrows: +1
      Page-down: -10%
      Page-up: +10%
      Home: minimum value
      End: maximum value
     */
    keyboardSupport?: boolean;
    /** If you display the slider in an element that uses transform: scale(0.5), set the scale value to 2
      so that the slider is rendered properly and the events are handled correctly. */
    scale?: number;
    /** If you display the slider in an element that uses transform: rotate(90deg), set the rotate value to 90
     so that the slider is rendered properly and the events are handled correctly. Value is in degrees. */
    rotate?: number;
    /** Set to true to force the value(s) to be rounded to the step, even when modified from the outside.
      When set to false, if the model values are modified from outside the slider, they are not rounded
      and can be between two steps. */
    enforceStep?: boolean;
    /** Set to true to force the value(s) to be normalised to allowed range (floor to ceil), even when modified from the outside.
      When set to false, if the model values are modified from outside the slider, and they are outside allowed range,
      the slider may be rendered incorrectly. However, setting this to false may be useful if you want to perform custom normalisation. */
    enforceRange?: boolean;
    /** Set to true to force the value(s) to be rounded to the nearest step value, even when modified from the outside.
      When set to false, if the model values are modified from outside the slider, and they are outside allowed range,
      the slider may be rendered incorrectly. However, setting this to false may be useful if you want to perform custom normalisation. */
    enforceStepsArray?: boolean;
    /** Set to true to prevent to user from switching the min and max handles. Applies to range slider only. */
    noSwitching?: boolean;
    /** Set to true to only bind events on slider handles. */
    onlyBindHandles?: boolean;
    /** Set to true to show graphs right to left.
      If vertical is true it will be from top to bottom and left / right arrow functions reversed. */
    rightToLeft?: boolean;
    /** Set to true to reverse keyboard navigation:
      Right/top arrows: -1
      Left/bottom arrows: +1
      Page-up: -10%
      Page-down: +10%
      End: minimum value
      Home: maximum value
     */
    reversedControls?: boolean;
    /** Set to true to keep the slider labels inside the slider bounds. */
    boundPointerLabels?: boolean;
    /** Set to true to use a logarithmic scale to display the slider.  */
    logScale?: boolean;
    /** Function that returns the position on the slider for a given value.
      The position must be a percentage between 0 and 1.
      The function should be monotonically increasing or decreasing; otherwise the slider may behave incorrectly. */
    customValueToPosition?: ValueToPositionFunction;
    /** Function that returns the value for a given position on the slider.
      The position is a percentage between 0 and 1.
      The function should be monotonically increasing or decreasing; otherwise the slider may behave incorrectly. */
    customPositionToValue?: PositionToValueFunction;
    /** Precision limit for calculated values.
      Values used in calculations will be rounded to this number of significant digits
      to prevent accumulating small floating-point errors. */
    precisionLimit?: number;
    /** Use to display the selection bar as a gradient.
      The given object must contain from and to properties which are colors. */
    selectionBarGradient?: {
        from: string;
        to: string;
    };
    /** Use to add a label directly to the slider for accessibility. Adds the aria-label attribute. */
    ariaLabel?: string;
    /** Use instead of ariaLabel to reference the id of an element which will be used to label the slider.
      Adds the aria-labelledby attribute. */
    ariaLabelledBy?: string;
    /** Use to add a label directly to the slider range for accessibility. Adds the aria-label attribute. */
    ariaLabelHigh?: string;
    /** Use instead of ariaLabelHigh to reference the id of an element which will be used to label the slider range.
      Adds the aria-labelledby attribute. */
    ariaLabelledByHigh?: string;
    /** Use to increase rendering performance. If the value is not provided, the slider calculates the with/height of the handle */
    handleDimension?: number;
    /** Use to increase rendering performance. If the value is not provided, the slider calculates the with/height of the bar */
    barDimension?: number;
    /** Enable/disable CSS animations */
    animate?: boolean;
    /** Enable/disable CSS animations while moving the slider */
    animateOnMove?: boolean;
}
