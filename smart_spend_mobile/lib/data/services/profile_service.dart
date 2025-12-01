import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../models/user.dart';
import '../models/payment_method.dart';

class ProfileService {
  final Dio _dio;

  ProfileService(this._dio);

  Future<User> getProfile(int userId) async {
    try {
      final response = await _dio.get(
        ApiConstants.profile,
        queryParameters: {'user_id': userId},
      );
      return User.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<User> updateProfile(int userId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put(
        ApiConstants.profile,
        queryParameters: {'user_id': userId},
        data: data,
      );
      return User.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<PaymentMethod>> getPaymentMethods(int userId) async {
    try {
      final response = await _dio.get(
        ApiConstants.paymentMethods,
        queryParameters: {'user_id': userId},
      );
      
      return (response.data as List)
          .map((e) => PaymentMethod.fromJson(e))
          .toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<PaymentMethod> addPaymentMethod(int userId, String type, String identifier) async {
    try {
      final response = await _dio.post(
        ApiConstants.paymentMethods,
        queryParameters: {
          'user_id': userId,
          'type': type,
          'identifier': identifier,
        },
      );
      return PaymentMethod.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deletePaymentMethod(int pmId) async {
    try {
      await _dio.delete('${ApiConstants.paymentMethods}/$pmId');
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
