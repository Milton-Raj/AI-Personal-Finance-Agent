import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/user.dart';
import '../../data/models/payment_method.dart';
import '../../data/services/profile_service.dart';
import 'auth_provider.dart';

final profileServiceProvider = Provider<ProfileService>((ref) {
  final dio = ref.watch(dioProvider);
  return ProfileService(dio);
});

final userProfileProvider = FutureProvider<User>((ref) async {
  final authState = ref.watch(authProvider);
  if (!authState.isAuthenticated) {
    throw Exception('Not authenticated');
  }
  
  final storage = ref.watch(storageServiceProvider);
  final userId = await storage.getUserId();
  
  if (userId == null) throw Exception('User ID not found');
  
  final service = ref.watch(profileServiceProvider);
  return service.getProfile(userId);
});

final paymentMethodsProvider = FutureProvider<List<PaymentMethod>>((ref) async {
  final authState = ref.watch(authProvider);
  if (!authState.isAuthenticated) {
    throw Exception('Not authenticated');
  }
  
  final storage = ref.watch(storageServiceProvider);
  final userId = await storage.getUserId();
  
  if (userId == null) throw Exception('User ID not found');
  
  final service = ref.watch(profileServiceProvider);
  return service.getPaymentMethods(userId);
});
