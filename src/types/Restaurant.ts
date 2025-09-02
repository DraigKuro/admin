export interface SocialLink {
  enabled: boolean;
  url?: string;
}

export interface Restaurant {
  _id?: string;
  name: string;
  cif: string;
  openingHours: { open: string; close: string };
  
  email?: string;
  phone?: string;
  socialLinks?: {
    facebook?: SocialLink;
    instagram?: SocialLink;
    twitter?: SocialLink;
    tiktok?: SocialLink;
  };
  
  address?: string;
  reference?: string;
  mapUrl?: string;
  
  logoUrl?: string;
}
