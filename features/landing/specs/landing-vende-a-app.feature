# language: en
# Living documentation for story #14 — AC 3–5 and 10 (discovery-e0.md, sign-off 2026-07-08).
Feature: The landing page promotes the app
  A carousel with exactly 3 items and engaging text below.
  The copy is hard-coded in v0.

  Background:
    Given the fan opens the page on a real mobile phone

  Scenario: The carousel has exactly 3 items in the agreed order
    When the page loads
    Then the carousel shows exactly 3 items
    And the items are, in order: "What is Copero", "Match Preview", and "Copero Matchday"

  Scenario: Only the "What is Copero" item links to a page with more detail
    When the page loads
    Then the "What is Copero" item links to a page that explores the topic in depth
    And the "Match Preview" and "Copero Matchday" items do not have their own pages

  Scenario: The "What is Copero" link explores the topic in depth
    When the fan taps the link on the "What is Copero" item
    Then they reach the page that explains Copero in depth

  Scenario: The carousel advances automatically
    When the page stays open without being touched
    Then the carousel advances to the next item automatically

  Scenario: The carousel also advances with a swipe
    When the fan swipes the carousel
    Then the carousel advances to the next item

  Scenario: The carousel loops back at the end
    Given the carousel is on the third item
    When the carousel advances
    Then it returns to the first item

  Scenario: Promotional text appears below the carousel
    When the page loads
    Then the engaging explanatory app text appears below the carousel

  @data
  Scenario: The landing page promotes the next match briefing
    Given the persisted public briefing flag is off
    And the consent cookie overrides the flag
    When the page loads
    Then the next match briefing callout appears
