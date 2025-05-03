/**
 * A location of a Travel Guide or Activity.
 */
export interface Location {
    street?: string;
    zip?: string;
    city?: string;
    state?: string;
    country: string;
}

/**
 * Categories to classify Travel Guides and Activities.
 */
export enum Category {
    MIX,
    CULTURE,
    ACTION,
    RELAX,
    ADVENTURE,
    SPORTS,
    ROADTRIP,
}

/**
 * Error if the user is not authorized to access a resource.
 */
export class UnauthorizedError extends Error {}

/**
 * Error if the resource doesn't exist.
 */
export class NotFoundError extends Error {}
