- 0.5.4 - 15-08-2013
  - Support for 0.6.5

- 0.5.2 - 11-07-2013
  - allow cancelling from beforeRouting (thanks @lukepur!)
  - renderPage passed data context through.

- 0.5.0
  - added named routes
  - added beforeRouting
  - re-added {{currentPage}} helper (thanks @zVictor!)

- 0.4.4 - 05-04-2013
  Updated to work with Meteor version 0.6.0 (thanks @Tarangp!)

- 0.4.3 - 14-03-2013
  Updated to work with Meteor version 0.5.8

- 0.4.0 - 26-02-2013
  Added IE support via the HTML5-History-API polyfill and a patched page.js

- 0.3.0 - 04-12-2012
  Added server-side version of `Meteor.Router.add`.

- 0.2.6 - 22-11-2012
  If routing between routing functions that both return the same page, don't trigger invalidations on listeners to `Meteor.Router.page`.

- 0.2.5 - 21-11-2012
   
  Fixed a bug where the routed params were passed as an array rather than as separate arguments to routing functions.
