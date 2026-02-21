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

export default function RideDetailsScreen({ route, navigation }) {
    const { taxiData, busDetails, convenienceFee } = route.params;

    const handleConfirmRide = () => {
        const totalFare = busDetails.totalBusFare + taxiData.fare + convenienceFee;

        navigation.navigate('Payment', {
            totalFare,
            bookingType: 'hybrid',
            busFare: busDetails.totalBusFare,
            taxiFare: taxiData.fare,
            convenienceFee,
            pendingBookingDetails: {
                ...busDetails,
                taxiDetails: taxiData
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ride Details</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.rideIdBadge}>
                        <Text style={styles.rideIdText}>{taxiData.rideId}</Text>
                    </View>

                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <Text style={styles.statusValue}>Upcoming</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.typeRow}>
                        <View style={styles.typeIconContainer}>
                            <Ionicons name={taxiData.type === 'Bike' ? 'bicycle' : 'car'} size={30} color="#4A90E2" />
                        </View>
                        <View>
                            <Text style={styles.typeName}>{taxiData.type}</Text>
                            <Text style={styles.typeSeats}>{taxiData.seats}</Text>
                        </View>
                    </View>

                    <View style={styles.routeContainer}>
                        <View style={styles.routePoint}>
                            <View style={styles.dot} />
                            <View>
                                <Text style={styles.pointLabel}>Pickup (Bus Drop Point)</Text>
                                <Text style={styles.pointValue}>{taxiData.pickup}</Text>
                                <Text style={styles.timeBuffer}>Time: {taxiData.pickupTime} (Incl. 10m buffer)</Text>
                            </View>
                        </View>
                        <View style={styles.routeLine} />
                        <View style={styles.routePoint}>
                            <View style={[styles.dot, { backgroundColor: '#E74C3C' }]} />
                            <View>
                                <Text style={styles.pointLabel}>Drop Location</Text>
                                <Text style={styles.pointValue}>{taxiData.drop}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Ionicons name="resize" size={18} color="#666" />
                            <Text style={styles.statText}>{taxiData.distance}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Ionicons name="time-outline" size={18} color="#666" />
                            <Text style={styles.statText}>{taxiData.duration}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Estimated Price</Text>
                        <Text style={styles.priceValue}>₹{taxiData.priceMin} - ₹{taxiData.priceMax}</Text>
                    </View>

                    <View style={styles.paymentModeRow}>
                        <Ionicons name="card-outline" size={18} color="#666" />
                        <Text style={styles.paymentModeText}>Payment Mode: Online / Cash</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRide}>
                    <Text style={styles.confirmButtonText}>Confirm Ride</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { padding: 20, paddingTop: Platform.OS === 'ios' ? 50 : 40, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15 },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
            android: { elevation: 5 }
        })
    },
    rideIdBadge: {
        backgroundColor: '#E3F2FD',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10
    },
    rideIdText: { color: '#4A90E2', fontWeight: 'bold', fontSize: 12 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    statusLabel: { color: '#666', fontSize: 14 },
    statusValue: { color: '#F39C12', fontWeight: 'bold', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
    typeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    typeIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#F0F4F8',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    typeName: { fontSize: 18, fontWeight: 'bold', color: '#1E3A5F' },
    typeSeats: { fontSize: 12, color: '#666' },
    routeContainer: { marginVertical: 10 },
    routePoint: { flexDirection: 'row', alignItems: 'flex-start' },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4A90E2', marginTop: 5, marginRight: 15 },
    pointLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase' },
    pointValue: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 2 },
    timeBuffer: { fontSize: 12, color: '#4CAF50', marginTop: 2, fontWeight: '500' },
    routeLine: { width: 2, height: 30, backgroundColor: '#D1D9E6', marginLeft: 4, marginVertical: 2 },
    statsRow: { flexDirection: 'row', marginTop: 15 },
    statBox: { flexDirection: 'row', alignItems: 'center', marginRight: 20, backgroundColor: '#F8F9FA', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    statText: { fontSize: 13, color: '#666', marginLeft: 5 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    priceLabel: { fontSize: 16, color: '#666' },
    priceValue: { fontSize: 20, fontWeight: 'bold', color: '#27AE60' },
    paymentModeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
    paymentModeText: { fontSize: 13, color: '#666', marginLeft: 8 },
    confirmButton: {
        backgroundColor: '#4A90E2',
        marginTop: 25,
        padding: 18,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
            android: { elevation: 8 }
        })
    },
    confirmButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
