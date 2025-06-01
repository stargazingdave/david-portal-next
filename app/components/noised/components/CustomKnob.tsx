// This component uses the 'noised-ui' Knob component to create a custom knob
import React, { FC } from 'react';
import { Knob, KnobProps } from './Knob';

export const CustomKnob: FC<KnobProps> = (props) => {
    const customProps: Partial<KnobProps> = {
        trackWidth: 0,
        colors: {
            face: "#de006b",
        }
    };
    // Combine props, preferring props over customProps
    const combinedProps = { ...customProps, ...props };
    return (
        <Knob {...combinedProps} />
    );
};
