export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType;
}

export interface Pricing {
  price: string;
  period: string;
  features: string[];
}

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatarUrl: string;
}