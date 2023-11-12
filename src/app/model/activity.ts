import { ɵHttpInterceptingHandler } from "@angular/common/http";

export interface Activity {
    id: Number;
    title: string;
    icon: string;
    mapsUrl: string;
    address: string;
    distanceInKm: number;
    activity: string;
    tags: string[];
    imageUrl: string;
}