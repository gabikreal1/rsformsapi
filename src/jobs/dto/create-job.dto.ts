import { Picture } from "../entities/picture.entity";

export class CreateJobDto {
  client: string;
  agent: string;
  address?: string;
  postcode?: string;
  description?: string;
  contactNumber?: string;
  startTime: number;
  endTime: number;
  isCompleted?: boolean;
  price?: number;
  invoiceNumber?: number;
  YHS?: string;
  jobNo?: string;
  pictures?: Picture[];
  additionalJobDetails?: string;
  lastUpdatedTime?: number;
  removed?: boolean;
}
