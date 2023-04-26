import { Injectable } from '@angular/core';
import { latLng, Map, GridLayer, point, DomUtil, latLngBounds, Point } from 'leaflet';
import { BoundingCoordinates, BoundingCoordinatesDiagonal, InputData, Data } from './models';

@Injectable({
  providedIn: 'root'
})
export class NgxLeafletGridlayerService {

  constructor() { }

  // Method for creating a grid layer on the map according to the data
  createGridLayer(inputData: InputData, map: Map) {
    const gridLayer = GridLayer.extend({
      options: {
        minNativeZoom: 6,
        maxNativeZoom: 12,
        pane: 'tilePane'
      },
      getTileSize: function () {
        let zoom = this._map.getZoom();
        if (zoom < 4) {
          return point(1000, 1000);
        } else if (zoom >= 4 && zoom < 6) {
          return point(320, 320);
        } else if (zoom >= 6 && zoom < 8) {
          return point(160, 160);
        } else if (zoom >= 8 && zoom < 11) {
          return point(130, 130);
        } else {
          return point(100, 100);
        }
      },
      createTile: function (coords: Point) {
        const tileCoords = this._tileCoordsToBounds(coords);
        const tileBounds: BoundingCoordinates = {
          eastBoundingCoordinate: tileCoords._northEast.lng,
          westBoundingCoordinate: tileCoords._southWest.lng,
          southBoundingCoordinate: tileCoords._southWest.lat,
          northBoundingCoordinate: tileCoords._northEast.lat
        };
        const tileBoundsDiagonal: BoundingCoordinatesDiagonal = {
          southWest: {lat: tileCoords._southWest.lat, lng: tileCoords._southWest.lng},
          northEast: {lat: tileCoords._northEast.lat, lng: tileCoords._northEast.lng}
        };
        let numberOfItemsInThisArea: number = 0;
        inputData.data.forEach((element: Data) => {
          const inputBounds: BoundingCoordinates = {
            eastBoundingCoordinate: element.boundingCoordinates.eastBoundingCoordinate,
            westBoundingCoordinate: element.boundingCoordinates.westBoundingCoordinate,
            southBoundingCoordinate: element.boundingCoordinates.southBoundingCoordinate,
            northBoundingCoordinate: element.boundingCoordinates.northBoundingCoordinate
          };
          const latCenter = (inputBounds.southBoundingCoordinate + inputBounds.northBoundingCoordinate) / 2;
          const lngCenter = (inputBounds.westBoundingCoordinate + inputBounds.eastBoundingCoordinate) / 2;
          if (
            latCenter > tileBounds.southBoundingCoordinate &&
            latCenter < tileBounds.northBoundingCoordinate &&
            lngCenter > tileBounds.westBoundingCoordinate &&
            lngCenter < tileBounds.eastBoundingCoordinate
          ) {
            numberOfItemsInThisArea += 1;
          }
        });
        if (numberOfItemsInThisArea == 0) {
          return DomUtil.create('div');
        };
        let tile = DomUtil.create('div', 'leaflet-tile');
        tile.innerHTML = [numberOfItemsInThisArea].join(', ');
        tile.style.outline = `1px solid ${inputData.tileOutlineColor}`;
        let backgroundColor: string;
        if (numberOfItemsInThisArea < inputData.backgroundColor.fewItems.numberOfItems) {
          backgroundColor = inputData.backgroundColor.fewItems.backgroundColor;
        } else if (numberOfItemsInThisArea >= inputData.backgroundColor.fewItems.numberOfItems && numberOfItemsInThisArea <= inputData.backgroundColor.someItems.numberOfItems) {
          backgroundColor = inputData.backgroundColor.someItems.backgroundColor;
        } else {
          backgroundColor = inputData.backgroundColor.manyItems.backgroundColor;
        };
        tile.style.backgroundColor = backgroundColor;
        tile.addEventListener('mouseenter', () => {
          tile.style.backgroundColor = inputData.hoverBackgroundColor;
          tile.style.outline = `1px solid ${inputData.hoverOutlineColor}`;
        });
        tile.addEventListener('mouseleave', () => {
          tile.style.backgroundColor = backgroundColor;
          tile.style.outline = `1px solid ${inputData.tileOutlineColor}`;
        });
        let startTimeClick: Date;
        let endTimeClick: Date;
        tile.addEventListener('mousedown', () => {
          startTimeClick = new Date();
        });
        tile.addEventListener('mouseup', () => {
          endTimeClick = new Date();
          const duration = endTimeClick.getTime() - startTimeClick.getTime();
          if (duration < 500) {
            var bounds = latLngBounds(
              latLng(tileBoundsDiagonal.southWest.lat, tileBoundsDiagonal.southWest.lng), // southwest corner of the tile
              latLng(tileBoundsDiagonal.northEast.lat, tileBoundsDiagonal.northEast.lng) // northeast corner of the tile
            );
            this._map.fitBounds(bounds);
          }
        });
        tile.style.pointerEvents = 'initial';
        tile.style.cursor = 'pointer';
        tile.style.display = 'flex';
        tile.style.justifyContent = 'center';
        tile.style.alignItems = 'center';
        tile.style.fontWeight = 'bold';
        let zoom = this._map.getZoom();
        if (zoom < 4) {
          tile.style.fontSize = '96px';
        } else if (zoom >= 4 && zoom < 6) {
          tile.style.fontSize = '42px';
        } else if (zoom >= 6 && zoom < 8) {
          tile.style.fontSize = '15px';
        } else if (zoom >= 8 && zoom < 11) {
          tile.style.fontSize = '15px';
        } else {
          tile.style.fontSize = '15px';
        }
        tile.style.color = 'rgb(68, 68, 68)';
        return tile;
      }
    });
    let createdGridLayer = new gridLayer();
    createdGridLayer.addTo(map);
  };
}
