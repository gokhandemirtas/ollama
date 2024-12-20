import { PhotoIcon } from "@heroicons/react/16/solid";
import api from "../../../core/services/HttpClient";
import { useState } from "react";

export default function Uploader() {
  const [inProgress, setInProgress] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState("");
  const [formState, setFormState] = useState({
    metadata: "",
    category: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFile(null);
    setUploadState("");
    setFormState({
      metadata: "",
      category: "",
    });
  };

  const fileSelected = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.files) {
      const file = e.target.files[0];
      setFile(file);
      setUploadState(`Selected file: ${file.name}`);
    } else {
      resetForm();
    }
  };

  const upload = (e: React.FormEvent) => {
    e.preventDefault();
    setInProgress(true);
    const multipart = new FormData();

    multipart.append("file", file!);
    multipart.append("name", file!.name);
    multipart.append("metadata", formState.metadata);
    multipart.append("category", formState.category);
    setUploadState(`Uploading file: ${file!.name}`);

    api.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
      body: multipart,
      timeout: import.meta.env.VITE_TIMEOUT,
    })
      .json()
      .then((res: any) => {
        setUploadState(`Uploaded successfully: ${file!.name}`);
        resetForm();
      })
      .catch((err: any) => {
        setUploadState(`Could not upload: ${file!.name}`);
      })
      .finally(() => {
        setInProgress(false);
      });
  };

  return (
    <>
      <form className="panel">
        <aside className="input-container">
          <label htmlFor="cover-photo">Document upload</label>
          {file && (
            <p className="text-xs text-amber-700 font-medium mb-2">
              <strong>{uploadState}</strong> [ {(file.size / 1024 ** 2).toPrecision(2)} mb ]
            </p>
          )}
          <div className="rounded-lg border border-dashed border-slate-400 px-6 py-10">
            <div className="text-center">
              <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
              <div className="mt-4 font-normal text-xs/8 text-gray-600 ">
                <label htmlFor="file-upload" className="select-none">
                  <span className="border border-slate-500 p-1 rounded-md">Click here</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only !w-auto"
                    onClick={(e) => fileSelected()}
                    onChange={(e) => fileSelected(e)}
                    accept=".pdf"
                  />
                </label>
                <p>or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">PDF up to 10MB</p>
            </div>
          </div>
        </aside>
        <aside className="input-container">
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Category"
            onChange={handleInputChange}
            className="input"
            maxLength={30}
            required
            value={formState.category}
          />
        </aside>
        <aside className="input-container">
          <input
            type="text"
            id="metadata"
            name="metadata"
            placeholder="Metadata"
            onChange={handleInputChange}
            className="input"
            maxLength={30}
            required
            value={formState.metadata}
          />
        </aside>
        <div className="flex justify-end">
          <button type="button" className="cancel-button" disabled={!file || inProgress}>
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button ml-4"
            onClick={(e) => upload(e)}
            disabled={!file || inProgress}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
