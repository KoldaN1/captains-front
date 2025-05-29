function formatNumber(num) {
  const sign = num < 0 ? "-" : "";
  num = Math.abs(num);

  if (num < 1000) {
    return sign + num.toString();
  } else if (num < 1000000) {
    return sign + (num / 1000).toFixed(2) + "k";
  } else if (num < 1000000000) {
    return sign + (num / 1000000).toFixed(2) + "m";
  } else if (num < 1000000000000) {
    return sign + (num / 1000000000).toFixed(2) + "b";
  } else if (num < 1000000000000000) {
    return sign + (num / 1000000000000).toFixed(2) + "t";
  } else {
    return sign + (num / 1000000000000000).toFixed(2) + "q";
  }
}

export default formatNumber;
