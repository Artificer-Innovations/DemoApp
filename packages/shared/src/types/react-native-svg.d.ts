// Type declarations for react-native-svg
// This package is a peer dependency, so types may not be available
// in the shared package context. This declaration file provides
// minimal type definitions for TypeScript compilation.
// Note: Using any types for JSX components to avoid compatibility issues
// in monorepo setup - runtime behavior is correct, this is type-checking only

declare module 'react-native-svg' {
  import { ReactNode } from 'react';

  export interface SvgProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    children?: ReactNode;
  }

  export interface CircleProps {
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    opacity?: number | string;
  }

  export interface PathProps {
    d?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    opacity?: number | string;
  }

  export interface RectProps {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    fill?: string;
  }

  export interface LineProps {
    x1?: number | string;
    y1?: number | string;
    x2?: number | string;
    y2?: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    opacity?: number | string;
  }

  // Using any for JSX components due to monorepo type resolution issues
  // Runtime behavior is correct - this is a type-checking limitation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Svg: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Circle: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Path: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Rect: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Line: any;
}
