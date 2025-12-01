import 'package:json_annotation/json_annotation.dart';

part 'transaction.g.dart';

@JsonSerializable()
class Transaction {
  final int id;
  @JsonKey(name: 'user_id')
  final int userId;
  final double amount;
  @JsonKey(name: 'category_id')
  final int categoryId;
  final String? note;
  final String date;
  final String type; // 'income' or 'expense'
  @JsonKey(name: 'created_at')
  final String createdAt;

  Transaction({
    required this.id,
    required this.userId,
    required this.amount,
    required this.categoryId,
    this.note,
    required this.date,
    required this.type,
    required this.createdAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) => _$TransactionFromJson(json);
  Map<String, dynamic> toJson() => _$TransactionToJson(this);
}
