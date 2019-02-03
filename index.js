import passepartout from 'passepartout';

import model from './model';

import './style.styl';

import lighthouse from './lighthouse';

const controller = {
  setValue: ({ args }) => ({
    url: args[0].url,
    data: args[0].audit.audits.interactive
  }),

  progress: ({ model }) => ({ progress: model.progress + 1 }),

  update: ({ event, controller }) => {
    lighthouse(event.target.value, controller.progress).then(
      controller.setValue
    );

    return { progress: 0, url: null, data: {} };
  }
};

const bar = ({ model }) => {
  let value = model.progress * 1.8;
  if (value > 100 || model.url) {
    value = 100;
  }
  return [{ id: 'bar', style: { width: value + '%' } }];
};
const view = ({ controller, model }) => [
  { _: 'main' },
  [
    {
      _: 'img',
      src: 'https://website.energy/background.2fd0db14.png',
      id: 'background'
    }
  ],
  [{ _: 'h1' }, 'measure.website.energy'],
  [
    {
      _: 'input',
      onchange: controller.update(),
      placeholder: 'URL eingeben',
      spellcheck: 'false'
    }
  ],
  bar,
  [
    {
      id: 'wrapper',
      class: model.data.displayValue && model.url ? 'show' : ''
    },
    [
      { id: 'display' },
      [[{ _: 'p' }, 'Time to Interactive'], model.data.displayValue || ''],
      [
        {
          _: 'img',
          src: 'https://website.energy/zap.ee3d6eb8.svg',
          width: '40',
          height: '40',
          id: 'zap'
        }
      ],
      [
        [{ _: 'p' }, 'Energieverbrauch'],
        Math.round(((model.data.rawValue || 0) / 3600) * 6 * 0.15 * 10) / 10,
        ' mWh'
      ]
    ],
    [{ _: 'a', href: model.url || '' }, '🔗 Lighthouse Report']
  ],
  [
    {
      id: 'message',
      class: !model.data.displayValue && model.url ? 'show' : ''
    },
    '⚠ Keine Webseite gefunden'
  ]
];

passepartout({ model, view, controller });
