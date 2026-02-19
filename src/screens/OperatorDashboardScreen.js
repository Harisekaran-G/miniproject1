import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { bookingAPI } from '../services/api';

export default function OperatorDashboardScreen({ route, navigation }) {
    const { operatorEmail } = route.params || {}; // Pass operator email from Login
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            // Use the email passed from login, or a hardcoded one for now if testing without full context
            const email = operatorEmail || 'kpn@operator.com';
            console.log('Fetching bookings for:', email);

            let response;
            if (email.includes('taxi') || email === 'go@taxi.com') { // Taxi Operator Logic
                console.log('Fetching Taxi Bookings...');
                response = await bookingAPI.getTaxiBookings();
            } else {
                response = await bookingAPI.getOperatorBookings(email);
            }

            if (response.success) {
                setBookings(response.data);
            } else {
                Alert.alert('Error', response.message || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const renderBookingItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.busName}>{item.busName}</Text>
                    <Text style={styles.routeText}>
                        {item.route?.from} → {item.route?.to}
                    </Text>
                </View>
                <Text style={styles.dateText}>
                    {new Date(item.bookingDate).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.passengerRow}>
                <View style={styles.passengerInfo}>
                    <Text style={styles.label}>Passenger:</Text>
                    <Text style={styles.value}>{item.passengerName}</Text>
                    <Text style={styles.subValue}>{item.userEmail}</Text>
                </View>
                <View style={styles.seatInfo}>
                    <Text style={styles.label}>Seat:</Text>
                    <Text style={styles.seatValue}>{item.seatNumbers?.join(', ')}</Text>
                </View>
            </View>

            <View style={styles.fareRow}>
                <Text style={styles.label}>Total Fare:</Text>
                <Text style={styles.fareValue}>₹{item.totalFare}</Text>
            </View>

            {item.taxiSelected && (
                <View style={styles.taxiBadge}>
                    <Ionicons name="car" size={14} color="#FFF" />
                    <Text style={styles.taxiText}>Taxi Included</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1E3A5F', '#4A90E2']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Operator Dashboard</Text>
                    <TouchableOpacity onPress={fetchBookings} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>Managed by: {operatorEmail || 'kpn@operator.com'}</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No bookings found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subTitle: {
        color: '#E0E0E0',
        marginTop: 4,
        fontSize: 14,
    },
    refreshButton: {
        padding: 8,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    busName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    routeText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 12,
    },
    passengerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    passengerInfo: {
        flex: 1,
    },
    seatInfo: {
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    subValue: {
        fontSize: 12,
        color: '#666',
    },
    seatValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    fareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    fareValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27AE60',
    },
    taxiBadge: {
        position: 'absolute',
        top: 16,
        right: 16, // Adjust if conflicts with date
        backgroundColor: '#F39C12',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        // Hide standard date if badges overlap, or position bottom right
        top: undefined,
        bottom: 16,
    },
    taxiText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});
