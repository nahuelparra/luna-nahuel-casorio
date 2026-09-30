export interface RSVPGuest {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  attending: 'yes' | 'no';
  guestsCount: number;
  companionNames?: string;
  dietaryRequirement: 'none' | 'celiac' | 'vegetarian' | 'vegan' | 'hypertensive' | 'other';
  dietaryDetails?: string;
  songRequest?: string;
  personalMessage?: string;
  createdAt: string;
}

export interface InvitedGuest {
  id: string;
  fullName: string;
  allowedSeats: 1 | 2; // 1 = solo el titular, 2 = titular + 1 acompañante
  suggestedCompanion?: string;
  groupCategory?: string; // 'Familia', 'Amigos', 'Trabajo', etc.
}

export interface WeddingConfig {
  brideName: string;
  groomName: string;
  brideInitial: string;
  groomInitial: string;
  eventDate: string; // ISO string e.g. "2026-11-21T20:00:00"
  ceremonyVenue: {
    name: string;
    description?: string;
    time: string;
    address: string;
    city: string;
    mapsUrl: string;
    coordinates: { lat: number; lng: number };
  };
  partyVenue: {
    name: string;
    description?: string;
    time: string;
    address: string;
    city: string;
    mapsUrl: string;
    coordinates: { lat: number; lng: number };
  };
  dressCode: {
    type: string;
    description: string;
    recommendedPalette: string[];
    note: string;
  };
  bankDetails: {
    alias: string;
    cbu: string;
    bank: string;
    holder: string;
    message: string;
  };
}
