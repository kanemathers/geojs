(function($)
{
    var Geo = function(element, options)
    {
        var el  = element;
        var $el = $(element);

        this.options       = $.extend($.fn.geo.defaults, options);
        this.$inputAddress = $el;
        this.$inputLatLng  = $('<input type="hidden">');
        this.geocoder      = new google.maps.Geocoder();

        this.render();

        if (this.options.preload !== false)
        {
            this.getLocation()
                .then($.proxy(this.lookupLatLng, this))
                .then($.proxy(this.setLocation, this));
        }

        var self = this;

        this.$inputAddress.on('blur', function()
        {
            self.lookupAddress($(this).val())
                .then($.proxy(self.setLocation, self));
        });
    };

    Geo.prototype = {
        render: function()
        {
            this.$inputLatLng.attr('name', this.$inputAddress.attr('name'));
            this.$inputAddress.attr('name', '');

            this.$inputAddress.after(this.$inputLatLng);
        },

        setLocation: function(location)
        {
            var friendly = this.options.prefix + location.address + this.options.suffix;

            this.$inputAddress.val(friendly);
            this.$inputLatLng.val(location.lat + ', ' + location.lng);
        },

        getLocation: function()
        {
            if (!('geolocation' in navigator))
                return false;

            var deferred = $.Deferred();

            navigator.geolocation.getCurrentPosition(function(position)
            {
                deferred.resolve(position.coords.latitude, position.coords.longitude);
            });

            return deferred.promise();
        },

        lookupLatLng: function(lat, lng)
        {
            var deferred = $.Deferred();
            var latlng   = new google.maps.LatLng(lat, lng);

            this.geocoder.geocode({'latLng': latlng}, function(results, status)
            {
                if (status != google.maps.GeocoderStatus.OK || !results.length)
                    deferred.reject(status);

                deferred.resolve({
                    lat:     lat,
                    lng:     lng,
                    address: results[0].formatted_address
                });
            });

            return deferred.promise();
        },

        lookupAddress: function(address)
        {
            var deferred = $.Deferred();

            this.geocoder.geocode({'address': address}, function(results, status)
            {
                if (status != google.maps.GeocoderStatus.OK || !results.length)
                    deferred.reject(status);

                deferred.resolve({
                    lat:     results[0].geometry.location.lat(),
                    lng:     results[0].geometry.location.lng(),
                    address: results[0].formatted_address
                });
            });

            return deferred.promise();
        }
    };

    $.fn.geo = function(option)
    {
        return this.each(function()
        {
            var $this   = $(this);
            var data    = $this.data('geo');
            var options = typeof option == 'object' && option;

            if (!data)
                $this.data('geo', (data = new Geo(this, options)));

            if (typeof option == 'string')
                data[option]();
        });

    };

    $.fn.geo.defaults = {
        prefix:  '',
        suffix:  '',
        preload: false
    };
})(window.jQuery);
