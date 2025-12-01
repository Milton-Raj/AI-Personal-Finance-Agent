class ApiConstants {
  // Base URL for the backend API
  // Use 10.0.2.2 for Android Emulator to access localhost
  // Use 127.0.0.1 or localhost for iOS Simulator
  static const String baseUrl = 'http://127.0.0.1:8002';
  
  // Auth Endpoints
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String logout = '$baseUrl/auth/logout';
  
  // Profile Endpoints
  static const String profile = '$baseUrl/profile';
  static const String profileImage = '$baseUrl/profile/image';
  static const String upgradeMembership = '$baseUrl/profile/upgrade-membership';
  static const String premiumStatus = '$baseUrl/profile/premium-status';
  
  // Payment Methods
  static const String paymentMethods = '$baseUrl/payment-methods';
  static const String initiatePayment = '$baseUrl/profile/payment/initiate';
  static const String verifyPayment = '$baseUrl/profile/payment/verify';
  
  // Mobile Specific
  static const String home = '$baseUrl/mobile/home';
  static const String processSms = '$baseUrl/mobile/sms/process';
}
