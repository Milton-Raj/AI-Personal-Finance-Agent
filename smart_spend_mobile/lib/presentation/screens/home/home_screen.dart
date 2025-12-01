import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';
import '../../providers/home_provider.dart';
import '../../providers/profile_provider.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeDataAsync = ref.watch(homeDataProvider);
    final userProfileAsync = ref.watch(userProfileProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome Back,',
                        style: AppTheme.bodyMedium,
                      ),
                      userProfileAsync.when(
                        data: (user) => Text(
                          user.fullName ?? 'User',
                          style: AppTheme.h2,
                        ),
                        loading: () => const SizedBox(
                          width: 100,
                          height: 24,
                          child: LinearProgressIndicator(),
                        ),
                        error: (_, __) => Text('User', style: AppTheme.h2),
                      ),
                    ],
                  ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0),
                  CircleAvatar(
                    backgroundColor: AppTheme.inputBackground,
                    child: IconButton(
                      icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                      onPressed: () {},
                    ),
                  ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0),
                ],
              ),
              const SizedBox(height: 24),

              // Balance Card
              homeDataAsync.when(
                data: (data) {
                  final totalExpense = data['total_monthly_expense'] as double? ?? 0.0;
                  final currencyFormat = NumberFormat.currency(symbol: '₹', decimalDigits: 2);
                  
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primary.withValues(alpha: 0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Monthly Expense',
                          style: AppTheme.bodyMedium.copyWith(color: Colors.white70),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          currencyFormat.format(totalExpense),
                          style: AppTheme.h1.copyWith(color: Colors.white),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildBalanceItem(
                              icon: Icons.arrow_downward,
                              label: 'Top Category',
                              amount: (data['top_categories'] as List).isNotEmpty
                                  ? (data['top_categories'] as List)[0]['name']
                                  : 'N/A',
                              color: Colors.white,
                            ),
                            Container(height: 40, width: 1, color: Colors.white24),
                            _buildBalanceItem(
                              icon: Icons.arrow_upward,
                              label: 'Subscriptions',
                              amount: (data['recent_subscriptions'] as List).length.toString(),
                              color: Colors.white,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0);
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.error.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Text('Error loading data: $e', style: AppTheme.bodyMedium),
                ),
              ),
              const SizedBox(height: 32),

              // Quick Actions
              Text('Quick Actions', style: AppTheme.h3)
                  .animate()
                  .fadeIn(delay: 700.ms)
                  .slideX(begin: -0.2, end: 0),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildQuickAction(
                    icon: Icons.send,
                    label: 'Transfer',
                    color: const Color(0xFF6C63FF),
                    onTap: () {},
                  ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.2, end: 0),
                  _buildQuickAction(
                    icon: Icons.payment,
                    label: 'Pay Bill',
                    color: const Color(0xFF03DAC6),
                    onTap: () {},
                  ).animate().fadeIn(delay: 900.ms).slideY(begin: 0.2, end: 0),
                  _buildQuickAction(
                    icon: Icons.add_circle_outline,
                    label: 'Top Up',
                    color: const Color(0xFFFFD700),
                    onTap: () {},
                  ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.2, end: 0),
                  _buildQuickAction(
                    icon: Icons.more_horiz,
                    label: 'More',
                    color: const Color(0xFFFF6B6B),
                    onTap: () {},
                  ).animate().fadeIn(delay: 1100.ms).slideY(begin: 0.2, end: 0),
                ],
              ),
              const SizedBox(height: 32),

              // Recent Transactions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Recent Transactions', style: AppTheme.h3)
                      .animate()
                      .fadeIn(delay: 1200.ms)
                      .slideX(begin: -0.2, end: 0),
                  TextButton(
                    onPressed: () {},
                    child: const Text('See All'),
                  ).animate().fadeIn(delay: 1300.ms).slideX(begin: 0.2, end: 0),
                ],
              ),
              const SizedBox(height: 16),
              homeDataAsync.when(
                data: (data) {
                  final transactions = data['recent_transactions'] as List;
                  if (transactions.isEmpty) {
                    return const Center(child: Text('No recent transactions'));
                  }
                  return ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: transactions.length,
                    itemBuilder: (context, index) {
                      return _buildTransactionItem(transactions[index])
                          .animate()
                          .fadeIn(delay: (300 + (index * 100)).ms)
                          .slideX(begin: 0.2, end: 0);
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (_, __) => const SizedBox(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBalanceItem({
    required IconData icon,
    required String label,
    required String amount,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white24,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: AppTheme.bodySmall.copyWith(color: Colors.white70),
            ),
            Text(
              amount,
              style: AppTheme.bodyLarge.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.inputBackground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.inputBorder),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: AppTheme.bodySmall),
      ],
    );
  }

  Widget _buildTransactionItem(dynamic transaction) {
    final amount = transaction['amount'] as double;
    final isExpense = true; // For now, assuming all are expenses as per backend
    final currencyFormat = NumberFormat.currency(symbol: '₹', decimalDigits: 2);
    final date = DateTime.parse(transaction['date']);
    final dateFormat = DateFormat('MMM d, h:mm a');

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.inputBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.inputBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isExpense
                  ? AppTheme.error.withValues(alpha: 0.1)
                  : AppTheme.secondary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              isExpense ? Icons.shopping_bag_outlined : Icons.attach_money,
              color: isExpense ? AppTheme.error : AppTheme.secondary,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction['merchant'] ?? 'Unknown',
                  style: AppTheme.bodyLarge.copyWith(fontWeight: FontWeight.bold),
                ),
                Text(
                  dateFormat.format(date),
                  style: AppTheme.bodySmall,
                ),
              ],
            ),
          ),
          Text(
            '${isExpense ? '-' : '+'} ${currencyFormat.format(amount)}',
            style: AppTheme.bodyLarge.copyWith(
              color: isExpense ? AppTheme.error : AppTheme.secondary,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
