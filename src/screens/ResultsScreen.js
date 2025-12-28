import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/resultsStyles';

export default function ResultsScreen({ route, navigation }) {
  const { recommendation, source, destination } = route.params;

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const formatCurrency = (amount) => {
    return `₹${amount}`;
  };

  const OptionCard = ({ title, fare, eta, available, isRecommended, breakdown }) => (
    <View style={[styles.optionCard, isRecommended && styles.recommendedCard]}>
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.recommendedText}>RECOMMENDED</Text>
        </View>
      )}
      
      <View style={styles.optionHeader}>
        <Text style={styles.optionTitle}>{title}</Text>
        {!available && (
          <Text style={styles.unavailableText}>Not Available</Text>
        )}
      </View>

      {available ? (
        <>
          <View style={styles.optionDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{formatTime(eta)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{formatCurrency(fare)}</Text>
            </View>
          </View>

          {breakdown && (
            <View style={styles.breakdownContainer}>
              {breakdown.bus && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Bus:</Text>
                  <Text style={styles.breakdownValue}>
                    Route {breakdown.bus.routeNo} - {formatCurrency(breakdown.bus.fare)} ({formatTime(breakdown.bus.eta)})
                  </Text>
                </View>
              )}
              {breakdown.taxi && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Taxi:</Text>
                  <Text style={styles.breakdownValue}>
                    {formatCurrency(breakdown.taxi.fare)} ({formatTime(breakdown.taxi.eta)})
                  </Text>
                </View>
              )}
              {breakdown.hybrid && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Hybrid:</Text>
                  <Text style={styles.breakdownValue}>
                    Bus: {formatCurrency(breakdown.hybrid.busFare)} + Taxi: {formatCurrency(breakdown.hybrid.taxiFare)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      ) : (
        <Text style={styles.unavailableMessage}>This option is not available for this route</Text>
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>Route Options</Text>
        <View style={styles.routeInfo}>
          <View style={styles.routeItem}>
            <Ionicons name="location" size={16} color="#4A90E2" />
            <Text style={styles.routeText}>{source}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#666" />
          <View style={styles.routeItem}>
            <Ionicons name="location" size={16} color="#E74C3C" />
            <Text style={styles.routeText}>{destination}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recommended Option Highlight */}
        <View style={styles.recommendationBanner}>
          <Ionicons name="bulb" size={24} color="#FFD700" />
          <View style={styles.recommendationTextContainer}>
            <Text style={styles.recommendationTitle}>
              Best Option: {recommendation.recommendedOption}
            </Text>
            <Text style={styles.recommendationSubtitle}>
              {formatCurrency(recommendation.totalFare)} • {formatTime(recommendation.totalETA)}
            </Text>
          </View>
        </View>

        {/* All Options */}
        <View style={styles.optionsContainer}>
          <OptionCard
            title="Bus Only"
            fare={recommendation.allOptions.busOnly.fare}
            eta={recommendation.allOptions.busOnly.eta}
            available={recommendation.allOptions.busOnly.available}
            isRecommended={recommendation.recommendedOption === 'Bus'}
            breakdown={recommendation.breakdown?.bus ? { bus: recommendation.breakdown.bus } : null}
          />

          <OptionCard
            title="Taxi Only"
            fare={recommendation.allOptions.taxiOnly.fare}
            eta={recommendation.allOptions.taxiOnly.eta}
            available={recommendation.allOptions.taxiOnly.available}
            isRecommended={recommendation.recommendedOption === 'Taxi'}
            breakdown={recommendation.breakdown?.taxi ? { taxi: recommendation.breakdown.taxi } : null}
          />

          <OptionCard
            title="Hybrid (Bus + Taxi)"
            fare={recommendation.allOptions.hybrid.fare}
            eta={recommendation.allOptions.hybrid.eta}
            available={recommendation.allOptions.hybrid.available}
            isRecommended={recommendation.recommendedOption === 'Hybrid'}
            breakdown={recommendation.breakdown?.hybrid ? { hybrid: recommendation.breakdown.hybrid } : null}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              Alert.alert(
                'Booking',
                `Booking ${recommendation.recommendedOption} option for ${formatCurrency(recommendation.totalFare)}`
              );
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButtonSecondary}
            onPress={() => navigation.navigate('RouteInput')}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Search Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

