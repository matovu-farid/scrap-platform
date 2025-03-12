describe("Scrape Test", () => {
  it("should scrape a website", () => {
    cy.login("matovu@dabblelab.com", "password90");
    // expect to be redirected to the dashboard
    cy.get('[href="/dashboard/scrape-test"]').click();
    cy.get("button")
      .contains(/start scraping/i)
      .click();
  });
});
