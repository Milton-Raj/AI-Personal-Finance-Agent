import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';

class ShopService {
  final Dio _dio;

  ShopService(this._dio);

  Future<int> getCoinBalance(int userId) async {
    try {
      final response = await _dio.get('${ApiConstants.baseUrl}/coins/balance/$userId');
      return response.data['balance'] ?? 0;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<dynamic>> getEarnRules() async {
    try {
      final response = await _dio.get('${ApiConstants.baseUrl}/coins/rules');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> redeemItem(int userId, int amount, String itemName) async {
    try {
      await _dio.post(
        '${ApiConstants.baseUrl}/coins/transactions',
        data: {
          'user_id': userId,
          'amount': -amount,
          'transaction_type': 'redemption',
          'description': 'Redeemed $itemName',
        },
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(dynamic error) {
    if (error is DioException) {
      return Exception(error.response?.data['detail'] ?? 'Network error occurred');
    }
    return Exception('An unexpected error occurred');
  }
}
