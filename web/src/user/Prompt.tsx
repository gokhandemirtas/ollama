import ky from "ky";
import { useState } from "react";

export default function Prompt() {
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
    <>
      <aside className="shadow-lg rounded-lg p-8 min-w-min border border-x-slate-300 ">
        <form className="bg-white">
          { answer && <aside className="bg-amber-300 p-4 rounded-lg">
            {answer}
          </aside> }

          <div className="col-span-full">
            <label htmlFor="prompt" className="block text-sm/6 font-medium text-gray-900">
              Query
            </label>
            <div className="mt-2">
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full form-input rounded-8 px-2 py-2 text-sm/4"
                defaultValue={''}
              />
            </div>
            <div className="position-relative">
              <p className="mt-3 text-sm/6 text-gray-600">Ask something</p>
              <div className="mt-4 float-right">
                <button
                  type="submit"
                  className="primary-button"
                  onClick={(e) => submitQuery(e)}
                >
                  Query
                </button>
              </div>
            </div>
          </div>
        </form>
      </aside>
    </>
  )
}
