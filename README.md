geo.js
======

Provides users with a human readable date input while allowing you to
submit (longitude, latitude) in your form.

Usage
-----

Add the Google Maps API to your page:

    <script src="//maps.googleapis.com/maps/api/js?key=[apikey]&amp;sensor=[sensor?]"></script>

Create your HTML form:

    <form action="/location" method="POST">
        <input name="foo">
        <input name="location" placeholder="What's your address?">
    </form>

Initialize geojs:

    $('input[name="location"]').geojs();

Options
-------

``prefix`` - Prefix for the human readable address.

``suffix`` - Suffix for the human readable address.

``preload`` - Initialize with the users location.
