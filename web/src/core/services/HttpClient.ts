import ky from 'ky';

function dispatchHttpErrorEvent(message: string | null) {
  const event = new CustomEvent('httpError', { detail: message });
  window.dispatchEvent(event);
}

function dispatchProgressEvent(inProgress: boolean) {
  const event = new CustomEvent('inProgress', { detail: inProgress });
  window.dispatchEvent(event);
}

const api = ky.create({
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const errorText = await response.text();
          dispatchHttpErrorEvent(errorText);
          dispatchProgressEvent(false);
        } else {
          dispatchProgressEvent(false);
          dispatchHttpErrorEvent('');
        }
      }
    ],
    beforeError: [
      error => {
        dispatchHttpErrorEvent(error.message);
        dispatchProgressEvent(false);
        return error;
      }
    ],
    beforeRequest: [
      () => {
        dispatchHttpErrorEvent(null);
        dispatchProgressEvent(true);
      },
    ],
  }
});

export default api;


