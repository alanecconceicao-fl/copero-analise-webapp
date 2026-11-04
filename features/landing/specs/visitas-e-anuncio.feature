# language: en
# Living documentation for story #14 — AC 8–9 (discovery-e0.md, sign-off 2026-07-08).
# Note: “the author sees how many visits there were” is read in the AdSense dashboard — it is not
# this is not a local end-to-end scenario; this suite checks what the page loads.
Feature: Visits are counted with AdSense from the start
  AdSense is included in v0 (even if approval takes time), and the layout
  supports the ad space when no ad is served.

  Background:
    Given the fan opens the page on a real mobile phone

  Scenario: The AdSense slot is present from v0
    When the page loads
    Then the AdSense ad slot is present on the page

  Scenario: The layout works without an approved ad
    Given AdSense does not have an ad to serve yet
    When the page loads
    Then the whole page appears without gaps or layout breakage
