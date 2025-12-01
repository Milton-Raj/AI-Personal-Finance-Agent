import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import 'storage_service.dart';

class AuthService {
  final Dio _dio;
  final StorageService _storageService;

  AuthService(this._dio, this._storageService);

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post(
        ApiConstants.login,
        queryParameters: {
          'email': email,
          'password': password,
        },
      );

      final data = response.data;
      final token = data['session_token'];
      final user = data['user'];
      
      await _storageService.saveSession(
        token,
        user['id'],
        user['is_premium'] ?? false,
      );

      return data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> register(String name, String email, String password) async {
    try {
      final response = await _dio.post(
        ApiConstants.register,
        queryParameters: {
          'name': name,
          'email': email,
          'password': password,
        },
      );

      final data = response.data;
      final token = data['session_token'];
      final user = data['user'];

      await _storageService.saveSession(
        token,
        user['id'],
        false, // Default to free tier on register
      );

      return data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    try {
      final token = await _storageService.getToken();
      if (token != null) {
        await _dio.post(
          ApiConstants.logout,
          queryParameters: {'session_token': token},
        );
      }
    } catch (e) {
      // Ignore logout errors, just clear local session
    } finally {
      await _storageService.clearSession();
    }
  }

  Exception _handleError(dynamic error) {
    if (error is DioException) {
      return Exception(error.response?.data['detail'] ?? 'Network error occurred');
    }
    return Exception('An unexpected error occurred');
  }
}
