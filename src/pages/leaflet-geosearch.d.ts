// leaflet-geosearch.d.ts
declare module 'leaflet-geosearch' {
    import { Control, Map } from 'leaflet';
  
    class GeoSearchControl extends Control {
      constructor(options?: any);
      onAdd(map: Map): HTMLElement;
    }
  
    class OpenStreetMapProvider {
      constructor(options?: any);
    }
  
    export { GeoSearchControl, OpenStreetMapProvider };
  }
  