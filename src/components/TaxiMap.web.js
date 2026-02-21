import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function TaxiMap({ dropPoint, finalDest }) {
    // Fallback coords if not provided
    const center = dropPoint || [13.0827, 80.2707];
    const dest = finalDest || [12.9801, 80.2224];

    return (
        <View style={styles.container}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>Bus Drop Point</Popup>
                </Marker>
                <Marker position={dest}>
                    <Popup>Final Destination</Popup>
                </Marker>
                <Polyline
                    positions={[center, dest]}
                    pathOptions={{ color: '#4A90E2', weight: 5, dashArray: '10, 10' }}
                />
            </MapContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 350,
        width: '100%',
        zIndex: 0,
    },
});
