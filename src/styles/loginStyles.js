import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  
  // Header Section
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taxiIcon: {
    marginLeft: -8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
    letterSpacing: 0.5,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  heroButtons: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    maxWidth: 280,
    marginBottom: 12,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginTextButton: {
    paddingVertical: 8,
  },
  loginTextButtonText: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: '500',
  },

  // Login Card
  loginCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loginCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 6,
    textAlign: 'center',
  },
  loginCardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },

  // Input Fields
  inputContainer: {
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -5,
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },

  // Sign In Button
  signInButton: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },

  // Demo Accounts Section
  demoSection: {
    marginTop: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  demoAccounts: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
  },
  demoAccountItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  demoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    width: 70,
  },
  demoValue: {
    fontSize: 13,
    color: '#1E3A5F',
    fontWeight: '600',
    flex: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

