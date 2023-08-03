import { email, password } from "../../fixtures/testUser.json";
const apiUrl = Cypress.config("backendBaseUrl");

let quantity = 2;
describe("Adding an item to cart for a logged in user", () => {
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: apiUrl + "auth/login",

      body: { email, password },
    }).then(({ body, status }) => {
      expect(status).to.eq(200);
      Cypress.env("token", body.token);
    });
  });

  it("Should be able to add an item to cart", () => {
    let product_id;
    cy.request(apiUrl + "products").then(({ status, body }) => {
      expect(status).to.eq(200);
      const randomItem = body[Math.floor(Math.random() * body.length)];
      product_id = randomItem.product_id;

      cy.request({
        method: "POST",
        url: apiUrl + "cart/add",
        headers: { "Auth-Token": Cypress.env("token") },
        body: { product_id, quantity },
      }).then(({ body, status }) => {
        expect(status).to.eq(200);
        const addedItem = body.data.find(
          (item) => item.product_id === product_id
        );
        cy.log(addedItem);
        Cypress.env("itemQuantity", addedItem.quantity);
        Cypress.env("itemPrice", addedItem.price);
        Cypress.env("itemSubtotal", addedItem.subtotal);
      });
    });
  });

  it("Quantity should not be less then provided quantity", () => {
    const itemQuantity = Cypress.env("itemQuantity");
    expect(itemQuantity).to.not.be.lessThan(quantity);
  });

  it("Subtotal should be equal price * quantity", () => {
    const itemPrice = Cypress.env("itemPrice");
    expect(+Cypress.env("itemSubtotal")).to.eq(
      itemPrice * Cypress.env("itemQuantity")
    );
  });
});
