export type SubscriptionTier = 'free' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  searches_used: number;
  search_limit: number;
  subscription_tier: SubscriptionTier;
  subscription_status?: string;
  stripe_customer_id?: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
}