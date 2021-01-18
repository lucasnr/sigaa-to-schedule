(() => {
  const tbody = document.querySelector('table tbody');
  const form = document.querySelector('form');
  const nameInput = form.querySelector('#name');
  const codeInput = form.querySelector('#code');
  const items = form.querySelector('#items');

  const times = [
    '07:00 - 07:50',
    '07:50 - 08:40',
    '08:55 - 09:45',
    '09:45 - 10:35',
    '10:50 - 11:40',
    '11:40 - 12:30',
    '13h10 - 14h00',
    '14h00 - 14h50',
    '14h50 - 15h40',
    '15h50 - 16h40',
    '16h40 - 17h30',
    '17h30 - 18h20',
    '19:00 - 19h50',
    '19h50 - 20h40',
    '20h40 - 21h30',
    '21h30 - 22h20',
  ];

  /*

  const schedule = [
    {
      name: 'ESTRUTURA DE DADOS BÁSICAS I',
      sigaa: '35M12',
    },
    {
      name: 'LINGUAGEM DE PROGRAMAÇÃO I',
      sigaa: '35M34',
    },
    {
      name: 'ARQUITETURA DE COMPUTADORES',
      sigaa: '24N34',
    },
    {
      name: 'PRÁTICAS DE LEITURA E ESCRITA EM PORTUGUÊS II',
      sigaa: '3N34',
    },
    {
      name: 'FUNDAMENTOS MATEMÁTICOS DA COMPUTAÇÃO I',
      sigaa: '246M34',
    },
    {
      name: 'VETORES E GEOMETRIA ANALÍTICA',
      sigaa: '35N12',
    },
  ];

*/

  let schedule = [];

  function clearTable() {
    tbody.innerHTML = '';
    for (let i = 0; i < times.length; i++) {
      const time = times[i];

      const tr = document.createElement('tr');
      for (let j = 0; j < 8; j++) {
        const td = document.createElement('td');
        td.textContent = '---';

        if (j === 0) td.textContent = time;

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
  }

  function fillData() {
    for (let i = 0; i < schedule.length; i++) {
      const item = schedule[i];
      const [days, itemTimes] = item.sigaa.split(/[A-Z]/);

      const shift = item.sigaa.charAt(days.length);
      const sum = shift === 'M' ? 0 : shift === 'T' ? 6 : 12;

      daysIndexes = Array.from(days).map((item) => Number(item));
      timesIndexes = Array.from(itemTimes).map((item) => Number(item));

      timesIndexes.forEach((time) => {
        const tr = tbody.querySelector(`tr:nth-of-type(${time + sum})`);

        daysIndexes.forEach((day) => {
          const td = tr.querySelector(`td:nth-child(${day + 1})`);
          if (td.textContent === '---') {
            td.textContent = '';
            const container = document.createElement('div');
            container.classList.add('container');
            td.appendChild(container);
          }

          const text = document.createElement('span');
          text.textContent = item.name;

          td.querySelector('.container').appendChild(text);
        });
      });
    }
  }

  function makeTable() {
    clearTable();
    fillData();
  }
  makeTable();

  form.onsubmit = (event) => {
    event.preventDefault();
    const newItem = {
      name: nameInput.value,
      sigaa: codeInput.value,
    };
    schedule.push(newItem);
    makeTable();
    displayItems();
  };

  function displayItems() {
    items.innerHTML = '';
    schedule.forEach((item, index) => {
      const button = document.createElement('button');
      button.classList.add('item');
      button.type = 'button';

      const span = document.createElement('span');
      span.textContent = `${item.name} (${item.sigaa})`;
      const remove = document.createElement('i');
      remove.textContent = '\u00D7';
      button.appendChild(span);
      button.appendChild(remove);

      button.onclick = () => {
        schedule = schedule.filter((item, i) => i !== index);
        displayItems();
        makeTable();
      };

      items.appendChild(button);
    });
  }
})();
