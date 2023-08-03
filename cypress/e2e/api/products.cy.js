import productSchema from "../../fixtures/schema/product.json";
const apiUrl = Cypress.config("backendBaseUrl");

describe("/products and /product endpoints", () => {
  describe("Products", () => {
    it("Should return list of items", () => {
      cy.request(apiUrl + "products").then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.be.an("array");
        expect(body.length).to.be.greaterThan(0);

        const randomItem = body[Math.floor(Math.random() * body.length)];
        Cypress.env("product_id", randomItem.product_id);
      });
    });
  });

  describe("Single product", () => {
    beforeEach(() => {
      cy.request(apiUrl + "products/" + Cypress.env("product_id")).as(
        "product"
      );
    });
    it("Should match JSON schema", () => {
      cy.get("@product").then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.be.jsonSchema(productSchema);
      });
    });
  });
});
