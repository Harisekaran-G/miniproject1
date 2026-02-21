import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import TaxiMap from '../components/TaxiMap';

const { width } = Dimensions.get('window');

export default function TaxiSelectionScreen({ route, navigation }) {
    const {
        busId,
        routeNo,
        source,
        destination,
        departureTime,
        arrivalTime,
        price: busPrice,
        selectedSeats,
        totalBusFare,
        boardingPoint,
        droppingPoint,
    } = route.params;

    const [selectedTaxi, setSelectedTaxi] = useState(null);
    const [mapLoading, setMapLoading] = useState(true);

    // Simulated Distance (8.5 km)
    const distanceKm = 8.5;

    const taxiOptions = [
        {
            id: 'mini',
            name: 'Mini',
            capacity: '4 seats',
            baseRate: 20,
            icon: 'car',
            eta: '5 mins',
            dropEta: '20 mins',
        },
        {
            id: 'sedan',
            name: 'Sedan',
            capacity: '4 seats',
            baseRate: 25,
            icon: 'car-sport',
            eta: '4 mins',
            dropEta: '18 mins',
        },
        {
            id: 'suv',
            name: 'SUV',
            capacity: '6 seats',
            baseRate: 35,
            icon: 'bus',
            eta: '8 mins',
            dropEta: '25 mins',
        },
        {
            id: 'bike',
            name: 'Bike',
            capacity: '1 seat',
            baseRate: 10,
            icon: 'bicycle',
            eta: '2 mins',
            dropEta: '15 mins',
        },
    ];

    const calculatePrice = (baseRate) => {
        const price = Math.round(distanceKm * baseRate);
        // Return a range string
        return {
            min: price,
            max: Math.round(price * 1.05),
            display: `₹${price} - ₹${Math.round(price * 1.05)}`
        };
    };

    const handleConfirm = () => {
        const taxiFare = selectedTaxi ? Math.round(distanceKm * selectedTaxi.baseRate) : 0;
        const convenienceFee = 20;
        const totalFare = totalBusFare + taxiFare + convenienceFee;

        navigation.navigate('Payment', {
            totalFare,
            bookingType: selectedTaxi ? 'hybrid' : 'bus',
            busFare: totalBusFare,
            taxiFare,
            convenienceFee,
            pendingBookingDetails: {
                busId,
                routeNo,
                source,
                destination,
                seats: selectedSeats,
                departureTime,
                arrivalTime,
                price: busPrice,
                boardingPoint,
                droppingPoint,
                taxiDetails: selectedTaxi ? { ...selectedTaxi, fare: taxiFare, distance: distanceKm } : null,
            }
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Select Your Ride</Text>
                    <Text style={styles.headerSubtitle}>From: {droppingPoint?.name}</Text>
                </View>
            </LinearGradient>

            <TaxiMap
                dropPoint={[13.0827, 80.2707]}
                finalDest={[12.9801, 80.2224]}
            />

            <View style={styles.optionsContainer}>
                <Text style={styles.sectionTitle}>Available Taxis</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                    {taxiOptions.map((option) => {
                        const priceRange = calculatePrice(option.baseRate);
                        const isSelected = selectedTaxi?.id === option.id;

                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[styles.optionCard, isSelected && styles.selectedCard]}
                                onPress={() => setSelectedTaxi(option)}
                            >
                                <View style={[styles.optionIconContainer, { backgroundColor: isSelected ? '#FFF' : '#F0F4F8' }]}>
                                    <Ionicons name={option.icon} size={32} color={isSelected ? '#4A90E2' : '#333'} />
                                </View>
                                <Text style={[styles.optionName, isSelected && styles.selectedText]}>{option.name}</Text>
                                <Text style={styles.optionCapacity}>{option.capacity}</Text>
                                <Text style={[styles.optionPrice, isSelected && styles.selectedText]}>{priceRange.display}</Text>
                                <View style={styles.etaContainer}>
                                    <Ionicons name="time-outline" size={12} color="#666" />
                                    <Text style={styles.etaText}>{option.eta}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Payment', {
                    totalFare: totalBusFare + 20,
                    bookingType: 'bus',
                    busFare: totalBusFare,
                    taxiFare: 0,
                    convenienceFee: 20,
                    pendingBookingDetails: {
                        busId, routeNo, source, destination, seats: selectedSeats,
                        departureTime, arrivalTime, price: busPrice, boardingPoint, droppingPoint
                    }
                })}>
                    <Text style={styles.skipText}>Skip Taxi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.confirmButton, !selectedTaxi && styles.disabledButton]}
                    onPress={handleConfirm}
                    disabled={!selectedTaxi}
                >
                    <Text style={styles.confirmText}>Confirm Ride</Text>
                    {selectedTaxi && <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { padding: 20, paddingTop: 45, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    headerSubtitle: { color: '#E3F2FD', fontSize: 13, marginTop: 2 },
    mapContainer: { flex: 1, overflow: 'hidden' },
    map: { flex: 1 },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
    optionsContainer: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, elevation: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    optionsScroll: { flexDirection: 'row' },
    optionCard: {
        width: 120,
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 20,
        marginRight: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    selectedCard: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
    optionIconContainer: { padding: 10, borderRadius: 50, marginBottom: 8 },
    optionName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    optionCapacity: { fontSize: 11, color: '#666', marginBottom: 5 },
    optionPrice: { fontWeight: 'bold', color: '#27AE60', fontSize: 13 },
    selectedText: { color: '#FFF' },
    etaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    etaText: { fontSize: 10, color: '#666', marginLeft: 3 },
    footer: { padding: 20, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEE', alignItems: 'center' },
    skipButton: { flex: 1, alignItems: 'center' },
    skipText: { color: '#666', fontSize: 16, fontWeight: '500' },
    confirmButton: { flex: 2, backgroundColor: '#4A90E2', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    disabledButton: { backgroundColor: '#CCC' },
    confirmText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
