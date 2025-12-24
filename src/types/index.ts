export interface CorsOriginCallback {
    (err: Error | null, allow?: boolean): void;
}
