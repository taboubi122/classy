import 'dart:convert';
import 'dart:typed_data';

class salon {
  final String nom;
  final String type;
  final int reference;
  final Uint8List src;

  salon({
    required this.nom,
    required this.type,
    required this.reference,
    required this.src,
  });

  factory salon.fromJson(Map<String, dynamic> json) {
    final srcData = json['src']['data'] as List<dynamic>;
    final srcBytes = srcData.cast<int>();
    return salon(
      nom: json['nom'] as String,
      type: json['type'] as String,
      reference: json['reference'] as int,
      src: Uint8List.fromList(srcBytes),
    );
  }

  static Uint8List convertDataToUint8List(List<int> data) {
    return Uint8List.fromList(data);
  }
}
