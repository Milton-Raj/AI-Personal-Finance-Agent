import 'package:json_annotation/json_annotation.dart';

part 'payment_method.g.dart';

@JsonSerializable()
class PaymentMethod {
  final int id;
  @JsonKey(name: 'user_id')
  final int userId;
  final String type; // 'upi', 'card', 'bank'
  final String identifier;
  final String? name;
  @JsonKey(name: 'is_default')
  final bool isDefault;

  PaymentMethod({
    required this.id,
    required this.userId,
    required this.type,
    required this.identifier,
    this.name,
    required this.isDefault,
  });

  factory PaymentMethod.fromJson(Map<String, dynamic> json) => _$PaymentMethodFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentMethodToJson(this);
}
