import cart from '../fixtures/cart.json';
import profile from '../fixtures/profile.json';
import stripePayment from '../fixtures/stripePayment.json';

const apiUrl = Cypress.config('backendBaseUrl');
const [firstItem, secondItem] = cart.items.map((item) => item);
const totalQuantity = firstItem.quantity + secondItem.quantity;
const totalAmount = +firstItem.subtotal + +secondItem.subtotal;

const futureYear = new Date().getFullYear() + 1;
const creditCard = {
  cardNumber: '4111 1111 1111 1111',
  exp: '11' + futureYear.toString().slice(2),
  cvc: 333,
  zip: 45202,
};

describe('Checkout page with mocked data', () => {
  beforeEach(() => {
    cy.intercept(apiUrl + 'cart', cart).as('cart');
    cy.intercept(apiUrl + 'users/profile', profile);
    // we need to be logged in to call the cart endpoint
    cy.apiLogin();
    cy.visit('/cart/checkout');
    cy.findByText('Checkout').click();
    cy.findByText('Proceed').click();
  });

  it('Should render mocked items in cart', () => {
    cart.items.forEach((item) => {
      cy.findByText('Order Summary').parent().should('contain.text', item.name);
    });
  });

  it('Total quantity should match mocked quantities', () => {
    cy.findByText('Cart', { selector: 'span' })
      .parent()
      .should('contain.text', totalQuantity);
  });

  it('Total amount should match mocked data', () => {
    cy.contains('p', 'Total: ')
      .invoke('text')
      .then((text) => {
        expect(text.replaceAll(',', '')).to.contain(totalAmount);
      });
  });

  it('Pay button should contain total amount', () => {
    cy.contains('button', 'Pay')
      .invoke('text')
      .then((text) => {
        expect(text.replaceAll(',', '')).to.contain(totalAmount);
      });
  });

  describe("Purchasing with valid credit card", () => {
    it('Should be able to pay succesfully with valid credit card', () => {
        cy.intercept('POST', apiUrl + '/orders/create', stripePayment).as('create');
        cy.fillElementsInput('cardNumber', creditCard.cardNumber);
        cy.fillElementsInput('cardExpiry', creditCard.exp);
        cy.fillElementsInput('cardCvc', creditCard.cvc);
        cy.fillElementsInput('postalCode', creditCard.zip);
        cy.contains('button', 'Pay').click();
        cy.findByRole('heading', { level: 1, name: 'Order Confirmed' })
          .next('p')
          .should(
            'contain.text',
            `Thank you for your purchase, ${profile.fullname}!`
          );
      });
  })

  describe("Purchasing with invalid credit card", () => {

    it("Should show incomplete card number message", () => {
        cy.fillElementsInput('cardNumber', 1);
        cy.contains('button', 'Pay').click();
        cy.get("form").should("contain.text", "Your card number is incomplete.")
    })

    it("Should show incomplete expiration date message", () => {
        cy.fillElementsInput('cardNumber', creditCard.cardNumber);
        cy.fillElementsInput('cardExpiry', 1);
        cy.contains('button', 'Pay').click();
        cy.get("form").should("contain.text", "Your card's expiration date is incomplete.")
    })
  
    it("Should show incomplete security code message", () => {
        cy.fillElementsInput('cardNumber', creditCard.cardNumber);
        cy.fillElementsInput('cardExpiry', creditCard.exp);
        cy.fillElementsInput('cardCvc', 1);
        cy.contains('button', 'Pay').click();
        cy.get("form").should("contain.text", "Your card's security code is incomplete.")
    })

    it("Should show incomplete postal code message", () => {
        cy.fillElementsInput('cardNumber', creditCard.cardNumber);
        cy.fillElementsInput('cardExpiry', creditCard.exp);
        cy.fillElementsInput('cardCvc', creditCard.cvc);
        cy.fillElementsInput('postalCode', 2);
        cy.contains('button', 'Pay').click();
        cy.get("form").should("contain.text", "Your postal code is incomplete.")
    })
  })
});
