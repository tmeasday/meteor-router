- 0.2.6 - 22-11-2012
  If routing between routing functions that both return the same page, don't trigger invalidations on listeners to `Meteor.Router.page`.

- 0.2.5 - 21-11-2012
   
  Fixed a bug where the routed params were passed as an array rather than as separate arguments to routing functions.