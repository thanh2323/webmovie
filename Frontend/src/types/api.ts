export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
}

export interface UserInfo {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Country {
    id: string;
    name: string;
    slug: string;
}

export interface Pagination {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
}

export interface MovieItem {
    name: string;
    slug: string;
    origin_name: string;
    thumb_url: string;
    poster_url: string;
    year: number;
}

export interface MovieInfo {
    id: string;
    name: string;
    slug: string;
    origin_name: string;
    content: string;
    type: string;
    status: string;
    thumb_url: string;
    poster_url: string;
    is_copyright: boolean;
    sub_docquyen: boolean;
    chieurap: boolean;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    notify: string;
    showtimes: string;
    year: number;
    view: number;
    actor: string[];
    director: string[];
    category: Category[];
    country: Country[];
}

export interface EpisodeData {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
}

export interface EpisodeServer {
    server_name: string;
    server_data: EpisodeData[];
}

export interface MovieListResponse {
    status: boolean;
    items: MovieItem[];
    pagination?: Pagination;
}

export interface MovieDetailResponse {
    status: boolean;
    msg: string;
    movie?: MovieInfo;
    episodes: EpisodeServer[];
}

export interface FilteredParams {
    type_slug: string;
    filterCategory: string[];
    filterCountry: string[];
    filterYear: string;
    sortType: string;
    pagination?: Pagination;
}

export interface FilteredData {
    seoOnPage?: any;
    breadCrumb: any[];
    titlePage: string;
    items: MovieItem[];
    params?: FilteredParams;
    type_list: string;
    APP_DOMAIN_CDN_IMAGE: string;
}

export interface FilteredMovieListResponse {
    status: boolean;
    msg: string;
    data?: FilteredData;
}

export interface CategoryData {
    items: Category[];
}

export interface CategoryResponse {
    status: boolean;
    msg: string;
    data?: CategoryData;
}

export interface CountryData {
    items: Country[];
}

export interface CountryResponse {
    status: boolean;
    msg: string;
    data?: CountryData;
}
