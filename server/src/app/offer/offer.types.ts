import { Offer } from "@prisma/client";
import { Request } from "express";
import { OfferInput } from "./offer.validator";

// Base response interface
interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Create offer request and response types
export interface CreateOfferRequest extends Request {
  body: {
    taskId: string;
    providerId: string;
    hourlyRate: number;
    currency: string;
  };
}

export interface CreateOfferResponse extends BaseResponse {
  data?: Offer;
}

// Get offer request and response types
export interface GetOfferRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetOfferResponse extends BaseResponse {
  data?: Offer;
}

// Get offers by task ID request and response types
export interface GetOffersByTaskRequest extends Request {
  params: {
    taskId: string;
  };
}

// Get offers by provider ID request and response types
export interface GetOffersByProviderRequest extends Request {
  params: {
    providerId: string;
  };
}

// List offers response type
export interface ListOffersResponse extends BaseResponse {
  data?: {
    offers: Offer[];
    total: number;
    page: number;
    limit: number;
  };
}

// Update offer request and response types
export interface UpdateOfferRequest extends Request {
  params: {
    id: string;
  };
  body: Partial<OfferInput>;
}

export interface UpdateOfferResponse extends BaseResponse {
  data?: Offer;
}

// Delete offer request and response types
export interface DeleteOfferRequest extends Request {
  params: {
    id: string;
  };
}

export interface DeleteOfferResponse extends BaseResponse {
  data?: Offer;
}
