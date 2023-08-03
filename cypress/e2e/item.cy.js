import item from "../fixtures/item.json";

const apiUrl = Cypress.config("backendBaseUrl");
const { product_id, name, price, description, image_url } = item[0];

describe("Item page", () => {
  describe("Item page with a valid item", () => {
    beforeEach(() => {
      cy.intercept(apiUrl + "products/" + product_id, item[0]).as("product");
      cy.visit("/products/" + product_id);
    });

    it("Should render product card", () => {
      cy.findByAltText(name)
        .should("have.attr", "src")
        .and("include", image_url);
      cy.findByRole("heading", { name })
        .parent()
        .find("p")
        .should("contain.text", description);
    });

    it("All stars should be with gray color", () => {
      cy.get("[data-forhalf='★']")
        .should("have.length", 5)
        .each((star) => {
          cy.wrap(star)
            .invoke("attr", "style")
            .should("include", "color: gray;");
        });
    });

    it("Should contain 'No ratings available' text", () => {
      cy.findByRole("heading", { name })
        .parent()
        .should("contain.text", "No ratings available");
    });

    it("Should render mocked price", () => {
      cy.findByRole("heading", { name }).parent().should("contain.text", price);
    });

    it('Button "Add to cart" should be enabled', () => {
      cy.findByRole("button", { name: "Add to cart" }).should("be.enabled");
    });

    it("Should be able to add an item to cart", () => {
      cy.findByRole("button", { name: "Add to cart" }).click();
      cy.findByText("Cart", { selector: "span" })
        .parent()
        .should("contain.text", 1);
    });
  });

  describe("Item page with mocked average rating", () => {
    beforeEach(() => {
      item[0].avg_rating = 5;
      cy.intercept(apiUrl + "products/" + product_id, item[0]).as("product");
      cy.visit("/products/" + product_id);
    });

    it("Should contain 5 gold stars", () => {
      cy.get("[data-forhalf='★']")
        .should("have.length", 5)
        .each((star) => {
          cy.wrap(star)
            .invoke("attr", "style")
            .should("include", "color: rgb(255, 215, 0);");
        });
    });

    // This is Frontend bug
    it('Should not contain "No ratings available" text', () => {
      cy.findByRole("heading", { name })
        .parent()
        .should("not.contain.text", "No ratings available");
    });
  });
});
