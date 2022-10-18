export const contactTypeMatch = {
  phone: 'Телефон',
  additional: 'Доп.Телефон',
  email: 'Почта',
  vk: 'VK',
  facebook: 'Facebook',
  other: 'Другое'
}

export function getFullName(user) {
  return `${user.lastName} ${user.name} ${user.surname}`;
}

export function formatedData(date) {
  const data = new Date(date);
  const day = formatNumber(data.getDay());
  const month = formatNumber(data.getMonth());
  const fullYear = data.getFullYear();
  const hours = formatNumber(data.getHours());
  const minutes = formatNumber(data.getMinutes());

  return `${day}.${month}.${fullYear} <span class="hours">${hours}</span><span class="colon">:</span><span class="hours">${minutes}</span>`;
}

function formatNumber(number) {
  return number < 10 ? '0' + number : number;
}

export function createContactsIcons(contacts, userId) {
  const formatted = contacts.map((el, index) => `
      <div class="img ${el.type} img-${userId}-${index}"></div>
    `);

  return formatted.join('');
}