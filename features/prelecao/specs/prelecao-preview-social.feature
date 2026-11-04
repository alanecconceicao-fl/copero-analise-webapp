# language: en
Feature: Social preview for the briefing
  Social networks read the briefing metadata without landing on the desktop notice.

  @data
  Scenario: A social crawler receives the briefing metadata
    Given the persisted public briefing flag is off
    And the consent cookie overrides the flag
    And a social crawler opens the briefing "2026-brasileirao-fase-unica-15-bahia"
    Then the social preview is for the briefing
