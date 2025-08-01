export const timeout = miliseconds => {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
};