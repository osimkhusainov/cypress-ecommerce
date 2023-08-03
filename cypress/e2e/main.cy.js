import item from "../fixtures/item.json";
const apiUrl = Cypress.config("backendBaseUrl");

describe("Main page", () => {
  describe("Main page with a valid item", () => {
    beforeEach(() => {
      cy.intercept(apiUrl + "products/?page=1", item).as("products");
      cy.intercept(apiUrl + "products/?page=2", item).as("products2");
      cy.visit("/");
    });

    it("Should render mocked items", () => {
      cy.findByRole("heading", { level: 2 }).should("have.length", item.length);
      cy.findByRole("button", { name: 2 }).should("be.enabled").click();
      cy.findByRole("heading", { level: 2 }).should("have.length", item.length);
    });

    // This is Frontend bug
    it("Item counts should match mocks", () => {
      cy.get("span:contains('Showing')")
        .invoke("text")
        .should("eq", "Showing 1 of " + item.length);
    });

    it("Should be able to add an item to cart", () => {
      cy.findByRole("button", { name: "Add to cart" }).click();
      cy.findByText("Cart", { selector: "span" })
        .parent()
        .should("contain.text", 1);
    });
  });

  describe("Main page with an invalid item", () => {
    before(() => {
      item[0].product_id = 123456;
      cy.intercept(apiUrl + "products/?page=1", item).as("products");
      cy.visit("/");
    });

    // This is Frontend bug, with mock data backend is returning 404 status, but frontend is showing an infinite loader
    it("Should see the 404 error page if an item is not found", () => {
      cy.findByText(item[0].name).click();
      cy.get("#root").should("contain.text", 404);
    });
  });
});
