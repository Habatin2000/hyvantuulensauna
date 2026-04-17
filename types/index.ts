// Navigation types
export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

// Boat types
export interface Boat {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: {
    min: number;
    max: number;
    recommended: number;
  };
  features: string[];
  images: string[];
  pricing: {
    basePrice: number;
    currency: string;
    unit: 'hour' | 'session' | 'day';
  };
  amenities: string[];
  idealFor: string[];
}

// Booking types
export interface SummerBookingState {
  boatId: string | null;
  date: Date | null;
  duration: number;
  startTime: string | null;
  groupSize: number;
  extras: string[];
}

export interface PublicBookingState {
  sessionId: string | null;
  date: Date | null;
  tickets: number;
  ticketType: 'adult' | 'child' | 'student';
}

export interface PrivateBookingState {
  productId: string | null;
  date: Date | null;
  startTime: string | null;
  duration: number;
  groupSize: number;
  extras: string[];
}

// Session types for public sauna
export interface PublicSession {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  availableSpots: number;
  totalSpots: number;
  price: number;
  type: 'regular' | 'special' | 'theme';
  theme?: string;
}

// FAQ types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'summer' | 'private' | 'public' | 'practical';
}

// Gallery types
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: 'boats' | 'sauna' | 'experience' | 'winter' | 'summer';
}

// Testimonial types
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  context?: string;
  rating: number;
}

// Feature/Highlight types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Location types
export interface LocationInfo {
  address: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  arrivalInstructions: string[];
  parkingInfo: string;
  publicTransport: string[];
}

// Page content types
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryCta?: {
    text: string;
    href: string;
  };
  image: string;
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
}
