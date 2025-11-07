import React from 'react';

// Mock SVG components for testing
export const Svg = ({ children, ...props }: any) => React.createElement('Svg', props, children);
export const Circle = (props: any) => React.createElement('Circle', props);
export const Path = (props: any) => React.createElement('Path', props);
export const Rect = (props: any) => React.createElement('Rect', props);
export const Line = (props: any) => React.createElement('Line', props);
export const G = (props: any) => React.createElement('G', props);
export const Defs = (props: any) => React.createElement('Defs', props);
export const ClipPath = (props: any) => React.createElement('ClipPath', props);
export const Use = (props: any) => React.createElement('Use', props);
export const Ellipse = (props: any) => React.createElement('Ellipse', props);
export const Polygon = (props: any) => React.createElement('Polygon', props);
export const Polyline = (props: any) => React.createElement('Polyline', props);
export const Text = (props: any) => React.createElement('Text', props);
export const TSpan = (props: any) => React.createElement('TSpan', props);
export const TextPath = (props: any) => React.createElement('TextPath', props);
export const Image = (props: any) => React.createElement('Image', props);
export const Symbol = (props: any) => React.createElement('Symbol', props);
export const LinearGradient = (props: any) => React.createElement('LinearGradient', props);
export const RadialGradient = (props: any) => React.createElement('RadialGradient', props);
export const Stop = (props: any) => React.createElement('Stop', props);
export const Pattern = (props: any) => React.createElement('Pattern', props);
export const Mask = (props: any) => React.createElement('Mask', props);
export const Marker = (props: any) => React.createElement('Marker', props);

export default Svg;

