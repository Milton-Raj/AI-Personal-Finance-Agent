import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/services/home_service.dart';
import 'auth_provider.dart';

final homeServiceProvider = Provider<HomeService>((ref) {
  final dio = ref.watch(dioProvider);
  return HomeService(dio);
});

final homeDataProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final authState = ref.watch(authProvider);
  if (!authState.isAuthenticated) {
    throw Exception('Not authenticated');
  }
  
  final storage = ref.watch(storageServiceProvider);
  final userId = await storage.getUserId();
  
  if (userId == null) throw Exception('User ID not found');
  
  final service = ref.watch(homeServiceProvider);
  return service.getHomeData(userId);
});
