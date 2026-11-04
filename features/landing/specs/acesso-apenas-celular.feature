# language: en
# Living documentation for story #14 — AC 1–2 (discovery-e0.md, sign-off 2026-07-08).
Feature: Mobile-only access
  Copero is built for the mobile stands:
  only real mobile phones get in — no tablets, computers, or narrow windows.

  Scenario: A fan on a mobile phone sees the landing page
    Given the fan opens the page on a real mobile phone
    When the page loads
    Then they see the Copero landing page

  Scenario: A rotated phone continues to work
    Given the fan opens the page on a real mobile phone
    When they rotate the phone to landscape
    Then they continue to see the landing page normally

  Scenario: Desktop users see the access denied notice
    Given someone opens the page on a computer
    When the page loads
    Then the page says desktop access is not allowed

  Scenario: Tablets are blocked like desktop computers
    Given someone opens the page on a tablet
    When the page loads
    Then the page says desktop access is not allowed

  Scenario: A narrow desktop window is still treated as desktop
    Given someone opens the page on a computer with a narrow window
    When the page loads
    Then the page says desktop access is not allowed

  Scenario: The desktop notice does not include app navigation
    Given someone opens the page on a computer
    When the page loads
    Then the app navigation bar is not shown
