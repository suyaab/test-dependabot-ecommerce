# Analytics

## Overview

Analytics package is the primary way for this team (and the marketing / data team) to:

1. collect how many users visit a specific page
2. collect how many users perform a specific action on a page

## Page Tracking

A page can be tracked like the following:

```ts
const analyticsService = ServiceLocator.getAnalyticsService();
analyticsService.trackPage(page);
```

> [!WARNING]  
> This service and function must ONLY be used on the client as it's implementation uses `window` to push page data
> which gets picked up by the Adobe analytics script on the page.

## Action Tracking

To track an action _(like a button click)_, the button must have two attributes on itself:

```html

<button
  ...
  data-analytics-action="INSERT ACTION NAME HERE"
  data-analytics-location="INSERT LOCATION NAME HERE"
>
  {text}
</button>
```

These two attributes are also picked up by the Adobe Analytics script and can be correlated in the dashboard allowing
to track how many users performed a specific action.

## Future Improvements

1. Expose a `const` `Location` enum which can be used as a key for `getPageData` as well as used across the
   various `data-analytics-location` attributes
2. Expose a `const` `Action` enum and a mapping between `Location` and `Action` to be used for `data-analytics-action`
   to help improve consistency across all analytic action usages