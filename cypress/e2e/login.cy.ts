describe("template spec", () => {
  it("should login successfully", () => {
    cy.login("matovu@dabblelab.com", "password90");
    // expect to be redirected to the dashboard
    cy.contains(/dashboard/i, { timeout: 60000 }).should("be.visible");
  });
});
