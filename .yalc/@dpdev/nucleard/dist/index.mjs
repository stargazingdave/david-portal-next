// src/components/Button.tsx
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
function adjustColorBrightness(hex, amount) {
  if (hex === "none") return hex;
  const col = hex.replace("#", "");
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  ``;
  let g = (num >> 8 & 255) + amount;
  let b = (num & 255) + amount;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
function isDarkColor(hex) {
  if (hex === "none") return false;
  const col = hex.replace("#", "");
  const r = parseInt(col.substring(0, 2), 16);
  const g = parseInt(col.substring(2, 4), 16);
  const b = parseInt(col.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
  return brightness < 128;
}
var Button = ({
  bgColor,
  hoverBgColor,
  textColor,
  clearStyle,
  textHover,
  className = "",
  style,
  ...props
}) => {
  const [finalTextColor, setFinalTextColor] = useState(textColor ?? "#000000");
  useEffect(() => {
    if (!textColor) {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setFinalTextColor(prefersDark ? "#ffffff" : "#000000");
    }
  }, [textColor]);
  const defaultButtonStyles = {
    padding: !clearStyle ? "0.5rem 1rem" : void 0,
    borderRadius: !clearStyle ? "0.75rem" : void 0,
    color: !clearStyle ? "#ffffff" : void 0,
    fontWeight: !clearStyle ? 500 : void 0,
    transition: "all 0.2s ease",
    cursor: "pointer"
  };
  const finalBgColor = bgColor ?? (clearStyle ? "none" : "#3b82f6");
  const autoHoverBg = adjustColorBrightness(finalBgColor, isDarkColor(finalBgColor) ? 30 : -30);
  const autoHoverText = adjustColorBrightness(finalTextColor, isDarkColor(finalTextColor) ? 30 : -30);
  const finalStyle = {
    ...defaultButtonStyles,
    backgroundColor: finalBgColor,
    color: finalTextColor,
    ...style
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      className,
      style: finalStyle,
      onMouseEnter: (e) => {
        const el = e.target;
        el.style.backgroundColor = hoverBgColor ?? autoHoverBg;
        if (textHover) el.style.color = autoHoverText;
      },
      onMouseLeave: (e) => {
        const el = e.target;
        el.style.backgroundColor = finalBgColor;
        if (textHover) el.style.color = finalTextColor;
      },
      ...props
    }
  );
};

// src/components/Card.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var Card = ({
  bgColor,
  textColor,
  backgroundImage,
  overlayColor,
  className = "",
  style,
  children,
  ...props
}) => {
  const baseStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "0.75rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    backgroundColor: bgColor,
    color: textColor,
    backgroundImage,
    backgroundSize: backgroundImage ? "cover" : void 0,
    backgroundPosition: backgroundImage ? "center" : void 0,
    backgroundRepeat: backgroundImage ? "no-repeat" : void 0,
    position: "relative",
    overflow: "hidden",
    ...style
  };
  return /* @__PURE__ */ jsxs("div", { className, style: baseStyle, ...props, children: [
    overlayColor && /* @__PURE__ */ jsx2(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          backgroundColor: overlayColor,
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ jsx2("div", { style: { position: "relative", zIndex: 1 }, children })
  ] });
};
export {
  Button,
  Card
};
//# sourceMappingURL=index.mjs.map