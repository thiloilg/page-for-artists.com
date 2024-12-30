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

export interface LinkTracking {
  id: number;
  documentId: string;
  datetime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  link: {
    id: number;
    documentId: string;
    url: string;
    platform: string;
  };
  page: {
    id: number;
    documentId: string;
    name: string;
    domain: string;
  };
}

export interface LinkTrackingResponse {
  data: LinkTracking[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
