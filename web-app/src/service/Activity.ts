import { Category, Location, NotFoundError, UnauthorizedError } from "./Shared";

/**
 * An Activity is one element of a Travel Guide.
 */
export interface Activity {
    id?: string;
    name: string;
    description?: string;
    location: Location;
    category: Category;
    timeInMin: number;
    costsInCent: number;
}

export interface CreateActivityRequest {
    activity: Activity;
}

export async function createActivity(
    travelGuideId: string,
    data: CreateActivityRequest,
    secret: string,
): Promise<Activity[]> {
    const response = await fetch(
        "http://localhost:9090/travel-guides/" + travelGuideId + "/activities",
        {
            method: "POST",
            headers: new Headers({
                "content-type": "application/json",
                "x-tg-secret": secret,
            }),
            body: JSON.stringify(data),
        },
    );
    if (response.status !== 201) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}

export async function updateActivity(
    travelGuideId: string,
    activityId: string,
    data: CreateActivityRequest,
    secret: string,
): Promise<Activity[]> {
    const response = await fetch(
        "http://localhost:9090/travel-guides/" +
            travelGuideId +
            "/activities/" +
            activityId,
        {
            method: "PUT",
            headers: new Headers({
                "content-type": "application/json",
                "x-tg-secret": secret,
            }),
            body: JSON.stringify(data),
        },
    );
    if (response.status === 404) {
        throw new NotFoundError();
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

export async function getActivities(
    travelGuideId: string,
    secret?: string,
): Promise<Activity[]> {
    const response = await fetch(
        "http://localhost:9090/travel-guides/" + travelGuideId + "/activities",
        {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json",
                ...(secret !== undefined ? { "x-tg-secret": secret } : {}),
            }),
        },
    );
    if (response.status !== 200) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}

export async function deleteActivity(
    travelGuideId: string,
    activityId: string,
    secret: string,
): Promise<Activity[]> {
    const response = await fetch(
        "http://localhost:9090/travel-guides/" +
            travelGuideId +
            "/activities/" +
            activityId,
        {
            method: "DELETE",
            headers: new Headers({
                "content-type": "application/json",
                "x-tg-secret": secret,
            }),
        },
    );
    if (response.status === 401) {
        throw new UnauthorizedError();
    }
    if (response.status !== 200) {
        throw new Error();
    }
    const body = await response.json();
    return body;
}
