# language: en
# Living documentation for story #14 — AC 6–7 (discovery-e0.md, sign-off 2026-07-08).
Feature: About Us and footer navigation
  Mobile app-style navigation: a fixed bar at the bottom.
  In v0: Home and About Us.

  Background:
    Given the fan opens the page on a real mobile phone

  Scenario: The footer bar stays fixed while the page scrolls
    When the fan scrolls the page
    Then the navigation bar remains visible at the bottom

  @data
  Scenario: Content scrolls behind the footer bar
    Given the persisted public briefing flag is off
    And the consent cookie overrides the flag
    When the next match content scrolls behind the footer
    Then the navigation bar stays in front of the content

  Scenario: The v0 footer has Home and About Us
    When the page loads
    Then the footer bar has shortcuts for "Home" and "About Us"

  Scenario: Go to About Us and return home
    When the fan taps "About Us" in the footer
    Then they reach the About Us page
    When the fan taps "Home" in the footer
    Then they return to the landing page

  Scenario: About Us introduces Copero and its team
    When the fan taps "About Us" in the footer
    Then they see a brief explanation of Copero Análise
    And they see who is on the project, with an introduction to each person
