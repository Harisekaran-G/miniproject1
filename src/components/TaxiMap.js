import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function TaxiMap({ dropPoint, finalDest, center: mapCenter }) {
  const center = dropPoint || [13.0827, 80.2707];
  const dest = finalDest || [12.9801, 80.2224];
  const initialCenter = mapCenter || center;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const dropPoint = ${JSON.stringify(center)};
        const finalDest = ${JSON.stringify(dest)};
        const mapCenter = ${JSON.stringify(initialCenter)};
        const map = L.map('map', { zoomControl: false }).setView(mapCenter, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker(dropPoint).addTo(map).bindPopup('Bus Drop Point').openPopup();
        L.marker(finalDest).addTo(map).bindPopup('Final Destination');
        const polyline = L.polyline([dropPoint, finalDest], {color: '#4A90E2', weight: 5, dashArray: '10, 10'}).addTo(map);
        if (finalDest && dropPoint) {
            map.fitBounds(polyline.getBounds(), {padding: [50, 50]});
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 350, width: '100%' },
  map: { flex: 1 },
});
