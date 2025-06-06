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
    MIX = 0,
    CULTURE = 1,
    ACTION = 2,
    RELAX = 3,
    ADVENTURE = 4,
    SPORTS = 5,
    ROADTRIP = 6,
}

/**
 * Error if the user is not authorized to access a resource.
 */
export class UnauthorizedError extends Error {}

/**
 * Error if the resource doesn't exist.
 */
export class NotFoundError extends Error {}
