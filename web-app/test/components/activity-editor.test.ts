import { cleanup } from "@testing-library/react";
import React, { act } from "react"; // Import React explicitly
import ReactDOMClient from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { ActivityEditor } from "../../src/components/activity-editor"; // Ensure correct import

// biome-ignore lint/suspicious/noExplicitAny:
(globalThis as unknown as any).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(async () => {
    await act(async () => {
        cleanup();
    });
    document.body.innerHTML = "";
});

test("ActivityEditor renders correctly and handles create mode", async () => {
    const mockOnSuccess = vi.fn();

    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
        ReactDOMClient.createRoot(container).render(
            React.createElement(ActivityEditor, {
                type: "create",
                travelGuideId: "test-id",
                onSuccess: mockOnSuccess,
            }),
        );
    });

    // Check if the "Add Activity" button is rendered
    await act(async () => {
        const addButton = container.querySelector("button");
        expect(addButton).not.toBeNull();
        expect(addButton?.textContent).toContain("Add Activity");

        // Simulate opening the modal
        addButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // Check if the modal is rendered
    await act(async () => {
        const modalHeader = document.body.querySelector("#act-editor-title");
        expect(modalHeader).not.toBeNull();
        expect(modalHeader?.textContent).toContain("Create a new Activity");
    });
});

test("ActivityEditor renders correctly and handles update mode", async () => {
    const mockOnSuccess = vi.fn();
    const mockData = {
        id: "activity-id",
        name: "Test Activity",
        description: "Test Description",
        location: {
            street: "Test Street",
            zip: "12345",
            city: "Test City",
            state: "Test State",
            country: "Test Country",
        },
        category: 1,
        costsInCent: 1000,
        timeInMin: 60,
    };

    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
        ReactDOMClient.createRoot(container).render(
            React.createElement(ActivityEditor, {
                type: "update",
                travelGuideId: "test-id",
                data: mockData,
                onSuccess: mockOnSuccess,
            }),
        );
    });

    // Check if the "Add Activity" button is rendered
    await act(async () => {
        const addButton = container.querySelector("button");
        expect(addButton).not.toBeNull();
        // expect(addButton?.textContent).toContain('Add Activity');

        // Simulate opening the modal
        addButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // Check if the modal is rendered
    await act(async () => {
        const modalHeader = document.body.querySelector("#act-editor-title");
        expect(modalHeader).not.toBeNull();
        expect(modalHeader?.textContent).toContain("Update an Activity");
    });
});
