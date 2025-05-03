package main

// An Activity represnts an attracktion at a specific location and includes additional details.
type Activity struct {
	Id          string   `json:"id" dynamodbav:"id"`
	Name        string   `json:"name" dynamodbav:"name" validate:"required"`
	Description string   `json:"description" dynamodbav:"description"`
	Location    Location `json:"location" dynamodbav:"location"`
	Category    Category `json:"category" dynamodbav:"category"`
	TimeInMin   uint     `json:"timeInMin" dynamodbav:"time"`
	CostsInCent uint     `json:"costsInCent" dynamodbav:"costs"`
}

// DynamoDB Item Representation of an Activity.
type ActivityItem struct {
	HashId   string   `dynamodbav:"hashId"`
	RangeId  string   `dynamodbav:"rangeId"`
	Activity Activity `dynamodbav:"activity"`
}

// Request body to create an activity.
type CreateActivityRequest struct {
	Activity Activity `json:"activity"`
}
