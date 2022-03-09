(() => {
  const times = [
    '07:00 - 07:50',
    '07:50 - 08:40',
    '08:55 - 09:45',
    '09:45 - 10:35',
    '10:50 - 11:40',
    '11:40 - 12:30',
    '13h00 - 13h50',
    '13h50 - 14h40',
    '14h55 - 15h45',
    '15h45 - 16h35',
    '16h50 - 17h40',
    '17h40 - 18h30',
    '18:45 - 19h35',
    '19h35 - 20h25',
    '20h35 - 21h25',
    '21h25 - 22h15',
  ];

  const STORAGE_KEY = 'X-SIGAA-TO-SCHEDULE-DATA';
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const { colors = [], schedule = [] } = stored;

  const tbody = document.querySelector('table tbody');
  const form = document.querySelector('form');
  const items = form.querySelector('#items');

  let getColor;
  let generateColor;
  let regenerateColor;

  getColor = (index) => {
    let color = colors[index];

    if (!color) {
      color = generateColor();
      colors[index] = color;
    }

    return color;
  };

  generateColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  regenerateColor = (index) => {
    colors[index] = generateColor();
  };

  function clearTable() {
    tbody.innerHTML = '';
    for (let i = 0; i < times.length; i++) {
      const time = times[i];

      const tr = document.createElement('tr');
      for (let j = 0; j < 8; j++) {
        const td = document.createElement('td');
        td.textContent = '';

        if (j === 0) {
          td.textContent = time;
        }

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
  }

  function fillData() {
    for (let index = 0; index < schedule.length; index++) {
      const item = schedule[index];
      const [days, itemTimes] = item.sigaa.split(/[A-Z]/);

      const shift = item.sigaa.charAt(days.length);
      const sum = shift === 'M' ? 0 : shift === 'T' ? 6 : 12;

      daysIndexes = Array.from(days).map((item) => Number(item));
      timesIndexes = Array.from(itemTimes).map((item) => Number(item));

      timesIndexes.forEach((time) => {
        const tr = tbody.querySelector(`tr:nth-of-type(${time + sum})`);

        daysIndexes.forEach((day) => {
          const td = tr.querySelector(`td:nth-child(${day + 1})`);
          if (td.textContent === '') {
            const container = document.createElement('div');
            container.classList.add('container');
            td.appendChild(container);
          }

          const text = document.createElement('span');
          text.textContent = item.name;
          text.style.borderColor = getColor(index);

          td.querySelector('.container').appendChild(text);
        });
      });
    }

    const spans = document.querySelectorAll('tbody td .container span');
    const height = Array.from(spans)
      .map((span) => span.offsetHeight)
      .reduce((acc, height) => {
        return acc < height ? height : acc;
      }, 0);
    spans.forEach((span) => {
      span.style.minHeight = height + 'px';
    });
  }

  function generateTable() {
    clearTable();
    fillData();
  }

  function updateStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ colors, schedule }));
  }

  function generateItems() {
    items.innerHTML = '';
    schedule.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('item');
      div.style.borderColor = getColor(index);
      div.onclick = () => {
        regenerateColor(index);
        generateItems();
        generateTable();

        updateStorage();
      };

      const span = document.createElement('span');
      span.textContent = `${item.name} (${item.sigaa})`;
      div.appendChild(span);

      const remove = document.createElement('button');
      remove.textContent = '\u00D7';
      remove.type = 'button';
      remove.onclick = (event) => {
        event.preventDefault();
        schedule.splice(index, 1);
        colors.splice(index, 1);
        generateItems();
        generateTable();

        updateStorage();
      };
      div.appendChild(remove);

      items.appendChild(div);
    });
  }

  form.onsubmit = (event) => {
    event.preventDefault();

    const name = form.querySelector('#name');
    const code = form.querySelector('#code');

    const newItem = {
      name: name.value.trim(),
      sigaa: code.value.trim(),
    };
    schedule.push(newItem);

    generateTable();
    generateItems();

    updateStorage();
  };

  generateTable();
  generateItems();
})();
