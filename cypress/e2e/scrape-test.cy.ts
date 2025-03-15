describe("Scrape Test", () => {
  it("should scrape a website", () => {
    cy.login("matovu@dabblelab.com", "password90");
    // expect to be redirected to the dashboard
    cy.get('[href="/dashboard/scrape-test"]', { timeout: 60000 }).click();
    cy.get("button")
      .contains(/start scraping/i)
      .click();
    cy.contains(/discovering links/i, { timeout: 60000 }).should("be.visible");
    cy.contains(/discovered links/i, { timeout: 120000 }).should("be.visible");
    cy.contains(/scraping results/i, { timeout: 120000 }).should("be.visible");
    // cy.wait(5000);
    // cy.contains('pro')
  });
});
