import 'package:camera/camera.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final camerasProvider = StateProvider<List<CameraDescription>>((ref) => []);

final cameraControllerProvider = StateNotifierProvider.autoDispose<CameraControllerNotifier, CameraController?>((ref) {
  final cameras = ref.watch(camerasProvider);
  return CameraControllerNotifier(cameras);
});

class CameraControllerNotifier extends StateNotifier<CameraController?> {
  final List<CameraDescription> _cameras;

  CameraControllerNotifier(this._cameras) : super(null);

  Future<void> initialize() async {
    if (_cameras.isEmpty) return;

    final controller = CameraController(
      _cameras.first,
      ResolutionPreset.medium,
      enableAudio: false,
    );

    try {
      await controller.initialize();
      state = controller;
    } catch (e) {
      // Handle error
    }
  }

  @override
  void dispose() {
    state?.dispose();
    super.dispose();
  }
}
