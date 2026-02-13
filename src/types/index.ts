// ──────────────────────────────────────────────
// Shared TypeScript interfaces for Project Zenith
// ──────────────────────────────────────────────

// ── NASA APOD ────────────────────────────────
export interface APODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  title: string;
  url: string;
  copyright?: string;
}

// ── ISS Tracking (Open Notify) ───────────────
export interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface ISSAPIResponse {
  message: string;
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

// ── Mars Rover Photos ────────────────────────
export type RoverName = 'curiosity' | 'perseverance';

export type CameraName =
  | 'FHAZ'
  | 'RHAZ'
  | 'MAST'
  | 'CHEMCAM'
  | 'MAHLI'
  | 'MARDI'
  | 'NAVCAM'
  | 'PANCAM'
  | 'MINITES'
  | 'EDL_RUCAM'
  | 'EDL_RDCAM'
  | 'EDL_DDCAM'
  | 'EDL_PUCAM1'
  | 'EDL_PUCAM2'
  | 'NAVCAM_LEFT'
  | 'NAVCAM_RIGHT'
  | 'MCZ_RIGHT'
  | 'MCZ_LEFT'
  | 'FRONT_HAZCAM_LEFT_A'
  | 'FRONT_HAZCAM_RIGHT_A'
  | 'REAR_HAZCAM_LEFT'
  | 'REAR_HAZCAM_RIGHT'
  | 'SKYCAM'
  | 'SHERLOC_WATSON';

export interface MarsCamera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface MarsRover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
}

export interface MarsPhoto {
  id: number;
  sol: number;
  camera: MarsCamera;
  img_src: string;
  earth_date: string;
  rover: MarsRover;
}

export interface MarsPhotosResponse {
  photos: MarsPhoto[];
}

export interface MarsLatestPhotosResponse {
  latest_photos: MarsPhoto[];
}

// ── Asteroids (NeoWs) ────────────────────────
export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  is_sentry_object: boolean;
}

export interface NeoWsResponse {
  element_count: number;
  near_earth_objects: Record<string, NearEarthObject[]>;
}

// ── Global App State ─────────────────────────
export interface ZenithState {
  apiKey: string;
  setApiKey: (key: string) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  activeModule: ModuleName;
  setActiveModule: (module: ModuleName) => void;
}

export type ModuleName =
  | 'dashboard'
  | 'orbital-tracker'
  | 'martian-archive'
  | 'asteroid-sentinel';

// ── Service Layer ────────────────────────────
export interface APIError {
  status: number;
  message: string;
  endpoint: string;
  timestamp: number;
  isRateLimited: boolean;
}

export interface FetchOptions {
  signal?: AbortSignal;
  params?: Record<string, string>;
}
