package main

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/contrib/fiberzap/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/healthcheck"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

var logger, _ = zap.NewProduction()
var validate *validator.Validate

//var logger *zap.Logger

func main() {
	validate = validator.New(validator.WithRequiredStructEnabled())
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	SetupDynamoDB()

	app := fiber.New()
	app.Use(requestid.New())
	app.Use(fiberzap.New(fiberzap.Config{
		Logger: logger,
	}))
	app.Use(cors.New())
	app.Use(healthcheck.New())
	app.Use(helmet.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	// Get Travel Guides
	app.Get("/travel-guides", func(c *fiber.Ctx) error {
		tgs, err := getTravelGuides()
		if err != nil {
			logger.Error("Error while getting Travel Guides.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting Travel Guides."})
		}
		logger.Info("Got all Travel Guides.", zap.Int("count", len(tgs)))
		return c.Status(200).JSON(tgs)
	})

	// Get a Travel Guide
	app.Get("/travel-guides/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		auth := c.Get("x-tg-secret")

		travelGuide, err := getTravelGuide(id, auth)
		var unauthorizedError *UnauthorizedError
		var notFoundError *NotFoundError
		if errors.As(err, &unauthorizedError) {
			logger.Warn("The Secret is not valid.", zap.String("id", id), zap.String("error", err.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		} else if errors.As(err, &notFoundError) {
			logger.Warn("Travel Guide with the given ID doesn't exist.", zap.String("id", id))
			return c.Status(404).JSON(map[string]string{"message": "Travel Guide doesn't exist."})
		} else if err != nil {
			logger.Error("Error while getting a Travel Guide by ID.", zap.String("id", id), zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting the Travel Guide."})
		}
		logger.Info("Got Travel Guide by ID.", zap.Any("travelGuide", travelGuide))
		return c.Status(200).JSON(travelGuide)
	})

	// Update a Travel Guide
	app.Put("/travel-guides/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		auth := c.Get("x-tg-secret")
		data := new(UpdateTravelGuideRequest)
		err := c.BodyParser(data)
		if err != nil {
			logger.Error("Error while parsing body.", zap.String("error", err.Error()))
		}

		if validationErr := validate.Struct(data); validationErr != nil {
			logger.Warn("Invalid Request Data.", zap.String("error", validationErr.Error()))
			return c.Status(400).JSON(map[string]string{"message": "Invalid Request Data."})
		}

		travelGuide, err := updateTravelGuide(id, auth, data)
		var unauthorizedError *UnauthorizedError
		var notFoundError *NotFoundError
		if errors.As(err, &unauthorizedError) {
			logger.Warn("The Secret is not valid.", zap.String("id", id), zap.String("error", err.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		} else if errors.As(err, &notFoundError) {
			logger.Warn("Travel Guide with the given ID doesn't exist.", zap.String("id", id))
			return c.Status(404).JSON(map[string]string{"message": "Travel Guide doesn't exist."})
		} else if err != nil {
			logger.Error("Error while updating a Travel Guide.", zap.String("id", id), zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting the Travel Guide."})
		}
		logger.Info("Updated Travel Guide.", zap.Any("travelGuide", travelGuide))
		return c.Status(200).JSON(travelGuide)
	})

	// Create a new Travel Guide
	app.Post("/travel-guides", func(c *fiber.Ctx) error {
		data := new(CreateTravelGuideRequest)
		err := c.BodyParser(data)
		if err != nil {
			logger.Error("Error while parsing body.", zap.String("error", err.Error()))
		}

		if validationErr := validate.Struct(data); validationErr != nil {
			logger.Warn("Invalid Request Data.", zap.String("error", validationErr.Error()))
			return c.Status(400).JSON(map[string]string{"message": "Invalid Request Data."})
		}

		travelGuide, _, err := createTravelGuide(data)
		if err != nil {
			logger.Error("Error while creating Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while creating Travel Guide."})
		}
		logger.Info("Created Travel Guide.", zap.Any("travelGuide", travelGuide))
		return c.Status(201).JSON(travelGuide)
	})

	// Delete a Travel Guide
	app.Delete("/travel-guides/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		auth := c.Get("x-tg-secret")

		// Get the Travel Guide and check the secret value
		err := deleteTravelGuide(id, auth)
		var unauthorizedError *UnauthorizedError
		var notFoundError *NotFoundError
		if errors.As(err, &unauthorizedError) {
			logger.Warn("The Secret is not valid.", zap.String("error", err.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		} else if errors.As(err, &notFoundError) {
			// If the Travel Guide doesn't exist in the Database, it is already deleted => Return success because
			// we're in the expected state.
			logger.Info("The Travel Guide with the given ID doesn't exist: Already in expected state (Deleted).", zap.String("id", id))
			return c.Status(200).JSON(map[string]string{"message": "Success."})
		} else if err != nil {
			logger.Error("Error while deleting Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while deleting the Travel Guide."})
		}

		logger.Info("Deleted Travel Guide.", zap.String("id", id))
		return c.Status(200).JSON(map[string]string{"message": "Success."})
	})

	// Create an Activity in a Travel Guide.
	app.Get("travel-guides/:id/activities", func(c *fiber.Ctx) error {
		tgId := c.Params("id")
		auth := c.Get("x-tg-secret")

		// Check Access
		accessErr := checkTravelGuideAccess(tgId, auth, true)
		if accessErr != nil {
			logger.Warn("The Secret is not valid.", zap.String("id", tgId), zap.String("error", accessErr.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		}

		// Get all Activities
		activities, err := getActivities(tgId)
		if err != nil {
			logger.Error("Error while getting Activities for Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting all Activities for the Travel Guide."})
		}
		logger.Info("Got all Activities of Travel Guide.")
		return c.Status(200).JSON(activities)
	})

	// Create an Activity in a Travel Guide.
	app.Post("travel-guides/:id/activities", func(c *fiber.Ctx) error {
		tgId := c.Params("id")
		auth := c.Get("x-tg-secret")

		// Check Access
		accessErr := checkTravelGuideAccess(tgId, auth, false)
		if accessErr != nil {
			logger.Warn("The Secret is not valid.", zap.String("id", tgId), zap.String("error", accessErr.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		}

		// Validate data
		data := new(CreateActivityRequest)
		err := c.BodyParser(data)
		if err != nil {
			logger.Error("Error while parsing body.", zap.String("error", err.Error()))
		}
		if validationErr := validate.Struct(data); validationErr != nil {
			logger.Warn("Invalid Request Data.", zap.String("error", validationErr.Error()))
			return c.Status(400).JSON(map[string]string{"message": "Invalid Request Data."})
		}

		// Create Activity
		_, err = createActivity(tgId, data.Activity)
		if err != nil {
			logger.Error("Error while creating Activity for Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while creating Activity."})
		}
		logger.Info("Created Activity.")

		activities, err := getActivities(tgId)
		if err != nil {
			logger.Error("Error while getting Activities for Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting all Activities for the Travel Guide."})
		}
		logger.Info("Got all Activities of Travel Guide.")
		return c.Status(201).JSON(activities)
	})

	// Update an Activity in a Travel Guide.
	app.Put("travel-guides/:tgId/activities/:actId", func(c *fiber.Ctx) error {
		tgId := c.Params("tgid")
		actId := c.Params("actId")
		auth := c.Get("x-tg-secret")

		// Check Access
		accessErr := checkTravelGuideAccess(tgId, auth, false)
		if accessErr != nil {
			logger.Warn("The Secret is not valid.", zap.String("id", tgId), zap.String("error", accessErr.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		}

		// Validate data
		data := new(CreateActivityRequest)
		err := c.BodyParser(data)
		if err != nil {
			logger.Error("Error while parsing body.", zap.String("error", err.Error()))
		}
		if validationErr := validate.Struct(data); validationErr != nil {
			logger.Warn("Invalid Request Data.", zap.String("error", validationErr.Error()))
			return c.Status(400).JSON(map[string]string{"message": "Invalid Request Data."})
		}

		// Update Activity
		_, err = updateActivity(tgId, actId, &data.Activity)
		if err != nil {
			logger.Error("Error while updating Activity.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while updating Activity."})
		}
		logger.Info("Updated Activity.")

		activities, err := getActivities(tgId)
		if err != nil {
			logger.Error("Error while getting Activities for Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting all Activities for the Travel Guide."})
		}
		logger.Info("Got all Activities of Travel Guide.")
		return c.Status(200).JSON(activities)
	})

	// Delete an Activity from a Travel Guide.
	app.Delete("travel-guides/:tgId/activities/:actId", func(c *fiber.Ctx) error {
		tgId := c.Params("tgId")
		actId := c.Params("actId")
		auth := c.Get("x-tg-secret")

		// Check Access
		accessErr := checkTravelGuideAccess(tgId, auth, false)
		if accessErr != nil {
			logger.Warn("The Secret is not valid.", zap.String("id", tgId), zap.String("error", accessErr.Error()))
			return c.Status(401).JSON(map[string]string{"message": "The Secret is not valid."})
		}

		// Delete Activity
		err := deleteActivity(tgId, actId)
		if err != nil {
			logger.Error("Error while deleting Activity.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while deleting Activity."})
		}
		logger.Info("Deleted Activity.")

		// Get List of Activities
		activities, err := getActivities(tgId)
		if err != nil {
			logger.Error("Error while getting Activities for Travel Guide.", zap.String("error", err.Error()))
			return c.Status(500).JSON(map[string]string{"message": "Error while getting all Activities for the Travel Guide."})
		}
		logger.Info("Got all Activities of Travel Guide.")
		return c.Status(200).JSON(activities)
	})

	app.Get("/:name", func(c *fiber.Ctx) error {
		return c.SendString("Hello " + c.Params("name"))
	})

	app.Listen(":3000")
}

// Get all Travel Guides.
//
// For private Travel Guides, all information (except the name) are removed.
func getTravelGuides() ([]TravelGuide, error) {
	logger.Info("Get all Travel Guides.")
	items, err := GetTravelGuidesFromDDB()

	if err != nil {
		logger.Error("Error while getting Travel Guides.", zap.String("error", err.Error()))
		return nil, err
	}

	// Travel Guide Items must be transformed to Travel Guides.
	// In addition, information in private Travel Guides must be removed.
	var travelGuides []TravelGuide = []TravelGuide{}
	for _, item := range items {
		if item.TravelGuide.Private {
			logger.Debug("Travel Guide is Private, hiding all private information.", zap.String("hashId", item.HashId), zap.String("rangeId", item.RangeId))
			privateTravelGuide := new(TravelGuide)
			privateTravelGuide.Private = true
			privateTravelGuide.Name = item.TravelGuide.Name
			privateTravelGuide.Id = item.TravelGuide.Id
			travelGuides = append(travelGuides, *privateTravelGuide)
		} else {
			logger.Debug("Travel Guide is Public, returning.", zap.String("hashId", item.HashId), zap.String("rangeId", item.RangeId))
			travelGuides = append(travelGuides, item.TravelGuide)
		}
	}
	logger.Info("Got all Travel Guides.", zap.Int("count", len(travelGuides)))

	return travelGuides, nil
}

// Get a single Travel Guide by ID.
func getTravelGuide(id string, secret string) (TravelGuide, error) {
	item, err := GetTravelGuideFromDDB(id)
	if err != nil {
		logger.Error("Error while getting Travel Guide.", zap.String("error", err.Error()))
		return TravelGuide{}, err
	}

	travelGuide := item.TravelGuide
	if travelGuide.Private {
		logger.Debug("Travel Guide is Private, checking Secret.", zap.String("id", id))

		err := bcrypt.CompareHashAndPassword([]byte(item.Secret), []byte(secret))
		if err != nil {
			logger.Warn("The provided secret doesn't match the Travel Guide Secret: Unauthorized.", zap.String("id", id))
			return travelGuide, &UnauthorizedError{message: "The secret is not valid."}
		}
	}

	return item.TravelGuide, nil
}

// Create a new Travel Guide.
func createTravelGuide(travelGuide *CreateTravelGuideRequest) (TravelGuide, string, error) {
	id := "TG_" + uuid.NewString()
	secret := getBcrypSecretFromPlaintext(travelGuide.Secret)
	travelGuide.TravelGuide.Id = id
	tgi := TravelGuideItem{
		HashId:      "TG",
		RangeId:     id,
		Secret:      secret,
		TravelGuide: travelGuide.TravelGuide,
	}
	logger.Debug("Creating a new Travel Guide.", zap.Any("travelGuide", tgi.TravelGuide))

	item, err := CreateTravelGuideInDDB(&tgi)
	if err != nil {
		logger.Error("Error while creating Travel Guide.", zap.String("error", err.Error()))
		return TravelGuide{}, "", err
	}

	tg := item.TravelGuide
	logger.Debug("Created Travel Guide.", zap.Any("travelGuide", tg))
	return tg, item.Secret, nil
}

// Update a Travel Guide.
func updateTravelGuide(id string, secret string, travelGuide *UpdateTravelGuideRequest) (TravelGuide, error) {
	// Get Travel Guide
	item, err := GetTravelGuideFromDDB(id)
	if err != nil {
		logger.Error("Error while getting Travel Guide.", zap.String("error", err.Error()))
		return TravelGuide{}, err
	}
	logger.Debug("Got Travel Guide from DynamoDB, performing additional checks.", zap.String("hashId", item.HashId), zap.String("rangeId", item.RangeId))

	// Check Secret
	err = bcrypt.CompareHashAndPassword([]byte(item.Secret), []byte(secret))
	if err != nil {
		logger.Warn("The provided secret doesn't match the Travel Guide Secret: Unauthorized.", zap.String("id", id))
		return TravelGuide{}, &UnauthorizedError{message: "The secret is not valid."}
	}
	logger.Debug("Secret matches Travel Guide Secret.", zap.String("id", id))

	// Update
	item.TravelGuide = travelGuide.TravelGuide
	item.TravelGuide.Id = id
	updatedItem, err := UpdateTravelGuideInDDB(&item)
	if err != nil {
		logger.Error("Error while deleting Travel Guide.", zap.String("error", err.Error()))
		return TravelGuide{}, err
	}

	return updatedItem.TravelGuide, nil
}

// Delete a Travel Guide by ID.
func deleteTravelGuide(id string, secret string) error {
	// Get Travel Guide
	item, err := GetTravelGuideFromDDB(id)
	if err != nil {
		logger.Error("Error while getting Travel Guide.", zap.String("error", err.Error()))
		return err
	}
	logger.Debug("Got Travel Guide from DynamoDB, performing additional checks.", zap.String("hashId", item.HashId), zap.String("rangeId", item.RangeId))

	// Check Secret
	err = bcrypt.CompareHashAndPassword([]byte(item.Secret), []byte(secret))
	if err != nil {
		logger.Warn("The provided secret doesn't match the Travel Guide Secret: Unauthorized.")
		return &UnauthorizedError{message: "The secret is not valid."}
	}
	logger.Debug("Secret matches Travel Guide Secret.", zap.String("id", id))

	// Delete
	err = DeleteGuideFromDDB(id)
	if err != nil {
		logger.Error("Error while deleting Travel Guide.", zap.String("error", err.Error()))
		return err
	}

	return nil
}

func getBcrypSecretFromPlaintext(secret string) string {
	encryptedSecret, _ := bcrypt.GenerateFromPassword([]byte(secret), bcrypt.DefaultCost)
	return string(encryptedSecret)
}

// Check if a user has access to a Travel Guide.
// Access is allowed if this function returns `nil`.
func checkTravelGuideAccess(travelGuideId string, secret string, readOnly bool) error {
	// Get Travel Guide
	item, err := GetTravelGuideFromDDB(travelGuideId)
	if err != nil {
		logger.Error("Error while getting Travel Guide.", zap.String("error", err.Error()))
		return err
	}
	if readOnly && item.TravelGuide.Private == false {
		logger.Info("Skipping secret check for read-only access to public travel guide.", zap.Bool("readOnly", readOnly), zap.Bool("isPrivate", item.TravelGuide.Private))
		return nil
	}
	logger.Debug("Got Travel Guide from DynamoDB, performing secret check.", zap.String("hashId", item.HashId), zap.String("rangeId", item.RangeId))

	// Check Secret
	err = bcrypt.CompareHashAndPassword([]byte(item.Secret), []byte(secret))
	if err != nil {
		logger.Warn("The provided secret doesn't match the Travel Guide Secret: Unauthorized.", zap.String("id", travelGuideId))
		return &UnauthorizedError{message: "The secret is not valid."}
	}

	logger.Debug("Secret matches Travel Guide Secret.", zap.String("id", travelGuideId))
	return nil
}

// Create a new Activity.
func createActivity(tgId string, activity Activity) (Activity, error) {
	hashId := "ACT#" + tgId
	rangeId := "ACT_" + uuid.NewString()

	activity.Id = rangeId
	tgi := ActivityItem{
		HashId:   hashId,
		RangeId:  rangeId,
		Activity: activity,
	}
	logger.Debug("Creating a new Travel Guide.", zap.Any("activity", tgi.Activity))

	item, err := CreateActivityInDDB(&tgi)
	if err != nil {
		logger.Error("Error while creating Travel Guide.", zap.String("error", err.Error()))
		return Activity{}, err
	}

	act := item.Activity
	logger.Debug("Created Activity.", zap.Any("activity", act))
	return act, nil
}

// Update an Activity.
func updateActivity(id string, actId string, activity *Activity) (Activity, error) {
	// Re-set Id and create Item
	activity.Id = actId
	item := ActivityItem{
		HashId:   "ACT#" + id,
		RangeId:  actId,
		Activity: *activity,
	}
	updatedItem, err := UpdateActivityInDDB(&item)
	if err != nil {
		logger.Error("Error while updating Activity.", zap.String("error", err.Error()))
		return Activity{}, err
	}

	return updatedItem.Activity, nil
}

// Delete an Activity.
func deleteActivity(tgId string, actId string) error {
	err := DeleteActivityFromDDB(tgId, actId)
	if err != nil {
		logger.Error("Error while deleting Activity.", zap.String("error", err.Error()))
		return err
	}
	return nil
}

// Get all Activites.
func getActivities(tgId string) ([]Activity, error) {
	logger.Info("Get all Activities for Travel Guide.", zap.String("id", tgId))
	items, err := GetActivitiesFromDDB("ACT#" + tgId)

	if err != nil {
		logger.Error("Error while getting Activities for Travel Guide.", zap.String("error", err.Error()))
		return nil, err
	}

	var travelGuides []Activity = []Activity{}
	for _, item := range items {
		travelGuides = append(travelGuides, item.Activity)
	}
	logger.Info("Got all Activities for Travel Guides.", zap.Int("count", len(travelGuides)))

	return travelGuides, nil
}
