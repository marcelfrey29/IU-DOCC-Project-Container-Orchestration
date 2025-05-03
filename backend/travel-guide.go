package main

// A Travel Guide is a collection of activities and attractions at a specific location.
type TravelGuide struct {
	Id          string   `json:"id" dynamodbav:"id"`
	Name        string   `json:"name" dynamodbav:"name" validate:"required"`
	Private     bool     `json:"isPrivate" dynamodbav:"isPrivate"`
	Description string   `json:"description" dynamodbav:"description"`
	Location    Location `json:"location" dynamodbav:"location"`
	Category    Category `json:"category" dynamodbav:"category"`
}

// DynamoDB Item Representation of a Travel Guide.
type TravelGuideItem struct {
	HashId      string      `dynamodbav:"hashId"`
	RangeId     string      `dynamodbav:"rangeId"`
	Secret      string      `dynamodbav:"secret"`
	TravelGuide TravelGuide `dynamodbav:"travelGuide"`
}

// Request to Create a Travel Guide
type CreateTravelGuideRequest struct {
	TravelGuide TravelGuide `json:"travelGuide"`
	Secret      string      `json:"secret" validate:"required,min=8"`
}

// Request to update a Travel Guide
type UpdateTravelGuideRequest struct {
	TravelGuide TravelGuide `json:"travelGuide"`
}

// A Category is represented by a number (ID).
type Category int

const (
	TG_CATEGORY_MIX       Category = iota
	TG_CATEGORY_CULTURE   Category = iota
	TG_CATEGORY_ACTION    Category = iota
	TG_CATEGORY_RELAX     Category = iota
	TG_CATEGORY_ADVENTURE Category = iota
	TG_CATEGORY_SPORTS    Category = iota
	TG_CATEGORY_ROADTRIP  Category = iota
)

// Location represents a geographic location where an attraction is located.
type Location struct {
	Street  string `json:"street" dynamodbav:"street"`
	Zip     string `json:"zip" dynamodbav:"zip"`
	City    string `json:"city" dynamodbav:"city"`
	State   string `json:"state" dynamodbav:"state"`
	Country string `json:"country" dynamodbav:"country" validate:"required"`
}
