interface InputData {
    data: Data[],
    tileOutlineColor: string,   
    backgroundColor: {
        fewItems: {
            numberOfItems: number,
            backgroundColor: string
        },
        someItems: {
            numberOfItems: number,
            backgroundColor: string
        },
        manyItems: {
            numberOfItems: number,
            backgroundColor: string
        }
    },
    hoverBackgroundColor: string,
    hoverOutlineColor: string
};

interface Data {
    title: string,
    description: string,
    boundingCoordinates: BoundingCoordinates
};

interface BoundingCoordinates {
    eastBoundingCoordinate: number, 
    westBoundingCoordinate: number,
    northBoundingCoordinate: number,
    southBoundingCoordinate: number
};
  
interface BoundingCoordinatesDiagonal {
    southWest: LatLng,
    northEast: LatLng
};
  
interface LatLng {
    lat: number,
    lng: number
};
  
export { InputData, BoundingCoordinates, BoundingCoordinatesDiagonal, Data };