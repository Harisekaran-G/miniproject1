import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('passenger'); // 'passenger' or 'operator'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        // Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        if (password && password.length < 6) newErrors.password = 'Password must be at least 6 chars';

        if (!phone.trim()) newErrors.phone = 'Phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        console.log('Signup started');

        // Validate required fields before API call
        if (!name.trim() || !email.trim() || !phone.trim() || !password) {
            console.log('Missing required fields');
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        if (!validate()) return;

        setLoading(true);

        try {
            console.log('Registering user:', { name, email, phone, role });

            const userData = {
                name,
                email,
                password,
                phone,
                role,
            };

            const response = await authAPI.register(userData);
            console.log('Signup success:', response);

            // If we reach here without throwing, the API call succeeded.
            // Show success popup and navigate — regardless of response shape.
            Alert.alert(
                'Success',
                'Account created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form fields
                            setName('');
                            setEmail('');
                            setPhone('');
                            setPassword('');
                            setRole('passenger');

                            // Navigate to Login
                            if (navigation && navigation.navigate) {
                                navigation.navigate('Login');
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.log('Signup error:', error?.response?.data || error?.message || error);
            Alert.alert(
                'Signup Failed',
                error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient colors={['#4A90E2', '#FFFFFF']} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Account</Text>
                </LinearGradient>

                <View style={styles.formContainer}>
                    {/* Role Selection */}
                    <View style={styles.roleContainer}>
                        <Text style={styles.label}>I am a:</Text>
                        <View style={styles.roleButtons}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'passenger' && styles.roleButtonActive]}
                                onPress={() => setRole('passenger')}
                            >
                                <Text style={[styles.roleText, role === 'passenger' && styles.roleTextActive]}>Passenger</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'operator' && styles.roleButtonActive]}
                                onPress={() => setRole('operator')}
                            >
                                <Text style={[styles.roleText, role === 'operator' && styles.roleTextActive]}>Bus Operator</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="john@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1234567890"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Min 6 chars"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.disabledButton]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Sign Up</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                        <Text style={styles.loginLinkText}>Already have an account? Login</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    scrollContent: { flexGrow: 1 },
    header: { padding: 20, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A5F', marginTop: 10 },
    backButton: { position: 'absolute', top: 50, left: 20 },
    formContainer: { padding: 20 },
    label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: '600' },
    inputGroup: { marginBottom: 15 },
    input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
    errorText: { color: 'red', fontSize: 12, marginTop: 4 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12 },
    passwordInput: { flex: 1, paddingVertical: 12 },
    roleContainer: { marginBottom: 20 },
    roleButtons: { flexDirection: 'row', gap: 10, marginTop: 5 },
    roleButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
    roleButtonActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
    roleText: { color: '#666' },
    roleTextActive: { color: '#FFF', fontWeight: 'bold' },
    submitButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    disabledButton: { opacity: 0.7 },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    loginLink: { marginTop: 20, alignItems: 'center' },
    loginLinkText: { color: '#4A90E2', fontSize: 14 },
});
