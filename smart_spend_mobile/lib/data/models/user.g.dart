// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
  id: (json['id'] as num).toInt(),
  email: json['email'] as String,
  fullName: json['full_name'] as String,
  phone: json['phone'] as String?,
  profileImage: json['profile_image'] as String?,
  dob: json['dob'] as String?,
  monthlyIncome: (json['monthly_income'] as num?)?.toDouble(),
  currency: json['currency'] as String,
  isPremiumMember: json['is_premium_member'] as bool,
  createdAt: json['created_at'] as String,
);

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'full_name': instance.fullName,
  'phone': instance.phone,
  'profile_image': instance.profileImage,
  'dob': instance.dob,
  'monthly_income': instance.monthlyIncome,
  'currency': instance.currency,
  'is_premium_member': instance.isPremiumMember,
  'created_at': instance.createdAt,
};
