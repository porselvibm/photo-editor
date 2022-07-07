import { STATIC_DATA } from "./Constants";
export default function convertToPixel(number) {
  return (number * STATIC_DATA.DPI) / window.devicePixelRatio;
}
