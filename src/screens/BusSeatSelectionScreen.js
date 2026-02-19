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
  const { busId, routeNo, source, destination, fare, departureTime, arrivalTime } = route.params;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBusDetails();
  }, []);

  const fetchBusDetails = async () => {
    try {
      setLoading(true);
      // Ensure we get fresh seat data
      const response = await bookingAPI.getBusDetails(busId);
      if (response.success) {
        setSeats(response.data.seats || generateMockSeats());
      } else {
        // Fallback to mock seats if API fails or returns empty for demo
        setSeats(generateMockSeats());
      }
    } catch (error) {
      console.error('Error fetching bus details:', error);
      setSeats(generateMockSeats()); // Fallback for stability
    } finally {
      setLoading(false);
    }
  };

  const generateMockSeats = () => {
    const mockSeats = [];
    const rows = 8;
    for (let i = 1; i <= rows * 4; i++) {
      mockSeats.push({
        seatNumber: `S${i}`,
        isBooked: Math.random() < 0.3, // 30% booked
      });
    }
    return mockSeats;
  };

  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.length * fare;
  };

  const handleContinuePress = () => {
    setModalVisible(true);
  };

  const handleSkipTaxi = () => {
    setModalVisible(false);
    // Proceed to Payment with just Bus details
    navigation.navigate('Payment', {
      bookingDetails: {
        busId,
        routeNo,
        source,
        destination,
        seats: selectedSeats,
        totalFare: calculateTotal(),
        departureTime,
        arrivalTime,
        busFare: calculateTotal(),
        taxiIncluded: false
      }
    });
  };

  const handleAddTaxi = () => {
    setModalVisible(false);
    // Proceed to Taxi Booking (using TaxiBookingAfterBus screen or similar)
    // We pass the bus booking details along
    navigation.navigate('TaxiBookingAfterBus', {
      busBookingId: 'TEMP_ID_' + Date.now(), // In real app, we might book bus first
      source,
      destination,
      busArrivalTime: arrivalTime,
      busFare: calculateTotal(),
      totalFare: calculateTotal(),
      seats: selectedSeats,
      // Passing these to let the next screen know we haven't actually booked on backend yet
      isPendingBooking: true,
      pendingBookingDetails: {
        busId,
        routeNo,
        departureTime,
        // other needed fields
      }
    });
  };

  const renderSeatLayout = () => {
    // Assuming simple 2+2 layout for visual
    // Group seats into rows of 4
    const rows = [];
    for (let i = 0; i < seats.length; i += 4) {
      rows.push(seats.slice(i, i + 4));
    }

    return (
      <View style={styles.seatLayoutContainer}>
        {/* Driver Cabin */}
        <View style={styles.driverCabin}>
          <Ionicons name="sunny-outline" size={24} color="#666" style={styles.steeringIcon} />
          {/* Note: using sunny-outline as placeholder for steering wheel if not available, 
              but usually 'car-sport' or custom SVG is better. Let's use 'ios-car' or similar if available,
              or just a circle/icon. 'cog' looks a bit like a wheel too. 
              Let's stick to a generic icon or Image if possible. 
              Ionicons 'ellipse-outline' rotated could work? 
              Actually 'radio-button-off' looks like a wheel. */}
          <Ionicons name="radio-button-off" size={30} color="#999" style={{ transform: [{ rotate: '-45deg' }] }} />
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

  const renderSeat = (seat) => {
    if (!seat) return <View style={[styles.seat, { backgroundColor: 'transparent', borderWidth: 0 }]} />;

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
        <Text style={[styles.seatText, textStyle]}>{seat.seatNumber}</Text>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Select Seats</Text>
        <View style={styles.routeInfo}>
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
        {loading ? (
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
            {selectedSeats.length > 0 ? `Seats: ${selectedSeats.join(', ')}` : 'No seats selected'}
          </Text>
          <Text style={styles.totalPriceText}>₹{calculateTotal()}</Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, selectedSeats.length === 0 && styles.continueButtonDisabled]}
          disabled={selectedSeats.length === 0}
          onPress={handleContinuePress}
        >
          <Text style={styles.continueButtonText}>Continue to Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Taxi Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={{
              backgroundColor: '#E3F2FD',
              padding: 15,
              borderRadius: 50,
              marginBottom: 10
            }}>
              <Ionicons name="car-sport" size={40} color="#4A90E2" />
            </View>

            <Text style={styles.modalTitle}>Local Taxi</Text>
            <Text style={styles.modalMessage}>
              Do you need a local taxi drop after reaching <Text style={{ fontWeight: 'bold' }}>{destination}</Text>?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.skipButton]}
                onPress={handleSkipTaxi}
              >
                <Text style={styles.skipButtonText}>No, Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.taxiButton]}
                onPress={handleAddTaxi}
              >
                <Text style={styles.taxiButtonText}>Yes, Local Taxi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
