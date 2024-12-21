import { Metadata } from "./metadata";

export interface UploadsResponse {
  source: string;
  category: string;
  metadata: Array<Metadata>;
}
