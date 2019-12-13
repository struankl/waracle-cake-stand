# Waracle Cake Stand Tech Check

Client/server project for displaying & editing your favourite cakes.

## Client

React project created using [create-react-app](https://github.com/facebook/create-react-app), has not been ejected to expose undelying config.

## Server

Spring Boot app, created using [Spring Ininializr](https://start.spring.io/), maven with embedded Apache Derby database.

See individual README's in client & server project.

## Deviation from Spec

After adding a new cake you are taken to the page to view it, not back to the list view.

## Further Improvements

  * YumFactor Stars - create own module and testing around this, make focusably and allow keyboard input as well as mouse clicking on stars to set.
  * No authentication or authorisation on either server or client. Who should be able to see, edit & make new entries?
