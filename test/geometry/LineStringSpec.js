describe('#LineString', function () {

    var container;
    var map;
    var center = new maptalks.Coordinate(118.846825, 32.046534);
    var layer;

    beforeEach(function () {
        var setups = COMMON_CREATE_MAP(center);
        container = setups.container;
        map = setups.map;
        layer = new maptalks.VectorLayer('id');
        map.addLayer(layer);
    });

    afterEach(function () {
        map.remove();
        REMOVE_CONTAINER(container);
    });

    it('getCenter', function () {
        var polyline = new maptalks.LineString([
          { x: 0, y: 0 },
          { x: 120, y: 0 }
        ]);
        var got = polyline.getCenter();
        expect(got.x).to.eql(60);
        expect(got.y).to.eql(0);
    });

    it('getExtent', function () {
        var polyline = new maptalks.LineString([
          { x: 0, y: 0 },
          { x: 120, y: 10 }
        ]);

        var extent = polyline.getExtent();
        expect(extent.getWidth()).to.be.above(0);
        expect(extent.getHeight()).to.be.above(0);
    });

    it('getSize', function () {
        var polyline = new maptalks.LineString([
          { x: 0, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 30 }
        ]);
        layer.addGeometry(polyline);
        var size = polyline.getSize();

        expect(size.width).to.be.above(0);
        expect(size.height).to.be.above(0);
    });


    it('getCoordinates', function () {
        var path = [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 30 }
        ];
        var polyline = new maptalks.LineString(path);
        layer.addGeometry(polyline);
        var coords = polyline.getCoordinates();

        for (var i = 0; i < coords.length; i++) {
            expect(coords[i]).to.closeTo(path[i]);
        }
        // expect(polyline.getCoordinates()).to.eql(path);
    });

    it('setCoordinates', function () {
        var path = [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 30 }
        ];
        var polyline = new maptalks.LineString([]);
        layer.addGeometry(polyline);
        polyline.setCoordinates(path);

        expect(polyline.getCoordinates()).to.eql(path);
    });


    describe('constructor', function () {

        it('normal constructor', function () {
            var points = [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]];
            var polyline = new maptalks.LineString(points);
            var coordinates = polyline.getCoordinates();
            expect(coordinates).to.have.length(points.length);
            var geojsonCoordinates = maptalks.Coordinate.toNumberArrays(coordinates);
            expect(geojsonCoordinates).to.eql(points);
        });

        it('can be empty.', function () {
            var polyline = new maptalks.LineString();
            expect(polyline.getCoordinates()).to.have.length(0);
        });

    });

    describe('getCenter', function () {
        it('should return center', function () {
            var polyline = new maptalks.LineString([
                { x: 0, y: 0 },
                { x: 0, y: 10 },
                { x: 0, y: 80 }
            ]);
            layer.addGeometry(polyline);

            expect(polyline.getCenter()).to.closeTo(new maptalks.Coordinate(0, 30));
        });
    });

    it('getExtent', function () {
        var polyline = new maptalks.LineString([
            { x: 0, y: 0 },
            { x: 0, y: 10 },
            { x: 0, y: 80 }
        ]);
        // layer.addGeometry(polyline);

        expect(polyline.getExtent()).to.eql(new maptalks.Extent(0, 0, 0, 80));
    });

    describe('geometry fires events', function () {
        it('events', function () {
            var points = [
                { x: 0, y: 0 },
                { x: 0, y: 10 },
                { x: 0, y: 80 }
            ];
            var vector = new maptalks.LineString(points);
            new COMMON_GEOEVENTS_TESTOR().testCanvasEvents(vector, map, vector.getCenter());
        });
    });

    it('can have various symbols', function (done) {
        var points = [
                { x: 0, y: 0 },
                { x: 0, y: 10 },
                { x: 0, y: 80 }
        ];
        var vector = new maptalks.LineString(points);
        COMMON_SYMBOL_TESTOR.testGeoSymbols(vector, map, done);
    });

    it('containsPoint', function () {
        var lineWidth = 8;
        var line = new maptalks.LineString([map.getCenter(), map.getCenter().add(0.1, 0)], {
            symbol : {
                'lineWidth' : lineWidth
            }
        });
        layer.addGeometry(line);
        var cp = map.coordinateToContainerPoint(map.getCenter());
        expect(line.containsPoint(cp)).to.be.ok();
        expect(line.containsPoint(cp.add(-lineWidth / 2, 0))).to.be.ok();
        expect(line.containsPoint(cp.add(-lineWidth / 2 - 1, 0))).not.to.be.ok();
        expect(line.containsPoint(cp.add(0, lineWidth / 2))).to.be.ok();
        expect(line.containsPoint(cp.add(0, lineWidth / 2 + 1))).not.to.be.ok();
    });

    it('containsPoint with arrow of vertex-first', function () {
        var lineWidth = 8;
        var line = new maptalks.LineString([map.getCenter(), map.getCenter().add(0.1, 0)], {
            arrowStyle : 'classic',
            arrowPlacement : 'vertex-first',
            symbol : {
                'lineWidth' : lineWidth
            }
        });
        layer.addGeometry(line);
        var cp = map.coordinateToContainerPoint(map.getCenter());
        expect(line.containsPoint(cp.add(-lineWidth / 2, 0))).to.be.ok();
        expect(line.containsPoint(cp.add(lineWidth * 4, lineWidth + 7))).to.be.ok();
        expect(line.containsPoint(cp.add(lineWidth * 4, lineWidth + 8))).not.to.be.ok();
    });

    it('containsPoint with arrow of point', function () {
        var lineWidth = 8;
        var line = new maptalks.LineString([map.getCenter().substract(0.1, 0), map.getCenter(), map.getCenter().add(0.1, 0)], {
            arrowStyle : 'classic',
            arrowPlacement : 'point',
            symbol : {
                'lineWidth' : lineWidth
            }
        });
        layer.addGeometry(line);
        var cp = map.coordinateToContainerPoint(map.getCenter());
        expect(line.containsPoint(cp.add(-4 * lineWidth, lineWidth + 7))).to.be.ok();
        expect(line.containsPoint(cp.add(-4 * lineWidth, -lineWidth - 7))).to.be.ok();
        expect(line.containsPoint(cp.add(-4 * lineWidth, -lineWidth - 8))).not.to.be.ok();
    });
    it('bug: create with dynamic textSize', function () {
        // bug desc:
        // when creating a linestring with dynamic textsize, geometry._getPainter() will create a textMarkerSymbolizer.
        // the dynamic textSize in the symbol will read map's zoom, which is still null.
        //
        // fix:
        // forbidden to getPainter when geometry is not added to a map.
        var points = [
                { x: 0, y: 0 },
                { x: 0, y: 10 },
                { x: 0, y: 80 }
        ];
        var symbol = { 'lineWidth':1, 'lineColor':'#000', 'textName':'{count}', 'textSize':{ 'type':'interval', 'stops':[[0, 0], [16, 5], [17, 10], [18, 20], [19, 40]] }};
        new maptalks.LineString(points, {
            'symbol' : symbol,
            'properties' : { 'count' : 1 }
        });
    });

    describe('animateShow', function () {
        it('animateShow', function (done) {
            layer = new maptalks.VectorLayer('id2');
            var polyline = new maptalks.LineString([
                map.getCenter(),
                map.getCenter().add(0.01, 0.01)
            ], {
                'visible' : false
            });
            layer.once('layerload', function () {
                expect(layer._getRenderer().isBlank()).to.be.ok();
                polyline.animateShow({
                    'duration' : 100,
                    'easing' : 'out'
                });
                // polyline.show();
                setTimeout(function () {
                    expect(layer).to.be.painted(0, 0);
                    done();
                }, 80);
            });
            layer.addGeometry(polyline).addTo(map);

        });
    });

});
