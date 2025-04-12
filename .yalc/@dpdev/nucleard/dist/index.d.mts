import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';

type ButtonProps = React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    bgColor?: string;
    hoverBgColor?: string;
    textColor?: string;
    clearStyle?: boolean;
    textHover?: boolean;
};
declare const Button: ({ bgColor, hoverBgColor, textColor, clearStyle, textHover, className, style, ...props }: ButtonProps) => react_jsx_runtime.JSX.Element;

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    bgColor?: string;
    textColor?: string;
    backgroundImage?: string;
    overlayColor?: string;
    className?: string;
};
declare const Card: ({ bgColor, textColor, backgroundImage, overlayColor, className, style, children, ...props }: CardProps) => react_jsx_runtime.JSX.Element;

export { Button, Card };
