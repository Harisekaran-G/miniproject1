import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/busSeatSelectionStyles';
import { bookingAPI } from '../services/api';

export default function BusSeatSelectionScreen({ route, navigation }) {
  const {
    busId,
    routeNo,
    source,
    destination,
    price,          // per-seat price — standardized field
    totalSeats,
    departureTime,
    arrivalTime,
  } = route.params;

  console.log('Bus received — busId:', busId, 'price:', price);

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true); // Issue 2: separate loading state
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBusDetails();
  }, []);

  const fetchBusDetails = async () => {
    try {
      setLoadingSeats(true);
      const response = await bookingAPI.getBusDetails(busId);

      if (response?.success && response?.data?.seats?.length > 0) {
        // Use real seats from backend
        setSeats(response.data.seats);
      } else {
        // Issue 2: Fallback — generate seats dynamically from totalSeats
        const count = response?.data?.totalSeats || totalSeats || 40;
        setSeats(generateSeats(count));
      }
    } catch (error) {
      console.error('Error fetching bus details:', error);
      // Issue 2: Always render seats even on error
      setSeats(generateSeats(totalSeats || 40));
    } finally {
      setLoadingSeats(false);
    }
  };

  // Issue 2: Generate seats from count, not random booking state
  const generateSeats = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      seatNumber: (i + 1).toString().padStart(2, '0'),
      isBooked: false,
    }));
  };

  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Safe total: never NaN, never undefined
  const calculateTotal = () => {
    const perSeatPrice = Number(price) || 0;
    return selectedSeats.length * perSeatPrice;
  };

  const handleContinuePress = () => {
    if (selectedSeats.length === 0) return;

    const totalAmount = calculateTotal();
    navigation.navigate('BoardingDropping', {
      busId,
      routeNo,
      source,
      destination,
      departureTime,
      arrivalTime,
      price: Number(price) || 0,
      selectedSeats,
      totalBusFare: totalAmount,
    });
  };

  const renderSeat = (seat) => {
    if (!seat) {
      return <View style={[styles.seat, { backgroundColor: 'transparent', borderWidth: 0 }]} />;
    }

    const isSelected = selectedSeats.includes(seat.seatNumber);
    const isBooked = seat.isBooked;

    let seatStyle = styles.availableSeat;
    let textStyle = styles.availableSeatText;

    if (isBooked) {
      seatStyle = styles.bookedSeat;
      textStyle = styles.bookedSeatText;
    } else if (isSelected) {
      seatStyle = styles.selectedSeat;
      textStyle = styles.selectedSeatText;
    }

    return (
      <TouchableOpacity
        key={seat.seatNumber}
        style={[styles.seat, seatStyle]}
        onPress={() => !isBooked && toggleSeatSelection(seat.seatNumber)}
        disabled={isBooked}
        activeOpacity={0.8}
      >
        {/* Issue 5: All text properly wrapped in <Text> */}
        <Text style={[styles.seatText, textStyle]}>{seat.seatNumber}</Text>
      </TouchableOpacity>
    );
  };

  const renderSeatLayout = () => {
    const rows = [];
    for (let i = 0; i < seats.length; i += 4) {
      rows.push(seats.slice(i, i + 4));
    }

    return (
      <View style={styles.seatLayoutContainer}>
        {/* Driver Cabin */}
        <View style={styles.driverCabin}>
          <Ionicons name="car-sport" size={30} color="#999" />
        </View>

        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.seatRow}>
            {/* Left Pair */}
            <View style={styles.seatGroup}>
              {row.slice(0, 2).map((seat) => renderSeat(seat))}
            </View>

            {/* Aisle */}
            <View style={styles.aisle} />

            {/* Right Pair */}
            <View style={styles.seatGroup}>
              {row.slice(2, 4).map((seat) => renderSeat(seat))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Issue 1: Format fare safely — show 0 instead of NaN
  const displayTotal = calculateTotal();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.headerGradient}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Seats</Text>
        <View style={styles.routeInfo}>
          {/* Issue 5: wrapped in Text, no bare strings */}
          <Text style={styles.routeText}>{source} </Text>
          <Ionicons name="arrow-forward" size={16} color="#E3F2FD" />
          <Text style={styles.routeText}> {destination}</Text>
        </View>
      </LinearGradient>

      {/* Bus Details Summary */}
      <View style={styles.busInfoContainer}>
        <Text style={styles.busName}>Express Route {routeNo}</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>Dep: {departureTime}</Text>
          <Text style={styles.timeText}>Arr: {arrivalTime}</Text>
        </View>
        {/* Show per-seat price clearly */}
        <Text style={[styles.timeText, { marginTop: 4 }]}>
          ₹{Number(price) || 0} per seat
        </Text>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.availableSeat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.selectedSeat]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.bookedSeat]} />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>

      {/* Seat Layout */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Issue 2: Use loadingSeats, not seats.length, to decide rendering */}
        {loadingSeats ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading seats...</Text>
          </View>
        ) : (
          renderSeatLayout()
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceBreakdown}>
          <Text style={styles.selectedSeatsText}>
            {selectedSeats.length > 0
              ? `Seats: ${selectedSeats.join(', ')}`
              : 'No seats selected'}
          </Text>
          <Text style={styles.totalPriceText}>₹{displayTotal}</Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, selectedSeats.length === 0 && styles.continueButtonDisabled]}
          disabled={selectedSeats.length === 0}
          onPress={handleContinuePress}
        >
          <Text style={styles.continueButtonText}>Continue to Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
