import cart from "../fixtures/cart.json";

const apiUrl = Cypress.config("backendBaseUrl");

const [firstItem, secondItem] = cart.items.map((item) => item);
const totalQuantity = firstItem.quantity + secondItem.quantity;
const totalAmount = +firstItem.subtotal + +secondItem.subtotal;

describe("Empty cart page", () => {
  beforeEach(() => {
    cy.visit("/cart");
  });
  it("Should render an empty cart", () => {
    cy.findByRole("heading", { level: 1, name: "Shopping Cart" })
      .parent()
      .find("p")
      .should("have.text", "Cart is empty");
  });

  it('Should has button "Continue shopping"', () => {
    cy.findByText("Continue shopping", { selector: "a" })
      .should("be.visible")
      .invoke("attr", "href")
      .should("eq", "/");
  });
});

describe("Cart page with mocked data", () => {
  beforeEach(() => {
    cy.intercept(apiUrl + "cart", cart).as("cart");
    // we need to be logged in to call the cart endpoint
    cy.apiLogin();
    cy.visit("/cart");
  });
  it("Table should contain 4 td", () => {
    const tdArray = ["PRODUCT", "AMOUNT", "QUANTITY", "TOTAL", "REMOVE"];
    cy.get("thead td").each((td) => {
      cy.wrap(td)
        .invoke("text")
        .then((text) => expect(tdArray).to.include(text.toUpperCase()));
    });
  });

  it("Should render mocked items", () => {
    cy.get("tbody tr").should("have.length", cart.items.length);
  });

  it("Total quantity should match mocked quantities", () => {
    cy.findByText("Cart", { selector: "span" })
      .parent()
      .should("contain.text", totalQuantity);
  });

  it("Should render correct total with quantity > 1", () => {
    cy.findByText(secondItem.name)
      .parent()
      .find("td")
      .then((td) => {
        cy.wrap(td).eq(2).should("contain.text", secondItem.quantity);
        cy.wrap(td)
          .eq(3)
          .invoke("text")
          .then((text) => {
            cy.log(text);
            expect(text.replace(",", "")).to.contain(secondItem.subtotal);
          });
      });
  });

  it("Should render correct calculated total amount", () => {
    cy.contains("div", "Total: ")
      .invoke("text")
      .then((text) => {
        expect(text.replaceAll(",", "")).to.contain(totalAmount);
      });
  });

  it("Decrement button should be disabled if quantity is 1", () => {
    cy.findByText(firstItem.name)
      .parent()
      .find("td")
      .then((td) => {
        cy.wrap(td).eq(2).should("contain.text", firstItem.quantity);
        cy.wrap(td).eq(2).find("button").first().should("be.disabled");
      });
  });
});

describe("Edit cart with mocked data", () => {
  beforeEach(() => {
    cy.intercept(apiUrl + "cart", cart).as("cart");
    firstItem.quantity += 1;
    firstItem.subtotal = firstItem.price * firstItem.quantity;
    cy.intercept("PUT", apiUrl + "cart/increment", cart.items);
    // we need to be logged in to call the cart endpoint
    cy.apiLogin();
    cy.visit("/cart");
  });

  it("Should render correct item amount and total amount if increase first item's quantity", () => {
    cy.findByText(firstItem.name)
      .parent()
      .find("td")
      .then((td) => {
        cy.wrap(td).eq(2).find("button").eq(1).should("be.enabled").click();
        cy.findByText("Cart", { selector: "span" })
          .parent()
          .should("contain.text", totalQuantity + 1);
      });
  });
});

describe("Delete cart with mocked data", () => {
  beforeEach(() => {
    cy.intercept(apiUrl + "cart", cart).as("cart");
    // we need to be logged in to call the cart endpoint
    cy.apiLogin();
    cy.visit("/cart");
  });

  it("Should delete first item and quantity and total amount", () => {
    cy.findByText(firstItem.name)
      .parent()
      .find("td")
      .then((td) => {
        cy.wrap(td).eq(4).find("button").should("contain.text", "X").click();
        cy.findByText("Cart", { selector: "span" })
          .parent()
          .should("contain.text", totalQuantity - 1);

        cy.contains("div", "Total: ")
          .invoke("text")
          .then((text) => {
            expect(text.replaceAll(",", "")).to.contain(secondItem.subtotal);
          });
      });
  });
});
