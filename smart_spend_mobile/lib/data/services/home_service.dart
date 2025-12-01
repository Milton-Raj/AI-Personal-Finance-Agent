import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';

class HomeService {
  final Dio _dio;

  HomeService(this._dio);

  Future<Map<String, dynamic>> getHomeData(int userId) async {
    try {
      final response = await _dio.get(
        ApiConstants.home,
        queryParameters: {'user_id': userId},
      );
      return response.data;
    } catch (e) {
      // If mobile/home endpoint is not ready, fallback to fetching profile + transactions separately
      // For now, rethrow
      rethrow;
    }
  }
}
