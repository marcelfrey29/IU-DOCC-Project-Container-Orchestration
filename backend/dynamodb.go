package main

import (
	"context"
	"os"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"go.uber.org/zap"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
)

var tableName = os.Getenv("DYNAMODB_TABLE_TRAVEL_GUIDES")
var useDynamoDbLocal, _ = strconv.ParseBool(os.Getenv("USE_DYNAMODB_LOCAL"))
var dynamoDbLocalUrl = os.Getenv("DYNAMODB_LOCAL_URL")

// Get the AWS Config to use, required to determine if DynamoDB Local should be used.
func getAwsConfig() aws.Config {
	cfg, _ := config.LoadDefaultConfig(context.TODO())
	if useDynamoDbLocal {
		logger.Info("DynamoDB Local should be used, setting local DynamoDB URL.", zap.Bool("useDynamoDBLocal", useDynamoDbLocal), zap.String("dynamoDBLocalUrl", dynamoDbLocalUrl))
		cfg.BaseEndpoint = &dynamoDbLocalUrl
	}
	return cfg
}

var ddbClient = dynamodb.NewFromConfig(getAwsConfig())

// Get all Travel Guides from the Database.
func GetTravelGuidesFromDDB() ([]TravelGuideItem, error) {
	logger.Info("Getting for all Travel Guides from DynamoDB.")

	var attributeValues map[string]types.AttributeValue = make(map[string]types.AttributeValue)
	attributeValues[":TG"] = &types.AttributeValueMemberS{
		Value: "TG",
	}

	response, err := ddbClient.Query(context.TODO(), &dynamodb.QueryInput{
		TableName:                 aws.String(tableName),
		KeyConditionExpression:    aws.String("hashId = :TG"),
		ExpressionAttributeValues: attributeValues,
	})
	if err != nil {
		logger.Error("Error while getting all Travel Guides from DynamoDB.", zap.String("error", err.Error()))
		return nil, err
	}

	var travelGuides []TravelGuideItem
	for _, travelGuide := range response.Items {
		tgi := new(TravelGuideItem)
		attributevalue.UnmarshalMap(travelGuide, tgi)
		travelGuides = append(travelGuides, *tgi)
	}

	return travelGuides, nil
}

// Get all Travel Guides from the Database.
func GetTravelGuideFromDDB(id string) (TravelGuideItem, error) {
	logger.Info("Get Travel Guide by ID from DynamoDB.", zap.String("id", id))

	var key map[string]types.AttributeValue = make(map[string]types.AttributeValue)
	key["hashId"] = &types.AttributeValueMemberS{
		Value: "TG",
	}
	key["rangeId"] = &types.AttributeValueMemberS{
		Value: id,
	}

	response, err := ddbClient.GetItem(context.TODO(), &dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key:       key,
	})
	if err != nil {
		logger.Error("Error while getting Travel Guides from DynamoDB.", zap.String("error", err.Error()))
		return TravelGuideItem{}, err
	}

	if response.Item == nil {
		logger.Warn("No Item in DynamoDB.", zap.String("id", id))
		return TravelGuideItem{}, &NotFoundError{message: "The item doesn't exist."}
	}

	tgi := new(TravelGuideItem)
	attributevalue.UnmarshalMap(response.Item, tgi)

	return *tgi, nil
}

// Create a new Travel Guide in the Database
func CreateTravelGuideInDDB(travelGuide *TravelGuideItem) (*TravelGuideItem, error) {
	logger.Info("Creating new Travel Guide in DynamoDB.", zap.String("hashId", travelGuide.HashId), zap.String("rangeId", travelGuide.RangeId))

	itemToStore, _ := attributevalue.MarshalMap(travelGuide)

	_, err := ddbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName:           aws.String(tableName),
		Item:                itemToStore,
		ConditionExpression: aws.String("attribute_not_exists(hashId) and attribute_not_exists(rangeId)"),
	})
	if err != nil {
		logger.Error("Error while creating Travel Guide in DyanmoDB.", zap.String("error", err.Error()))
		return nil, err
	}

	logger.Debug("Created Travel Guide in DyanmoDB.", zap.String("hashId", travelGuide.HashId), zap.String("rangeId", travelGuide.RangeId))
	return travelGuide, nil
}

// Update a Travel Guide in the Database
func UpdateTravelGuideInDDB(travelGuide *TravelGuideItem) (*TravelGuideItem, error) {
	logger.Info("Updating Travel Guide in DynamoDB.", zap.String("hashId", travelGuide.HashId), zap.String("rangeId", travelGuide.RangeId))

	itemToStore, _ := attributevalue.MarshalMap(travelGuide)

	_, err := ddbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName:           aws.String(tableName),
		Item:                itemToStore,
		ConditionExpression: aws.String("attribute_exists(hashId) AND attribute_exists(rangeId)"),
	})
	if err != nil {
		logger.Error("Error while updating Travel Guide in DyanmoDB.", zap.String("error", err.Error()))
		return nil, err
	}

	logger.Debug("Updated Travel Guide in DyanmoDB.", zap.String("hashId", travelGuide.HashId), zap.String("rangeId", travelGuide.RangeId))
	return travelGuide, nil
}

// Delete a Travel Guides from the Database.
func DeleteGuideFromDDB(id string) error {
	logger.Info("Delete Travel Guide by ID.", zap.String("id", id))

	var key map[string]types.AttributeValue = make(map[string]types.AttributeValue)
	key["hashId"] = &types.AttributeValueMemberS{
		Value: "TG",
	}
	key["rangeId"] = &types.AttributeValueMemberS{
		Value: id,
	}

	_, err := ddbClient.DeleteItem(context.TODO(), &dynamodb.DeleteItemInput{
		TableName: aws.String(tableName),
		Key:       key,
	})
	if err != nil {
		logger.Error("Error while deleting Travel Guide from DynamoDB.", zap.String("error", err.Error()))
		return err
	}

	return nil
}

// Create a new Activity in the Database.
func CreateActivityInDDB(activity *ActivityItem) (*ActivityItem, error) {
	logger.Info("Creating new Travel Guide in DynamoDB.", zap.String("hashId", activity.HashId), zap.String("rangeId", activity.RangeId))

	itemToStore, _ := attributevalue.MarshalMap(activity)

	_, err := ddbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName:           aws.String(tableName),
		Item:                itemToStore,
		ConditionExpression: aws.String("attribute_not_exists(hashId) and attribute_not_exists(rangeId)"),
	})
	if err != nil {
		logger.Error("Error while creating Activity in DyanmoDB.", zap.String("error", err.Error()))
		return nil, err
	}

	logger.Debug("Created Activity in DyanmoDB.", zap.String("hashId", activity.HashId), zap.String("rangeId", activity.RangeId))
	return activity, nil
}

// Update an Activity in the Database
func UpdateActivityInDDB(activity *ActivityItem) (*ActivityItem, error) {
	logger.Info("Updating Activity in DynamoDB.", zap.String("hashId", activity.HashId), zap.String("rangeId", activity.RangeId))

	itemToStore, _ := attributevalue.MarshalMap(activity)

	_, err := ddbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
		TableName:           aws.String(tableName),
		Item:                itemToStore,
		ConditionExpression: aws.String("attribute_exists(hashId) AND attribute_exists(rangeId)"),
	})
	if err != nil {
		logger.Error("Error while updating Activity in DyanmoDB.", zap.String("error", err.Error()))
		return nil, err
	}

	logger.Debug("Updated Activity in DyanmoDB.", zap.String("hashId", activity.HashId), zap.String("rangeId", activity.RangeId))
	return activity, nil
}

// Get all Travel Guides from the Database.
func GetActivitiesFromDDB(tgId string) ([]ActivityItem, error) {
	logger.Info("Getting for all Activities for Travel Guides from DynamoDB.", zap.String("id", tgId))

	var attributeValues map[string]types.AttributeValue = make(map[string]types.AttributeValue)
	attributeValues[":tgId"] = &types.AttributeValueMemberS{
		Value: tgId,
	}

	response, err := ddbClient.Query(context.TODO(), &dynamodb.QueryInput{
		TableName:                 aws.String(tableName),
		KeyConditionExpression:    aws.String("hashId = :tgId"),
		ExpressionAttributeValues: attributeValues,
	})
	if err != nil {
		logger.Error("Error while getting all Activities for Travel Guides from DynamoDB.", zap.String("error", err.Error()))
		return nil, err
	}

	var travelGuides []ActivityItem
	for _, travelGuide := range response.Items {
		tgi := new(ActivityItem)
		attributevalue.UnmarshalMap(travelGuide, tgi)
		travelGuides = append(travelGuides, *tgi)
	}

	return travelGuides, nil
}

// Delete an Activity from the Database.
func DeleteActivityFromDDB(tgId string, actId string) error {
	logger.Info("Delete Activity by ID.", zap.String("tgId", tgId), zap.String("actId", actId))

	var key map[string]types.AttributeValue = make(map[string]types.AttributeValue)
	key["hashId"] = &types.AttributeValueMemberS{
		Value: "ACT#" + tgId,
	}
	key["rangeId"] = &types.AttributeValueMemberS{
		Value: actId,
	}

	_, err := ddbClient.DeleteItem(context.TODO(), &dynamodb.DeleteItemInput{
		TableName: aws.String(tableName),
		Key:       key,
	})
	if err != nil {
		logger.Error("Error while deleting Activity from DynamoDB.", zap.String("error", err.Error()))
		return err
	}

	return nil
}
