export interface ServiceData {
  id: string;
  average_rating: string;
  is_draft: boolean;
  total_number_of_ratings: number;
  title: string;
  slug: string;
  description: string;
  base_price: string;
  platform_fee: string;
  final_price: string;
  verification_status: "pending" | "verified" | "rejected"; // adjust if needed
  is_verified: boolean;
  duration_days: number;
  category: string;
  company_types: string[];
  offerings: string[];
  media: MediaItem[]; // change to proper type if you know the structure
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
}

export interface MediaItem {
  id: string;
  specialists?: string; // probably a foreign key (service ID)
  file_name: string;
  file_size: number;
  display_order: number;
  mime_type?: string;
  media_type: string; // e.g., "image", "video"
  fileUrl: string;
  uploaded_at?: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
export interface ServiceItem {
  id: string;
  average_rating: string;
  is_draft: boolean;
  total_number_of_ratings: number;
  title: string;
  slug: string;
  description: string;
  base_price: string;
  platform_fee: string;
  final_price: string;
  verification_status: "pending" | "verified" | "rejected"; // adjust if needed
  is_verified: boolean;
  duration_days: number;
  category: string;
  company_types: string[];
  offerings: string[];
  media: MediaItem[]; // change to a specific media type if needed
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface MetaData {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ServiceResponse {
  items: ServiceItem[];
  meta: MetaData;
}


