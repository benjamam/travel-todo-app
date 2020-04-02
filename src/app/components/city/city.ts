import { Destination } from '../destination/destination';

export interface City {
    _id?: string;
    name: string;
    state: string;
    country: string;
    destinations?: Destination[];
}

export interface CityForCreation {
    name: string;
    state?: string;
    country?: string;
}

