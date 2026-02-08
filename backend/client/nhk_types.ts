/** PgDateTv API v3 のリクエストパラメータ */
export interface PgDateTvReq {
  area: string;
  service: string;
  date: string;
  apikey: string;
}

/** PgDateTv API v3 のレスポンス */
export interface PgDateTvResponse {
  [serviceId: string]: PgDateTvService;
}

/** サービスごとの番組リスト */
export interface PgDateTvService {
  publishedOn: BroadcastService[];
  publication: BroadcastEvent[];
}

/** 放送サービス */
export interface BroadcastService {
  type: string;
  id: string;
  name: string;
}

/** 番組オブジェクト */
export interface BroadcastEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  identifierGroup?: BroadcastEventIdentifierGroup;
  misc?: BroadcastEventMisc;
  detailedDescription?: BroadcastEventDetailedDescription;
}

export interface BroadcastEventIdentifierGroup {
  genre?: BroadcastEventGenre[];
}

export interface BroadcastEventGenre {
  id: string;
  name1?: string;
  name2?: string;
}

export interface BroadcastEventMisc {
  actList?: BroadcastEventAct[];
}

export interface BroadcastEventAct {
  role?: string;
  name: string;
}

export interface BroadcastEventDetailedDescription {
  epg40?: string;
  epg80?: string;
  epg200?: string;
  epgInformation?: string;
}

/** 視聴番組 */
export interface WatchProgram {
  title: string;
  subtitle: string;
  content: string;
  act: string;
  genres: string[];
  start_time: string;
  end_time: string;
}
