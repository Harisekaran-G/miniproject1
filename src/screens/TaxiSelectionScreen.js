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
import { taxiDropLocations } from '../data/taxiLocations';

const { width } = Dimensions.get('window');

export default function TaxiSelectionScreen({ route, navigation }) {
    const {
        busDropPoint,
        busArrivalTime,
        destinationCity,
        busDetails
    } = route.params;

    const [selectedTaxi, setSelectedTaxi] = useState(null);
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [mapLoading, setMapLoading] = useState(true);

    // Get drop locations based on bus destination city
    // Fallback to Chennai if city not found, or empty array
    const dropOptions = taxiDropLocations[destinationCity] || taxiDropLocations['Chennai'] || [];

    // Simulated stats based on selection
    const distanceKm = selectedDrop ? 8.5 : 0;
    const durationMins = selectedDrop ? 25 : 0;

    const taxiOptions = [
        {
            id: 'mini',
            name: 'Mini',
            capacity: '4 seats',
            baseRate: 20,
            icon: 'car',
            eta: '5 mins',
        },
        {
            id: 'sedan',
            name: 'Sedan',
            capacity: '4 seats',
            baseRate: 25,
            icon: 'car-sport',
            eta: '4 mins',
        },
        {
            id: 'suv',
            name: 'SUV',
            capacity: '6 seats',
            baseRate: 35,
            icon: 'bus',
            eta: '8 mins',
        },
        {
            id: 'bike',
            name: 'Bike',
            capacity: '1 seat',
            baseRate: 10,
            icon: 'bicycle',
            eta: '2 mins',
        },
    ];

    const calculatePrice = (baseRate) => {
        if (!selectedDrop) return { min: 0, max: 0, display: 'Select Drop' };
        const price = Math.round(distanceKm * baseRate);
        return {
            min: price,
            max: Math.round(price * 1.05),
            display: `₹${price} - ₹${Math.round(price * 1.05)}`
        };
    };

    const handleConfirm = () => {
        if (!selectedTaxi || !selectedDrop) {
            alert('Please select both a taxi type and a drop location');
            return;
        }

        const taxiFare = Math.round(distanceKm * selectedTaxi.baseRate);

        const taxiData = {
            type: selectedTaxi.name,
            pickup: busDropPoint.name, // Automatically from bus drop point
            drop: selectedDrop.name,
            distance: `${distanceKm} km`,
            duration: `${durationMins} mins`,
            price: taxiFare
        };

        navigation.navigate('Payment', {
            totalFare: busDetails.totalBusFare + taxiFare,
            bookingType: 'hybrid',
            busFare: busDetails.totalBusFare,
            taxiFare,
            taxiDetails: taxiData,
            pendingBookingDetails: {
                ...busDetails,
                taxiDetails: taxiData
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
                    <Text style={styles.headerSubtitle}>Pickup: {busDropPoint?.name} (Locked)</Text>
                </View>
            </LinearGradient>

            <TaxiMap
                dropPoint={busDropPoint ? [13.0827, 80.2707] : [13.0827, 80.2707]} // Placeholder coordinates for busDropPoint marker
                finalDest={selectedDrop ? [selectedDrop.lat, selectedDrop.lng] : (dropOptions[0] ? [dropOptions[0].lat, dropOptions[0].lng] : [13.0827, 80.2707])}
                center={selectedDrop ? [selectedDrop.lat, selectedDrop.lng] : (dropOptions[0] ? [dropOptions[0].lat, dropOptions[0].lng] : [13.0827, 80.2707])}
            />

            <View style={styles.optionsContainer}>
                <Text style={styles.sectionTitle}>1. Select Drop Location ({destinationCity})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {dropOptions.map((loc) => (
                        <TouchableOpacity
                            key={loc.id}
                            style={[styles.dropCard, selectedDrop?.id === loc.id && styles.selectedDropCard]}
                            onPress={() => setSelectedDrop(loc)}
                        >
                            <Ionicons name="location" size={20} color={selectedDrop?.id === loc.id ? '#FFF' : '#4A90E2'} />
                            <Text style={[styles.dropText, selectedDrop?.id === loc.id && { color: '#FFF' }]}>{loc.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>2. Select Taxi Type</Text>
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
                    totalFare: busDetails.totalBusFare + 20,
                    bookingType: 'bus',
                    busFare: busDetails.totalBusFare,
                    taxiFare: 0,
                    convenienceFee: 20,
                    pendingBookingDetails: busDetails
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
    destinationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F4F8',
        padding: 12,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#D1D9E6'
    },
    dropCard: {
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#EEE',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedDropCard: {
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
    },
    dropText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    destinationText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
        color: '#1E3A5F'
    },
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
