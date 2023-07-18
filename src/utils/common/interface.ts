export interface PaginationResponse<T> {
  otherParams: any;
  results: T[];
  offset: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
export interface JwtPayload {
  token_type: string;
  tenant_id: string;
  client_id: string;
  is_admin: boolean;
  user_id: string;
  user_full_name: string;
  scopes: string;
  groups: [];
  iat: number;
  exp: number;
}
