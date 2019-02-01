let gurl = '';

const lighthouse = (url, callback) =>
  fetch(
    'https://builder-dot-lighthouse-ci.appspot.com/stream?url=' +
      (url.startsWith('https://') || url.startsWith('https://')
        ? url
        : 'https://' + url)
  )
    .then(response => {
      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      return reader.read().then(function processResult(result) {
        if (result.done) return;

        callback();

        const url = /data: done (.+)/.exec(
          decoder.decode(result.value, { stream: true })
        );
        if (url) {
          gurl = url[1];
          return Promise.resolve(url[1]);
        }

        return reader.read().then(processResult);
      });
    })
    .then(fetch)
    .then(response => response.text())
    .then(text => {
      const head = /<script>window\.__LIGHTHOUSE_JSON__ =(.+?);<\/script>/gm;

      return { url: gurl, audit: JSON.parse(head.exec(text)[1]) };
    });

export default lighthouse;
