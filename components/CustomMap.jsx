import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapLoader from "./MapLoader";

const CustomMap = ({ latitude, longitude, cityName, country }) => {
  const markerIcon = new L.Icon({
    iconUrl: "/assets/images/marker-icon.png",
    iconSize: [45, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  if (!latitude || !longitude) {
    return <MapLoader />;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: 400, width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        <Popup>
          {cityName} <br /> {country}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default CustomMap;
