import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function BoardingDroppingScreen({ route, navigation }) {
    const {
        busId,
        routeNo,
        source,
        destination,
        departureTime,
        arrivalTime,
        price,
        selectedSeats,
        totalBusFare,
        journeyDate,
        busType,
        operatorName
    } = route.params;

    const [activeTab, setActiveTab] = useState('boarding');
    const [selectedBoarding, setSelectedBoarding] = useState(null);
    const [selectedDropping, setSelectedDropping] = useState(null);
    const [showTaxiModal, setShowTaxiModal] = useState(false);

    const boardingPoints = [
        { id: '1', name: `${source} Main Stand`, time: departureTime },
        { id: '2', name: `${source} Bypass`, time: '09:30' },
        { id: '3', name: 'SRM University', time: '09:45' },
    ];

    const droppingPoints = [
        { id: 'd1', name: `${destination} City Center`, time: arrivalTime },
        { id: 'd2', name: `${destination} Bypass`, time: '19:30' },
        { id: 'd3', name: 'Gandhipuram BS', time: '20:00' },
    ];

    const handleNext = () => {
        if (!selectedBoarding || !selectedDropping) {
            alert('Please select both boarding and dropping points');
            return;
        }

        // Navigate directly to TaxiSelection Screen
        navigation.navigate('TaxiSelection', {
            busDropPoint: selectedDropping,
            busArrivalTime: arrivalTime,
            destinationCity: destination,
            busDetails: {
                busId,
                routeNo,
                source,
                destination,
                journeyDate,
                busType,
                operatorName,
                departureTime,
                arrivalTime,
                price,
                selectedSeats,
                totalBusFare,
                boardingPoint: selectedBoarding,
                droppingPoint: selectedDropping
            }
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Boarding & Dropping</Text>
            </LinearGradient>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'boarding' && styles.activeTab]}
                    onPress={() => setActiveTab('boarding')}
                >
                    <Text style={[styles.tabText, activeTab === 'boarding' && styles.activeTabText]}>Boarding Point</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'dropping' && styles.activeTab]}
                    onPress={() => setActiveTab('dropping')}
                >
                    <Text style={[styles.tabText, activeTab === 'dropping' && styles.activeTabText]}>Dropping Point</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'boarding' ? (
                    boardingPoints.map((point) => (
                        <TouchableOpacity
                            key={point.id}
                            style={[styles.pointItem, selectedBoarding?.id === point.id && styles.selectedPoint]}
                            onPress={() => setSelectedBoarding(point)}
                        >
                            <View>
                                <Text style={styles.pointName}>{point.name}</Text>
                                <Text style={styles.pointTime}>{point.time}</Text>
                            </View>
                            {selectedBoarding?.id === point.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    droppingPoints.map((point) => (
                        <TouchableOpacity
                            key={point.id}
                            style={[styles.pointItem, selectedDropping?.id === point.id && styles.selectedPoint]}
                            onPress={() => setSelectedDropping(point)}
                        >
                            <View>
                                <Text style={styles.pointName}>{point.name}</Text>
                                <Text style={styles.pointTime}>{point.time}</Text>
                            </View>
                            {selectedDropping?.id === point.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15 },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
    tab: { flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#4A90E2' },
    tabText: { color: '#666', fontWeight: '500' },
    activeTabText: { color: '#4A90E2' },
    content: { flex: 1, padding: 15 },
    pointItem: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE'
    },
    selectedPoint: { borderColor: '#4A90E2', backgroundColor: '#E3F2FD' },
    pointName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    pointTime: { color: '#666', marginTop: 4 },
    nextButton: {
        backgroundColor: '#4A90E2',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    nextButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 30,
        borderRadius: 20,
        width: '85%',
        alignItems: 'center'
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 15, color: '#333' },
    modalText: { textAlign: 'center', marginTop: 10, color: '#666', fontSize: 16 },
    taxiPrice: { fontSize: 18, color: '#27AE60', fontWeight: 'bold', marginTop: 10 },
    modalButtons: { flexDirection: 'row', marginTop: 25, width: '100%' },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    skipButton: { backgroundColor: '#EEE', marginRight: 10 },
    skipButtonText: { color: '#666', fontWeight: 'bold' },
    addTaxiButton: { backgroundColor: '#4A90E2' },
    addTaxiButtonText: { color: '#FFF', fontWeight: 'bold' }
});
