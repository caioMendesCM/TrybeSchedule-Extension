/* global chrome */
const SEC = 1000;

const createTabela = (trybeSchedule) => {
  const tabela = document.getElementById('tabela');
  tabela.innerHTML = '';

  const tabelaTitle = document.createElement('p');
  tabelaTitle.innerText = 'Horários Trybe';

  trybeSchedule.forEach(({ schedule, zoomLink }) => {
    const pTagHour = document.createElement('p');
    pTagHour.innerText = schedule;
    tabela.appendChild(pTagHour);
    if (zoomLink) {
      const aLinkZoom = document.createElement('a');
      aLinkZoom.innerText = 'Zoom';
      aLinkZoom.href = zoomLink;
      aLinkZoom.target = '_blank';
      aLinkZoom.rel = 'noreferrer noopener';
      tabela.appendChild(aLinkZoom);
    }
  });
};

try {
  const getTodaySchedule = document.getElementById('getTodaySchedule');
  getTodaySchedule.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    let trybeSchedule = [];

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['getSchedule.js'],
    });

    chrome.alarms.create('Test1111', { when: Date.now() + 5000 });
    chrome.alarms.getAll((resp) =>
      console.log('----------INDEX----------\n resp Alarms: ', resp)
    );

    chrome.runtime.sendMessage('runAlarmsAnNotifications', () => {});

    chrome.storage.local.get(['scheduleAndLinks'], ({ scheduleAndLinks }) => {
      trybeSchedule = scheduleAndLinks;
    });
    // createTabela(trybeSchedule)
    setTimeout(
      () => (document.getElementById('tabela').style.display = 'flex'),
      1500
    );
    setTimeout(() => createTabela(trybeSchedule), 1.5 * SEC);
  });
} catch (error) {
  console.log(error);
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

document.querySelector('#switch-input').addEventListener('click', switchTheme);
