import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/paymentStyles';
import { bookingAPI } from '../services/api';

export default function PaymentScreen({ route, navigation }) {
  const { bookingId, totalFare, bookingType, busFare, taxiFare, convenienceFee } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'phone-portrait', color: '#4A90E2' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'card', color: '#E74C3C' },
    { id: 'netbanking', name: 'Net Banking', icon: 'business', color: '#27AE60' },
    { id: 'wallet', name: 'Wallet', icon: 'wallet', color: '#F39C12' },
    { id: 'cash', name: 'Cash / Pay at Boarding', icon: 'cash', color: '#9B59B6' },
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // --- MOCK PAYMENT & BOOKING CREATION ---

      // 1. Generate Fake Transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

      // 2. Generate Random Booking ID (BK2026XXXX)
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `BK2026${randomSuffix}`;

      // 3. Prepare Booking Data
      // Extract details from route params
      const { pendingBookingDetails, pickupDetails, dropDetails } = route.params;

      const busDetails = pendingBookingDetails || {};

      const bookingData = {
        bookingId: bookingId,
        userEmail: 'auth_test_user@example.com',
        passengerName: 'Demo User',
        passengerPhone: '9876543210',
        route: {
          from: busDetails.source,
          to: busDetails.destination
        },
        date: busDetails.journeyDate || '21 Feb 2026',
        busId: busDetails.routeNo,
        busName: busDetails.operatorName || `Express ${busDetails.routeNo}`,
        busType: busDetails.busType || 'AC Sleeper',
        seatNumbers: busDetails.selectedSeats || [],
        busFare: busFare || 0,
        taxiFare: taxiFare || 0,
        convenienceFee: convenienceFee || 0,
        totalFare: totalFare,
        taxiSelected: bookingType === 'hybrid',
        boardingPoint: busDetails.boardingPoint,
        droppingPoint: busDetails.droppingPoint,
        taxiDetails: busDetails.taxiDetails,
        paymentStatus: 'Paid',
        transactionId: transactionId,
        status: 'Confirmed',
        bookingTime: new Date().toLocaleString()
      };

      console.log('Creating Booking:', bookingData);

      // 4. Call Backend API
      const response = await bookingAPI.createBooking(bookingData);

      if (response.success) {
        // SIMULATE SMS SENDING
        Alert.alert(
          'Payment Successful!',
          `SMS confirmation sent to +919876543210\n\nBooking ID: ${bookingId}`,
          [
            {
              text: 'View Trip Details',
              onPress: () => {
                navigation.navigate('TripDetails', { bookingData });
              },
            }
          ]
        );
      } else {
        Alert.alert('Booking Failed', response.message || 'Could not save booking');
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNowPress = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'upi') {
      setShowQR(true);
    } else {
      handlePayment();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#FFFFFF']}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContent}>
        {/* Dual Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          {/* Bus Section */}
          <View style={styles.summarySection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bus" size={18} color="#4A90E2" />
              <Text style={styles.sectionHeaderText}>BUS SUMMARY</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bus Name:</Text>
              <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.operatorName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Seats:</Text>
              <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.selectedSeats?.join(', ')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Boarding:</Text>
              <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.boardingPoint?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dropping:</Text>
              <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.droppingPoint?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bus Fare:</Text>
              <Text style={styles.summaryValue}>₹{busFare}</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          {/* Taxi Section */}
          {taxiFare > 0 && (
            <View style={styles.summarySection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="car" size={18} color="#27AE60" />
                <Text style={styles.sectionHeaderText}>TAXI SUMMARY</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxi Type:</Text>
                <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.taxiDetails?.type}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pickup:</Text>
                <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.taxiDetails?.pickup}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Drop:</Text>
                <Text style={[styles.summaryValue, { maxWidth: '60%' }]} numberOfLines={1}>{route.params.pendingBookingDetails?.taxiDetails?.drop}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Distance/Duration:</Text>
                <Text style={styles.summaryValue}>{route.params.pendingBookingDetails?.taxiDetails?.distance} / {route.params.pendingBookingDetails?.taxiDetails?.duration}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxi Fare:</Text>
                <Text style={styles.summaryValue}>₹{taxiFare}</Text>
              </View>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Convenience Fee:</Text>
            <Text style={styles.summaryValue}>₹{convenienceFee || 20}</Text>
          </View>

          <View style={[styles.summaryRow, { marginTop: 10 }]}>
            <Text style={styles.summaryTotalLabel}>TOTAL AMOUNT:</Text>
            <Text style={styles.summaryTotal}>₹{totalFare}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.paymentMethodsTitle}>Select Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodLeft}>
                <View style={[styles.paymentMethodIcon, { backgroundColor: `${method.color}20` }]}>
                  <Ionicons name={method.icon} size={24} color={method.color} />
                </View>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
              </View>
              {selectedPaymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#666" />
          <Text style={styles.securityText}>
            Your payment is secured with 256-bit SSL encryption
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Amount to Pay:</Text>
          <Text style={styles.footerAmount}>₹{totalFare}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, !selectedPaymentMethod && styles.payButtonDisabled]}
          onPress={handlePayNowPress}
          disabled={!selectedPaymentMethod || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay Now</Text>
              <Ionicons name="lock-closed" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* QR Modal */}
      <Modal
        visible={showQR}
        transparent={true}
        animationType="slide"
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            padding: 25,
            borderRadius: 15,
            alignItems: "center",
            width: "85%"
          }}>

            <Text style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10
            }}>
              Scan & Pay
            </Text>

            <Text style={{
              fontSize: 22,
              color: "green",
              fontWeight: "bold",
              marginBottom: 15
            }}>
              ₹ {totalFare}
            </Text>

            <QRCode
              value={`upi://pay?pa=busbooking@upi&pn=BusBooking&am=${totalFare}`}
              size={200}
            />

            <Text style={{
              marginTop: 15,
              fontSize: 14,
              color: '#666'
            }}>
              UPI ID: busbooking@upi
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "#1E3A8A",
                padding: 12,
                borderRadius: 8,
                width: "100%",
                alignItems: "center"
              }}
              onPress={() => {
                setShowQR(false);
                handlePayment();
              }}
            >
              <Text style={{
                color: "#fff",
                fontWeight: "bold"
              }}>
                I Have Paid
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 10,
                padding: 5
              }}
              onPress={() => setShowQR(false)}
            >
              <Text style={{ color: '#E74C3C' }}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

