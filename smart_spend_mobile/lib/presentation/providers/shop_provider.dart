import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/services/shop_service.dart';
import 'auth_provider.dart';

final shopServiceProvider = Provider<ShopService>((ref) {
  final dio = ref.watch(dioProvider);
  return ShopService(dio);
});

final coinBalanceProvider = FutureProvider<int>((ref) async {
  final authState = ref.watch(authProvider);
  if (!authState.isAuthenticated) {
    throw Exception('Not authenticated');
  }
  
  final storage = ref.watch(storageServiceProvider);
  final userId = await storage.getUserId();
  
  if (userId == null) throw Exception('User ID not found');
  
  final service = ref.watch(shopServiceProvider);
  return service.getCoinBalance(userId);
});

final earnRulesProvider = FutureProvider<List<dynamic>>((ref) async {
  final service = ref.watch(shopServiceProvider);
  return service.getEarnRules();
});
