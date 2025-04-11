"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Button: () => Button,
  Card: () => Card
});
module.exports = __toCommonJS(index_exports);

// src/components/Button.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function adjustColorBrightness(hex, amount) {
  if (hex === "none") return hex;
  const col = hex.replace("#", "");
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
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
  const [finalTextColor, setFinalTextColor] = (0, import_react.useState)(textColor ?? "#000000");
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className, style: baseStyle, ...props, children: [
    overlayColor && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { position: "relative", zIndex: 1 }, children })
  ] });
};
//# sourceMappingURL=index.js.map