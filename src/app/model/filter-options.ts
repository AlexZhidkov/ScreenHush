import { Geopoint } from "geofire-common";

export interface FilterOptionsRequest {
    Location?: Geopoint;
    UseCurrentLocation?: boolean;
}