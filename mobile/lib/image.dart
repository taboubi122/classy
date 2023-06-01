import 'dart:convert';
import 'dart:typed_data';

class image {
  final Uint8List src;

  image({
    required this.src,
  });

  factory image.fromJson(Map<String, dynamic> json) {
    final srcData = json['src']['data'] as List<dynamic>;
    final srcBytes = srcData.cast<int>();
    return image(
      src: Uint8List.fromList(srcBytes),
    );
  }

  static Uint8List convertDataToUint8List(List<int> data) {
    return Uint8List.fromList(data);
  }
}
