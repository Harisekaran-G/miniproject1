import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/bookingConfirmationStyles';

export default function BookingConfirmationScreen({ route, navigation }) {
    const { bookingData } = route.params;

    const handleBackToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'RouteInput' }],
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.headerGradient}
            >
                <Ionicons name="checkmark-circle" size={60} color="#FFFFFF" />
                <Text style={styles.headerTitle}>Booking Confirmed!</Text>
                <Text style={styles.headerSubtitle}>Booking ID: {bookingData.bookingId}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <Text style={[styles.label, { color: '#4A90E2', fontSize: 18, marginBottom: 10 }]}>Trip Details</Text>

                    <View style={styles.tripPoint}>
                        <Ionicons name="bus" size={20} color="#4A90E2" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.value}>{bookingData.busName}</Text>
                            <Text style={styles.label}>Bus Route {bookingData.busId}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>From</Text>
                            <Text style={styles.value}>{bookingData.route.from}</Text>
                            <Text style={{ color: '#666', fontSize: 12 }}>{bookingData.boardingPoint?.name}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={20} color="#999" style={{ alignSelf: 'center', marginHorizontal: 10 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>To</Text>
                            <Text style={styles.value}>{bookingData.route.to}</Text>
                            <Text style={{ color: '#666', fontSize: 12 }}>{bookingData.droppingPoint?.name}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>Seats</Text>
                            <Text style={styles.value}>{bookingData.seatNumbers?.join(', ')}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                            <Text style={styles.label}>Status</Text>
                            <Text style={[styles.value, { color: '#4CAF50' }]}>Confirmed</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Fare Breakdown</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Base Fare</Text>
                        <Text style={styles.summaryValue}>₹{bookingData.busFare}</Text>
                    </View>
                    {bookingData.taxiFare > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Taxi Charge ({bookingData.taxiDetails?.name || 'Local'})</Text>
                            <Text style={styles.summaryValue}>₹{bookingData.taxiFare}</Text>
                        </View>
                    )}
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Convenience Fee</Text>
                        <Text style={styles.summaryValue}>₹{bookingData.convenienceFee}</Text>
                    </View>
                    <View style={[styles.row, { marginTop: 10 }]}>
                        <Text style={styles.fareLabel}>Total Paid</Text>
                        <Text style={styles.fareValue}>₹{bookingData.totalFare}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={handleBackToHome}
                    activeOpacity={0.8}
                >
                    <Text style={styles.homeButtonText}>Book Another Trip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.homeButton, { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#4A90E2', marginTop: 10 }]}
                    onPress={() => navigation.navigate('MyBookings')}
                >
                    <Text style={[styles.homeButtonText, { color: '#4A90E2' }]}>Go to My Bookings</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
