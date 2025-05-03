import { Category, Location, UnauthorizedError } from "./Shared";

export interface TravelGuide {
    id?: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    location: Location;
    category: Category;
}

export interface CreateTravelGuideRequest {
    travelGuide: TravelGuide;
    secret: string;
}

export interface UpdateTravelGuideRequest {
    travelGuide: TravelGuide;
}

export async function createTravelGuide(
    data: CreateTravelGuideRequest,
): Promise<TravelGuide> {
    const response = await fetch("http://localhost:9090/travel-guides", {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify(data),
    });
    if (response.status !== 201) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}

export async function updateTravelGuide(
    id: string,
    data: UpdateTravelGuideRequest,
    secret: string,
): Promise<TravelGuide | null> {
    const response = await fetch("http://localhost:9090/travel-guides/" + id, {
        method: "PUT",
        headers: new Headers({
            "content-type": "application/json",
            "x-tg-secret": secret,
        }),
        body: JSON.stringify(data),
    });
    if (response.status === 404) {
        return null;
    }
    if (response.status === 401) {
        throw new UnauthorizedError();
    }
    if (response.status !== 200) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}

export async function getTravelGuides(): Promise<TravelGuide[]> {
    const response = await fetch("http://localhost:9090/travel-guides", {
        method: "GET",
        headers: new Headers({
            "content-type": "application/json",
        }),
    });
    if (response.status !== 200) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}

export async function getTravelGuideById(
    id: string,
    secret?: string,
): Promise<TravelGuide | null> {
    const response = await fetch("http://localhost:9090/travel-guides/" + id, {
        method: "GET",
        headers: new Headers({
            "content-type": "application/json",
            ...(secret !== undefined ? { "x-tg-secret": secret } : {}),
        }),
    });
    if (response.status === 404) {
        return null;
    }
    if (response.status === 401) {
        throw new UnauthorizedError();
    }
    if (response.status !== 200) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}

export async function deleteTravelGuideById(
    id: string,
    secret: string,
): Promise<void> {
    const response = await fetch("http://localhost:9090/travel-guides/" + id, {
        method: "DELETE",
        headers: new Headers({
            "content-type": "application/json",
            "x-tg-secret": secret,
        }),
    });
    if (response.status === 401) {
        throw new UnauthorizedError();
    }
    if (response.status !== 200) {
        throw new Error();
    }
}
