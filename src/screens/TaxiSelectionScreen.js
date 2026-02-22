import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TextInput,
    Alert,
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [distanceKm, setDistanceKm] = useState(0);
    const [durationMins, setDurationMins] = useState(0);

    // Get drop locations based on bus destination city
    // Fallback to Chennai if city not found, or empty array
    const dropOptions = taxiDropLocations[destinationCity] || taxiDropLocations['Chennai'] || [];

    // Calculate distance with Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // radius of earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(1));
    };

    // Update distance when selectedDrop changes
    useEffect(() => {
        if (selectedDrop) {
            // Assume pickup is city center or first predefined location
            const pickupLat = dropOptions[0] ? dropOptions[0].lat : 11.0168;
            const pickupLng = dropOptions[0] ? dropOptions[0].lng : 76.9558;

            const dist = calculateDistance(pickupLat, pickupLng, selectedDrop.lat, selectedDrop.lng);
            setDistanceKm(dist > 0 ? dist : 1.5); // Minimum 1.5km
            setDurationMins(Math.round((dist > 0 ? dist : 1.5) * 3)); // Approx 3 mins per km
        } else {
            setDistanceKm(0);
            setDurationMins(0);
        }
    }, [selectedDrop]);

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            // Append city name for better accuracy if not present
            const query = searchQuery.toLowerCase().includes(destinationCity.toLowerCase())
                ? searchQuery
                : `${searchQuery}, ${destinationCity}`;

            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const newLocation = {
                    id: `custom_${Date.now()}`,
                    name: result.name || searchQuery,
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon) // Nominatim uses 'lon'
                };
                setSelectedDrop(newLocation);
                setSearchQuery('');
            } else {
                Alert.alert("Location Not Found", "Could not find the location. Please try adding more details or check the spelling.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to search location. Please check your internet connection.");
        } finally {
            setIsSearching(false);
        }
    };

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

            <ScrollView style={{ flex: 1, marginTop: -30 }} showsVerticalScrollIndicator={false}>
                <View style={[styles.optionsContainer, { marginTop: 0 }]}>
                    <Text style={styles.sectionTitle}>1. Select Drop Location ({destinationCity})</Text>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={`Search drop location in ${destinationCity}...`}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearchLocation}
                            returnKeyType="search"
                        />
                        {isSearching ? (
                            <ActivityIndicator size="small" color="#4A90E2" style={{ marginLeft: 15, paddingHorizontal: 15 }} />
                        ) : (
                            <TouchableOpacity style={styles.searchButton} onPress={handleSearchLocation}>
                                <Text style={styles.searchButtonText}>Find</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Show custom selected location if one exists that is not in dropOptions */}
                    {selectedDrop && !dropOptions.find(opt => opt.id === selectedDrop.id) && (
                        <View style={styles.customDropSelection}>
                            <View style={styles.customDropInfo}>
                                <Ionicons name="location-sharp" size={20} color="#E74C3C" />
                                <Text style={styles.customDropName} numberOfLines={1}>{selectedDrop.name}</Text>
                            </View>
                            <Text style={styles.customDropDist}>{distanceKm} km</Text>
                        </View>
                    )}

                    <Text style={{ fontSize: 13, color: '#666', marginBottom: 10, marginLeft: 5 }}>Or choose popular locations:</Text>
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
            </ScrollView>
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
    confirmText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', borderRadius: 12, marginBottom: 15, paddingHorizontal: 10, borderWidth: 1, borderColor: '#D1D9E6' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#333' },
    searchButton: { backgroundColor: '#4A90E2', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginLeft: 10 },
    searchButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    customDropSelection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#4A90E2' },
    customDropInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
    customDropName: { marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: '#1E3A5F', flex: 1 },
    customDropDist: { fontSize: 13, fontWeight: 'bold', color: '#4A90E2', minWidth: 50, textAlign: 'right' }
});
