# language: en
# Living documentation for task #38 — basic SEO for the public app.
# Google indexing is mobile-first: Googlebot Smartphone passes the gate
# for mobile-only access and sees the real pages. robots.txt and sitemap.xml must also be
# readable by crawlers with desktop identities (middleware matcher).
Feature: The app is discoverable in search engines
  Sharing shows a title, description, and image; search engines find and
  understand the public pages; the desktop notice stays out of the index.

  Scenario: The landing page exposes sharing metadata and its canonical URL
    Given the fan opens the page on a real mobile phone
    When the page loads
    Then the page exposes a title, description, and sharing image
    And the canonical URL points to the official domain

  Scenario: A desktop crawler can read robots.txt and the sitemap
    Given someone opens the page on a computer
    Then robots.txt responds with a link to the sitemap
    And the sitemap lists the public pages

  Scenario: The mobile-only notice stays out of the search index
    Given someone opens the page on a computer
    When the page loads
    Then the notice page requests not to be indexed
