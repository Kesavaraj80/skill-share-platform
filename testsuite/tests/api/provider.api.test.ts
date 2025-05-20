import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";

const API_BASE_URL = "http://localhost:8000/api/v1";

describe("Provider API", () => {
  describe("POST /api/v1/providers", () => {
    it("should create a new individual provider successfully", async () => {
      const providerData = {
        email: "test@example.com",
        password: "Test@123456",
        firstName: "John",
        lastName: "Doe",
        mobileNumber: "1234567890",
        streetNumber: "123",
        streetName: "Test Street",
        city: "Test City",
        state: "Test State",
        postCode: "12345",
        role: "PROVIDER",
        providerType: "INDIVIDUAL",
      };

      const response = await request(API_BASE_URL)
        .post("/providers")
        .send(providerData)
        .expect(201);

      expect(response.body).to.have.property("id");
      expect(response.body.email).to.equal(providerData.email);
      expect(response.body.firstName).to.equal(providerData.firstName);
      expect(response.body.lastName).to.equal(providerData.lastName);
      expect(response.body.fullName).to.equal(
        `${providerData.firstName} ${providerData.lastName}`
      );
      expect(response.body.providerType).to.equal(providerData.providerType);
      expect(response.body.role).to.equal(providerData.role);
    });

    it("should create a new company provider successfully", async () => {
      const providerData = {
        email: "company@example.com",
        password: "Test@123456",
        firstName: "Jane",
        lastName: "Smith",
        mobileNumber: "9876543210",
        streetNumber: "456",
        streetName: "Business Ave",
        city: "Business City",
        state: "Business State",
        postCode: "54321",
        role: "PROVIDER",
        providerType: "COMPANY",
        companyName: "Test Company",
        businessTaxNumber: "TAX123456",
      };

      const response = await request(API_BASE_URL)
        .post("/providers")
        .send(providerData)
        .expect(201);

      expect(response.body).to.have.property("id");
      expect(response.body.email).to.equal(providerData.email);
      expect(response.body.companyName).to.equal(providerData.companyName);
      expect(response.body.businessTaxNumber).to.equal(
        providerData.businessTaxNumber
      );
      expect(response.body.providerType).to.equal(providerData.providerType);
    });

    it("should return 400 for invalid email format", async () => {
      const invalidProviderData = {
        email: "invalid-email",
        password: "Test@123456",
        firstName: "John",
        lastName: "Doe",
        mobileNumber: "1234567890",
        streetNumber: "123",
        streetName: "Test Street",
        city: "Test City",
        state: "Test State",
        postCode: "12345",
        role: "PROVIDER",
        providerType: "INDIVIDUAL",
      };

      const response = await request(API_BASE_URL)
        .post("/providers")
        .send(invalidProviderData)
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.message).to.include("Invalid email address");
    });

    it("should return 400 for invalid password format", async () => {
      const invalidProviderData = {
        email: "test@example.com",
        password: "weak",
        firstName: "John",
        lastName: "Doe",
        mobileNumber: "1234567890",
        streetNumber: "123",
        streetName: "Test Street",
        city: "Test City",
        state: "Test State",
        postCode: "12345",
        role: "PROVIDER",
        providerType: "INDIVIDUAL",
      };

      const response = await request(API_BASE_URL)
        .post("/providers")
        .send(invalidProviderData)
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.message).to.include(
        "Password must be at least 8 characters"
      );
    });

    it("should return 400 for missing required fields", async () => {
      const invalidProviderData = {
        email: "test@example.com",
        password: "Test@123456",
        // Missing firstName and lastName
        mobileNumber: "1234567890",
        streetNumber: "123",
        streetName: "Test Street",
        city: "Test City",
        state: "Test State",
        postCode: "12345",
        role: "PROVIDER",
        providerType: "INDIVIDUAL",
      };

      const response = await request(API_BASE_URL)
        .post("/providers")
        .send(invalidProviderData)
        .expect(400);

      expect(response.body).to.have.property("error");
    });

    it("should return 409 for duplicate email", async () => {
      const providerData = {
        email: "duplicate@example.com",
        password: "Test@123456",
        firstName: "John",
        lastName: "Doe",
        mobileNumber: "1234567890",
        streetNumber: "123",
        streetName: "Test Street",
        city: "Test City",
        state: "Test State",
        postCode: "12345",
        role: "PROVIDER",
        providerType: "INDIVIDUAL",
      };

      // Create first provider
      await request(API_BASE_URL)
        .post("/providers")
        .send(providerData)
        .expect(201);

      // Try to create second provider with same email
      const response = await request(API_BASE_URL)
        .post("/providers")
        .send(providerData)
        .expect(409);

      expect(response.body).to.have.property("error");
    });
  });
});
