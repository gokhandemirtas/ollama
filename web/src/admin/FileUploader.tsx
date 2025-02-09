import { Field, Fieldset, Input } from "@headlessui/react";
import { object, string } from "yup";
import { useEffect, useState } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { Panel } from "../core/components/Panel";
import { PhotoIcon } from "@heroicons/react/16/solid";
import api from "../core/services/HttpClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFile {
  metadata: string;
  category: string;
}

export default function FileUploader() {
  const [inProgress, setInProgress] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState("");

  const { register, watch, formState: { errors }, reset } = useForm<IFile>({
    resolver: yupResolver(object({
      metadata: string().required("Metadata is required").min(3, "Metadata must be at least 3 characters").max(30, "Metadata must be at most 30 characters"),
      category: string().required("Category is required").min(3, "Category must be at least 3 characters").max(30, "Category must be at most 30 characters"),
    })),
    mode: "onChange",
  })

  const formValues = watch();

  const abortController = new AbortController();

  const fileSelected = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.files) {
      const file = e.target.files[0];
      setFile(file);
      setUploadState(`Selected file: ${file.name}`);
    }
  };

  const upload = (e: React.FormEvent) => {
    e.preventDefault();
    setInProgress(true);
    const multipart = new FormData();

    multipart.append("file", file!);
    multipart.append("name", file!.name);
    multipart.append("metadata", formValues.metadata);
    multipart.append("category", formValues.category);
    setUploadState(`Uploading file: ${file!.name}`);

    api.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
      body: multipart,
      timeout: import.meta.env.VITE_TIMEOUT,
      signal: abortController.signal,
    })
      .json()
      .then((res: any) => {
        setUploadState(`Uploaded successfully: ${file!.name}`);
        reset();
      })
      .catch((err: any) => {
        setUploadState(`Could not upload: ${file!.name}`);
      })
      .finally(() => {
        setInProgress(false);
      });
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
      <Panel>
        <form>
          <aside className="mb-2">
            <label htmlFor="cover-photo">Document upload</label>
            {file && (
              <p className="text-xs text-green-700 font-medium mb-2">
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
          <Fieldset className="mb-2">
            <Field>
              <Input type="text"
                placeholder="Category"
                {...register("category")}
                className="input-override w-full !color-scheme:dark"/>
                {errors && errors.category ? <p className="error-text">{errors.category.message}</p> : null}
            </Field>
            <Field>
              <Input type="text"
                maxLength={30} required
                placeholder="Metadata"
                {...register("metadata")}
                className="input-override w-full !color-scheme:dark"/>
                {errors && errors.metadata ? <p className="error-text">{errors.metadata.message}</p> : null}
            </Field>
          </Fieldset>
          <div className="flex justify-end">
            <button type="button" className="cancel-button" disabled={inProgress} onClick={() => reset()}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button ml-4"
              onClick={(e) => upload(e)}
              disabled={inProgress || !file || !formValues.metadata || !formValues.category}
            >
              Save
            </button>
          </div>
        </form>
      </Panel>
      </ErrorBoundary>
    </>
  );
}
