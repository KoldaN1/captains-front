export function useTgTheme() {
  return window.Telegram.WebApp.colorScheme === "dark" ? "dark" : "light";
}
