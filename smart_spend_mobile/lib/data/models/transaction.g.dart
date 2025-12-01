// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Transaction _$TransactionFromJson(Map<String, dynamic> json) => Transaction(
  id: (json['id'] as num).toInt(),
  userId: (json['user_id'] as num).toInt(),
  amount: (json['amount'] as num).toDouble(),
  categoryId: (json['category_id'] as num).toInt(),
  note: json['note'] as String?,
  date: json['date'] as String,
  type: json['type'] as String,
  createdAt: json['created_at'] as String,
);

Map<String, dynamic> _$TransactionToJson(Transaction instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'amount': instance.amount,
      'category_id': instance.categoryId,
      'note': instance.note,
      'date': instance.date,
      'type': instance.type,
      'created_at': instance.createdAt,
    };
