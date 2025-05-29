function stringToColor(str) {
  let hash1 = 0;
  let hash2 = 0;
  let hash3 = 0;

  for (let i = 0; i < str.length; i++) {
    hash1 = str.charCodeAt(i) + ((hash1 << 5) - hash1);
    hash2 = str.charCodeAt(i) + ((hash2 << 7) - hash2);
    hash3 = str.charCodeAt(i) + ((hash3 << 3) - hash3);
  }

  let r = hash1 & 0xff;
  let g = hash2 & 0xff;
  let b = hash3 & 0xff;

  const color = `#${("00" + r.toString(16)).slice(-2)}${("00" + g.toString(16)).slice(-2)}${("00" + b.toString(16)).slice(-2)}`;

  return color;
}

export default stringToColor;
