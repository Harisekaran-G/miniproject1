
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/taxiBookingStyles';
import { bookingAPI, hybridAPI } from '../services/api';

export default function TaxiBookingAfterBusScreen({ route, navigation }) {
  const {
    bookingId, busBookingId,
    source: busSource,
    destination: busDestination,
    busArrivalTime,
    // Accept any of these field names — different screens pass different names
    busFare: busFareParam,
    price: priceParam,
    totalFare: initialTotalFare,
    totalAmount,
  } = route.params;

  // Resolve bus fare from whichever field was passed, always a safe number
  const busFare = Number(busFareParam ?? priceParam ?? totalAmount ?? initialTotalFare ?? 0);

  // Pickup State
  const [addPickup, setAddPickup] = useState(false);
  const [pickupSource, setPickupSource] = useState(''); // User's location
  const [pickupDistance, setPickupDistance] = useState('');

  // Drop State
  const [addDrop, setAddDrop] = useState(false);
  const [dropDestination, setDropDestination] = useState(''); // User's final destination
  const [dropDistance, setDropDistance] = useState('');

  const [loading, setLoading] = useState(false);

  // Calculate fares helper
  const getFares = () => {
    let pickupFare = 0;
    let dropFare = 0;

    if (addPickup && pickupDistance) {
      pickupFare = 50 + (parseFloat(pickupDistance) * 15);
    }
    if (addDrop && dropDistance) {
      dropFare = 50 + (parseFloat(dropDistance) * 15);
    }

    const taxiTotal = pickupFare + dropFare;
    // Guard: busFare is always a Number (resolved above)
    const finalTotal = busFare + taxiTotal;

    return { pickupFare, dropFare, taxiTotal, finalTotal };
  };

  const calculateTotalFare = () => {
    return getFares().finalTotal;
  };

  const handleConfirm = () => {
    // 1. Validation for Taxi Details
    if (addPickup && (!pickupSource.trim() || !pickupDistance)) {
      Alert.alert('Missing Details', 'Please enter Pickup location and distance');
      return;
    }

    if (addDrop && (!dropDestination.trim() || !dropDistance)) {
      Alert.alert('Missing Details', 'Please enter Drop location and distance');
      return;
    }

    // 2. Calculate Fares
    const { taxiTotal, finalTotal } = getFares();

    // 3. Navigation (Always triggers)
    // NOTE: We are passing the original busBookingId. 
    // In a real app, you might want to create the taxi booking record here, 
    // but for this fix/demo, we ensure navigation to payment works first.
    console.log('Navigating to Payment:', {
      totalFare: finalTotal,
      bookingType: (addPickup || addDrop) ? 'hybrid' : 'bus'
    });

    navigation.navigate('Payment', {
      bookingId: busBookingId,
      totalFare: finalTotal,
      bookingType: (addPickup || addDrop) ? 'hybrid' : 'bus', // 'hybrid' if taxi added
      busFare: busFare,
      taxiFare: taxiTotal,
      // Pass details if needed for success screen or backend later
      pickupDetails: addPickup ? { source: pickupSource, distance: pickupDistance, time: '45 mins before' } : null,
      dropDetails: addDrop ? { destination: dropDestination, distance: dropDistance, time: 'Upon Arrival' } : null,
      pendingBookingDetails: route.params.pendingBookingDetails // Forwarding the bus details
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A90E2', '#FFFFFF']} style={styles.headerGradient}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Your Trip</Text>
        <Text style={styles.headerSubtitle}>Bus Route: {busSource} → {busDestination}</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContent}>

        {/* Pickup Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Pickup Taxi (To Bus Stand)</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Scheduled 45 mins before bus departure</Text>
            </View>
            <Switch value={addPickup} onValueChange={setAddPickup} trackColor={{ false: "#767577", true: "#4A90E2" }} />
          </View>

          {addPickup && (
            <View style={styles.formContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>From (Your Location)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter pickup location"
                  value={pickupSource}
                  onChangeText={setPickupSource}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>To (Bus Boarding Point)</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>{busSource}</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Distance (km)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: 10"
                  keyboardType="numeric"
                  value={pickupDistance}
                  onChangeText={setPickupDistance}
                />
              </View>
              <Text style={styles.estimateText}>Est. Fare: ₹{50 + (parseFloat(pickupDistance || 0) * 15)}</Text>
            </View>
          )}
        </View>

        {/* Drop Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Drop Taxi (From Bus Stand)</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                Suggested: {busArrivalTime ? new Date(new Date(busArrivalTime).getTime() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Upon Arrival'} (15m buffer)
              </Text>
            </View>
            <Switch value={addDrop} onValueChange={setAddDrop} trackColor={{ false: "#767577", true: "#4A90E2" }} />
          </View>

          {addDrop && (
            <View style={styles.formContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>From (Bus Drop Point)</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>{busDestination}</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>To (Final Destination)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter drop location"
                  value={dropDestination}
                  onChangeText={setDropDestination}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Distance (km)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: 10"
                  keyboardType="numeric"
                  value={dropDistance}
                  onChangeText={setDropDistance}
                />
              </View>
              <Text style={styles.estimateText}>Est. Fare: ₹{50 + (parseFloat(dropDistance || 0) * 15)}</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total Trip Fare:</Text>
          <Text style={styles.footerFare}>₹{calculateTotalFare()}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleConfirm} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <Text style={styles.bookButtonText}>
              {(!addPickup && !addDrop) ? "Skip Taxi & Pay" : "Confirm & Pay"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
