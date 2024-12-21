import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../core/components/catalyst/table";
import { useEffect, useState } from "react";

import { Panel } from "../../../core/components/Panel";
import { UploadsResponse } from "../../../core/models/uploads-response";
import api from "../../../core/services/HttpClient";

export function Uploads() {
  const [uploads, setUploads] = useState<Array<UploadsResponse>>([]);
  const [inProgress, setInProgress] = useState(false);

  const getUploads = () => {
    setInProgress(true);
    api.get(`${import.meta.env.VITE_BACKEND_URL}/uploads`, {
      timeout: import.meta.env.VITE_TIMEOUT
    }).json().then((res: any) => {
      setUploads(res);
    }).finally(() => {
      setInProgress(false);
    });
  };

  const deleteTable = (source: string) => {
    setInProgress(true);
    api.delete(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
      timeout: import.meta.env.VITE_TIMEOUT,
      json: { source }
    }).json().then((res: any) => {
      setUploads(res);
    }).finally(() => {
      setInProgress(false);
    });
  };

  useEffect(() => {
    getUploads();
  }, []);

  return (
    <>
      <Panel className="mb-4">
        <Table striped dense>
          <TableHead>
            <TableRow>
              <TableHeader className="py-0 px-1 text-xs/6 font-medium text-left">Source</TableHeader>
              <TableHeader className="py-0 px-1 text-xs/6 font-medium text-left">Category</TableHeader>
              <TableHeader className="py-0 px-1 text-xs/6 font-medium text-left">Metadata</TableHeader>
              <TableHeader className="py-0 px-1 text-xs/6 font-medium text-left">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploads.map((upload, index) => (
              <TableRow key={index} className="border-b border-gray-600 hover:bg-gray-200">
                <TableCell className="text-xs/6 text-gray-800 text-left px-1">{upload.source}</TableCell>
                <TableCell className="text-xs/6 text-gray-800 text-left px-1">{upload.category}</TableCell>
                <TableCell className="text-xs/6 text-gray-800 text-left px-1">{upload.metadata.map(item => item.name).join(', ')}</TableCell>
                <TableCell className="text-xs/6 text-left px-1">
                  <button className="primary-button !text-xs/6 !py-0.5">View</button>
                  <button className="primary-button !text-xs/6 !py-0.5 ml-2" onClick={(e) => deleteTable(upload.source)}>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
