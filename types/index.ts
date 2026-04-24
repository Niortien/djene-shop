// ─── Backend API types (aligned with djene-shop-backend entities) ────────────

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ApiProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  cloudinaryPublicId: string | null;
}

export interface ApiProduct {
  id: string; // UUID
  name: string;
  description: string | null;
  price: number; // FCFA
  salePrice: number | null; // prix promo
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  sizes: string[] | null;
  colors: string[] | null;
  sku: string | null;
  viewCount: number;
  category: ApiCategory | null;
  images: ApiProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  sortBy?: "price" | "createdAt" | "viewCount" | "name";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface ApiUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "client" | "seller" | "admin";
  isActive: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  profile?: ApiUserProfile;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

// ─── Cart (used locally in Zustand) ──────────────────────────────────────────

export interface CartItem {
  product: ApiProduct;
  quantity: number;
  size: string;
  color: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface ApiOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize: string | null;
  selectedColor: string | null;
  product: ApiProduct | null;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
  } | null;
  notes: string | null;
  user: ApiUser | null;
  items: ApiOrderItem[];
  createdAt: string;
  updatedAt: string;
}

