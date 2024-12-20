import ky from 'ky';

export function dispatchHttpErrorEvent(message: string) {
  const event = new CustomEvent('httpError', { detail: message });
  window.dispatchEvent(event);
}

const api = ky.create({
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const errorText = await response.text();
          dispatchHttpErrorEvent(errorText);
        }
      }
    ],
    beforeError: [
      error => {
        dispatchHttpErrorEvent(error.message);
        return error;
      }
    ]
  }
});

export default api;
