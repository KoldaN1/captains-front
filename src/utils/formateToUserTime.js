function formatToUserTime(dateString) {
  // Создаем объект Date из строки
  const date = new Date(dateString);

  // Получаем компоненты даты
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы идут с 0 до 11
  const year = date.getFullYear();

  // Получаем компоненты времени
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Форматируем и возвращаем в виде строки
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default formatToUserTime;
