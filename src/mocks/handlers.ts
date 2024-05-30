import { HttpResponse, http } from 'msw';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const handlers = [
  http.get(`${baseUrl}/cats`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: 'Luna' },
        { id: 2, name: 'Simba' },
        { id: 3, name: 'Pixel' },
      ],
    });
  }),
];
