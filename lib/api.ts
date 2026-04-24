import {
  ApiProduct,
  ApiCategory,
  ApiOrder,
  PaginatedResult,
  ProductFilters,
  AuthResponse,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8006/api/v1";

// ─── Generic fetch helper ─────────────────────────────────────────────────────

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
  message?: string;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const raw = body?.message ?? `API error ${res.status}: ${res.statusText}`;
    const message: string = Array.isArray(raw) ? raw.join(", ") : String(raw);
    throw new Error(message);
  }

  // Backend wraps responses: { success, statusCode, data: <payload>, timestamp }
  if (body && typeof body === "object" && "data" in body && "success" in body) {
    return (body as ApiEnvelope<T>).data;
  }

  return body as T;
}

// Helper to build query string from object (skips undefined/null values)
function toQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      q.set(key, String(value));
    }
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<ApiProduct>> {
  const query = toQuery(filters as Record<string, unknown>);
  return apiFetch<PaginatedResult<ApiProduct>>(`/products${query}`);
}

export async function getProduct(id: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${id}`);
}

export async function getCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>("/products/categories");
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function requestOtp(phone: string): Promise<{ message: string }> {
  return apiFetch("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp(
  phone: string,
  otp: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
  });
}

// ─── Authenticated helper ─────────────────────────────────────────────────────

export function authFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

// ─── Admin — Products ─────────────────────────────────────────────────────────

export async function adminCreateProduct(
  token: string,
  data: {
    name: string;
    description?: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    categoryId?: string;
    sizes?: string[];
    colors?: string[];
    sku?: string;
    isFeatured?: boolean;
  }
): Promise<ApiProduct> {
  return authFetch<ApiProduct>("/products", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(
  token: string,
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    salePrice: number | null;
    stock: number;
    categoryId: string;
    sizes: string[];
    colors: string[];
    sku: string;
    isFeatured: boolean;
    isActive: boolean;
  }>
): Promise<ApiProduct> {
  return authFetch<ApiProduct>(`/products/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProduct(token: string, id: string): Promise<void> {
  return authFetch<void>(`/products/${id}`, token, { method: "DELETE" });
}

export async function adminUploadProductImages(
  token: string,
  productId: string,
  files: File[]
): Promise<ApiProduct> {
  let result: ApiProduct | null = null;
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE}/products/${productId}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const raw = body?.message ?? `API error ${res.status}`;
      throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
    }
    result = (body && typeof body === "object" && "data" in body ? body.data : body) as ApiProduct;
  }
  return result!;
}

// ─── Admin — Categories ───────────────────────────────────────────────────────

export async function adminCreateCategory(
  token: string,
  data: { name: string; description?: string }
): Promise<ApiCategory> {
  return authFetch<ApiCategory>("/products/categories", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Admin — Orders ───────────────────────────────────────────────────────────

export async function adminGetOrders(token: string): Promise<ApiOrder[]> {
  return authFetch<ApiOrder[]>("/orders", token);
}

export async function adminUpdateOrderStatus(
  token: string,
  id: string,
  status: string
): Promise<ApiOrder> {
  return authFetch<ApiOrder>(`/orders/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ─── Client — Orders ──────────────────────────────────────────────────────────

export async function getMyOrders(token: string): Promise<ApiOrder[]> {
  return authFetch<ApiOrder[]>("/orders/my-orders", token);
}
