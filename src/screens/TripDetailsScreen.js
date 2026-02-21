import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function TripDetailsScreen({ route, navigation }) {
    const { bookingData } = route.params;

    const handleBackToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'RouteInput' }],
        });
    };

    const handleDownloadTicket = () => {
        alert('Ticket download started... (Simulated)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status Header */}
                <LinearGradient
                    colors={['#4CAF50', '#2E7D32']}
                    style={styles.headerGradient}
                >
                    <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
                    <Text style={styles.headerTitle}>Booking Confirmed!</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>CONFIRMED</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Combined Booking IDs Card */}
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <View>
                                <Text style={styles.label}>Bus Booking ID</Text>
                                <Text style={styles.bookingIdText}>{bookingData.bookingId}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Ride ID (Taxi)</Text>
                                <Text style={[styles.bookingIdText, { color: '#4A90E2' }]}>{bookingData.taxiDetails?.rideId || 'N/A'}</Text>
                            </View>
                        </View>
                        <View style={[styles.cardRow, { marginTop: 15 }]}>
                            <View>
                                <Text style={styles.label}>Payment Status</Text>
                                <Text style={[styles.bookingIdText, { color: '#2E7D32', fontSize: 16 }]}>{bookingData.paymentStatus}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Ride Status</Text>
                                <Text style={[styles.bookingIdText, { color: '#F39C12', fontSize: 16 }]}>{bookingData.status === 'Confirmed' ? 'Confirmed' : 'Upcoming'}</Text>
                            </View>
                        </View>
                        <Text style={[styles.label, { marginTop: 15 }]}>Booked on: {bookingData.bookingTime}</Text>
                    </View>

                    {/* Passenger Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Passenger Information</Text>
                        <View style={styles.card}>
                            <View style={styles.infoRow}>
                                <Ionicons name="person" size={20} color="#4A90E2" />
                                <Text style={styles.infoText}>{bookingData.passengerName}</Text>
                            </View>
                            <View style={[styles.infoRow, { marginTop: 10 }]}>
                                <Ionicons name="call" size={20} color="#4A90E2" />
                                <Text style={styles.infoText}>+91 {bookingData.passengerPhone}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Journey Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>BUS DETAILS</Text>
                        <View style={styles.card}>
                            <Text style={styles.busNameText}>{bookingData.busName}</Text>
                            <Text style={styles.busTypeText}>{bookingData.busType} | Route {bookingData.busId}</Text>

                            <View style={styles.routeContainer}>
                                <View style={styles.routePoint}>
                                    <View style={styles.dot} />
                                    <View>
                                        <Text style={styles.placeText}>{bookingData.route.from}</Text>
                                        <Text style={styles.pointDetailText}>{bookingData.boardingPoint?.name}</Text>
                                    </View>
                                </View>
                                <View style={styles.routeLine} />
                                <View style={styles.routePoint}>
                                    <View style={[styles.dot, { backgroundColor: '#E74C3C' }]} />
                                    <View>
                                        <Text style={styles.placeText}>{bookingData.route.to}</Text>
                                        <Text style={styles.pointDetailText}>{bookingData.droppingPoint?.name}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.cardRow}>
                                <View>
                                    <Text style={styles.label}>Date</Text>
                                    <Text style={styles.valueText}>{bookingData.date}</Text>
                                </View>
                                <View>
                                    <Text style={styles.label}>Seats</Text>
                                    <Text style={styles.valueText}>{bookingData.seatNumbers?.join(', ')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Taxi Details if any */}
                    {bookingData.taxiSelected && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>TAXI DETAILS</Text>
                            <View style={[styles.card, { borderColor: '#4A90E2', borderWidth: 1 }]}>
                                <View style={styles.infoRow}>
                                    <Ionicons name="car" size={24} color="#4A90E2" />
                                    <View style={{ marginLeft: 15, flex: 1 }}>
                                        <Text style={[styles.valueText, { marginTop: 0 }]}>{bookingData.taxiDetails?.type} (Ride Confirmed)</Text>
                                        <Text style={styles.pointDetailText}>{bookingData.taxiDetails?.seats}</Text>
                                    </View>
                                </View>

                                <View style={[styles.routeContainer, { marginTop: 15 }]}>
                                    <View style={styles.routePoint}>
                                        <Ionicons name="location" size={16} color="#4A90E2" style={{ marginRight: 10 }} />
                                        <View>
                                            <Text style={styles.label}>Pickup (Arrival + 10m buffer)</Text>
                                            <Text style={styles.pointValueText}>{bookingData.taxiDetails?.pickup} @ {bookingData.taxiDetails?.pickupTime}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.routePoint, { marginTop: 10 }]}>
                                        <Ionicons name="flag" size={16} color="#E74C3C" style={{ marginRight: 10 }} />
                                        <View>
                                            <Text style={styles.label}>Drop Location</Text>
                                            <Text style={styles.pointValueText}>{bookingData.taxiDetails?.drop}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.cardRow, { marginTop: 15 }]}>
                                    <View>
                                        <Text style={styles.label}>Distance</Text>
                                        <Text style={styles.valueText}>{bookingData.taxiDetails?.distance}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.label}>Duration</Text>
                                        <Text style={styles.valueText}>{bookingData.taxiDetails?.duration}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Fare Summary */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Fare Summary</Text>
                        <View style={styles.card}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Bus Fare</Text>
                                <Text style={styles.summaryValue}>₹{bookingData.busFare}</Text>
                            </View>
                            {bookingData.taxiFare > 0 && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Taxi Fare</Text>
                                    <Text style={styles.summaryValue}>₹{bookingData.taxiFare}</Text>
                                </View>
                            )}
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Convenience Fee</Text>
                                <Text style={styles.summaryValue}>₹{bookingData.convenienceFee}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.totalLabel}>Total Amount Paid</Text>
                                <Text style={styles.totalValue}>₹{bookingData.totalFare}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={handleDownloadTicket}
                    >
                        <Ionicons name="download-outline" size={24} color="#FFF" />
                        <Text style={styles.downloadButtonText}>Download Ticket</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={handleBackToHome}
                    >
                        <Text style={styles.homeButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerGradient: {
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 15,
    },
    statusBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 10,
    },
    statusBadgeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#7F8C8D',
        textTransform: 'uppercase',
    },
    bookingIdText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    section: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 10,
        marginLeft: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 15,
    },
    busNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    busTypeText: {
        fontSize: 12,
        color: '#7F8C8D',
        marginTop: 2,
    },
    routeContainer: {
        marginTop: 20,
    },
    routePoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A90E2',
        marginTop: 5,
        marginRight: 15,
    },
    placeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    pointDetailText: {
        fontSize: 12,
        color: '#7F8C8D',
    },
    pointValueText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginTop: 2,
    },
    routeLine: {
        width: 2,
        height: 30,
        backgroundColor: '#BDC3C7',
        marginLeft: 5,
        marginVertical: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#ECF0F1',
        marginVertical: 15,
    },
    valueText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginTop: 5,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#7F8C8D',
    },
    summaryValue: {
        fontWeight: '600',
        color: '#2C3E50',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    downloadButton: {
        backgroundColor: '#4A90E2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    downloadButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    homeButton: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        padding: 15,
        marginTop: 10,
    },
    homeButtonText: {
        color: '#4A90E2',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
