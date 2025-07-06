// Default user ID and API configuration
export const DEFAULT_USER_ID = "mwUWTsKbYeIVPV20BN8or955NA1J43"
export const API_BASE_URL = "https://test.mwonya.com/ios/Requests/endpoints"

// Content type mappings
export const CONTENT_TYPES = {
  HERO: "hero",
  IMAGE_AD: "image_ad",
  TEXT_AD: "text_ad",
  NEW_RELEASE: "newRelease",
  SLIDER: "slider",
  ARTIST: "artist",
  GENRE: "genre",
  TIMELY: "timely",
  RECENTLY: "recently",
  TREND: "trend",
  ALBUMS: "albums",
  PLAYLIST: "playlist",
  ARTIST_MORE_LIKE: "artist_more_like",
  DJS: "djs",
} as const

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES]
