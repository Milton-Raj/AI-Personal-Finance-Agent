import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final int id;
  final String email;
  @JsonKey(name: 'full_name')
  final String fullName;
  final String? phone;
  @JsonKey(name: 'profile_image')
  final String? profileImage;
  final String? dob;
  @JsonKey(name: 'monthly_income')
  final double? monthlyIncome;
  final String currency;
  @JsonKey(name: 'is_premium_member')
  final bool isPremiumMember;
  @JsonKey(name: 'created_at')
  final String createdAt;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    this.profileImage,
    this.dob,
    this.monthlyIncome,
    required this.currency,
    required this.isPremiumMember,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
