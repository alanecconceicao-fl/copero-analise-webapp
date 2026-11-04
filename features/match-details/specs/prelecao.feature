# language: en
Feature: Fans read the published briefing
  The public briefing URL shows the published analysis on mobile,
  preserves the canonical URL, and does not show drafts.

  Background:
    Given the persisted public briefing flag is off
    And the consent cookie overrides the flag

  @data
  Scenario: A fan opens the published URL and reads that match analysis
    Given the fan opens the briefing "2026-brazilian-championship-single-round-15-adversary-fc" on a real mobile phone
    When the page loads
    Then they see the briefing for "Adversary FC"
    And the briefing contains exactly these three sections, in this order
    And the analysis narrates the data without exposing statistics or JSON
    And the vertical pitch shows the eleven starters with numbers, colors, and positions

  @data
  Scenario: The constraint field changes: the old URL redirects to the new canonical URL
    Given the fan opens the briefing "2026-brazilian-championship-single-round-15-adversary-fc-old" on a real mobile phone
    When the page loads
    Then they are redirected to the briefing "2026-brazilian-championship-single-round-15-adversary-fc"

  @data
  Scenario Outline: Unpublished briefing: the URL remains inaccessible
    Given the fan opens the briefing "<slug>" on a real mobile phone
    When the page loads
    Then they see that the analysis is unavailable

    Examples:
      | state          | slug                     |
      | never published | match-preview-never-published |
      | draft           | match-preview-draft           |
      | unpublished     | match-preview-unpublished     |

  @data
  Scenario: Feature flag off: even a published briefing is inaccessible
    Given the consent cookie is not present
    And the fan opens the briefing "2026-brazilian-championship-single-round-15-adversary-fc" on a real mobile phone
    When the page loads
    Then they see that the analysis is unavailable
    And the landing page does not promote the briefing

  Scenario: Desktop users never receive the published analysis
    Given someone opens the briefing "2026-brazilian-championship-single-round-15-adversary-fc" on a computer
    When the page loads
    Then the page says desktop access is not allowed
