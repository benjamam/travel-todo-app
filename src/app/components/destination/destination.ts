export interface Destination {
    _id?: string;
    name: string;
    location: string;
    website?: string;
    cost?: string;
    description?: string;
    haveVisited: boolean;
    markedForDelete: boolean;
    mapsUrl?: string;
}

export interface DestinationForCreation {
    name: string;
    location: string;
    description?: string;
    cost?: string;
    website: string;
    haveVisited: boolean;
    mapsUrl: string;
}