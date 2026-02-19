import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/resultsStyles';
import { busAPI } from '../services/api';

export default function ResultsScreen({ route, navigation }) {
  const { source, destination } = route.params;
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use busAPI instead of hybridAPI
      console.log(`Fetching buses from ${source} to ${destination}`);
      const response = await busAPI.getBusOptions(source, destination);

      if (response.success) {
        setBuses(response.data || []);
      } else {
        // Mock data fallback if API fails or returns empty (for demo purposes)
        if (response.data && Array.isArray(response.data)) {
          setBuses(response.data);
        } else {
          setError(response.message || 'No buses found');
        }
      }
    } catch (err) {
      console.error('Error in ResultsScreen:', err);
      setError('Failed to load buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    // Convert minutes from midnight to HH:mm AM/PM
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hours = h % 12 || 12;
    const mins = m < 10 ? `0${m}` : m;
    return `${hours}:${mins} ${ampm}`;
  };

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleSelectBus = (bus) => {
    console.log('Bus object:', bus);
    navigation.navigate('BusSeatSelection', {
      busId: bus._id || bus.busId,
      routeNo: bus.routeNo,
      source,
      destination,
      price: bus.price ?? 0,
      totalSeats: bus.totalSeats ?? bus.seatsAvailable ?? 40,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
    });
  };

  const renderBusCard = ({ item }) => {
    // Use real data from API, with safe fallbacks
    const priceDisplay = item.price ?? 0;
    const rating = item.rating ? Number(item.rating).toFixed(1) : '4.0';
    const busType = item.busType || 'AC Seater (2+2)';
    const seatsLeft = item.seatsAvailable ?? 0;

    const depTime = item.departureTime || '—';
    const arrTime = item.arrivalTime || '—';
    const dur = item.duration || (item.eta ? formatDuration(item.eta) : '—');

    return (
      <View style={styles.busCard}>
        {/* Top Row: Name, Type, Rating */}
        <View style={styles.busCardTop}>
          <View>
            <Text style={styles.busName}>{item.operatorName || 'Express Travels'}</Text>
            <Text style={styles.busType}>{busType} | {item.routeNo}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#2E7D32" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>

        {/* Middle Row: Time & Duration */}
        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeText}>{depTime}</Text>
            <Text style={styles.dateText}>Departure</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{dur}</Text>
            <View style={styles.durationLine} />
            <Ionicons name="bus-outline" size={16} color="#666" />
          </View>
          <View style={styles.timeBlock}>
            <Text style={styles.timeText}>{arrTime}</Text>
            <Text style={styles.dateText}>Arrival</Text>
          </View>
        </View>

        {/* Bottom Row: Price, Seats, Select Button */}
        <View style={styles.busCardBottom}>
          <Text style={styles.seatsInfo}>
            <Text style={styles.seatsCount}>{seatsLeft}</Text> seats left
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{priceDisplay}</Text>
            <Text style={styles.onwardsText}>per seat</Text>
          </View>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleSelectBus(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectButtonText}>Select Seats</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{source} to {destination}</Text>
        <Text style={{ textAlign: 'center', color: '#E3F2FD', fontSize: 12, marginTop: 4 }}>
          Today
        </Text>
      </LinearGradient>

      {/* Sub-Header / Filter placeholder */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>{buses.length} Buses found</Text>
        <TouchableOpacity>
          <Text style={[styles.subHeaderText, { color: '#4A90E2' }]}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ marginTop: 10, color: '#666' }}>Searching buses...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#E74C3C" />
          <Text style={{ marginTop: 10, color: '#666' }}>{error}</Text>
          <TouchableOpacity
            style={[styles.selectButton, { marginTop: 20, backgroundColor: '#4A90E2' }]}
            onPress={fetchBuses}
          >
            <Text style={styles.selectButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={buses}
          renderItem={renderBusCard}
          keyExtractor={(item) => item.busId || item._id || Math.random().toString()}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.errorContainer}>
              <Text style={{ color: '#666' }}>No buses available for this route.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
