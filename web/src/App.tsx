import { useEffect, useState } from 'react';

import { PhotoIcon } from '@heroicons/react/24/solid';
import ky from 'ky';

export default function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const submitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('query submitted');
    ky.post(`${import.meta.env.VITE_BACKEND_URL}/query`, { json: { query }, timeout: 240 * 1000 })
      .json()
      .then((res: any) => {
        console.log(res);
        setAnswer(res.message.content);
      }).catch((err: any) => {
        console.error(err);
      });
  }

  return (
    <section className="grid justify-items-center my-16">
      <form className=" bg-gray-100 p-8 min-w-96 max-w-2xl">
        <aside className="bg-amber-300 p-4 rounded-lg">
          {answer}
        </aside>
        <div className="border-b border-gray-900/10 pb-12">
          <div className="col-span-full">
            <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
              Query
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={3}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                defaultValue={''}
              />
            </div>
            <button
              type="submit"
              className="primary-button mt-4 float-right"
              onClick={(e) => submitQuery(e)}
            >
              Query
            </button>
            <p className="mt-3 text-sm/6 text-gray-600">Ask something</p>
          </div>

          <div className="col-span-full mt-10">
            <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
              Document upload
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="cancel-button">
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  )
}
