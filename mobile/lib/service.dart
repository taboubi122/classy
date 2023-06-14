import 'dart:convert';
import 'dart:ffi';
import 'dart:typed_data';

class salon {
  final String nom;
  final String type;
  final int reference;
  final int refCentre;
  final int resvREF;
  final Uint8List src;
  final String nomService;
  final String duree;
  final int prix;
  final String startDateResv;
  final String endDateResv;
  salon({
    required this.nomService,
    required this.duree,
    required this.prix,
    required this.startDateResv,
    required this.endDateResv,
    required this.nom,
    required this.type,
    required this.reference,
    required this.refCentre,
    required this.resvREF,
    required this.src,
  });

  factory salon.fromJson(Map<String, dynamic> json) {
    final srcData = json['src']['data'] as List<dynamic>;
    final srcBytes = srcData.cast<int>();
    return salon(
      nom: json['nom'] as String,
      type: json['type'] as String,
      reference: json['reference'] as int,
      refCentre: json['refCentre'] as int,
      resvREF: json['resvREF'] as int,
      nomService: json['nomService'] as String,
      duree: json['duree'] as String,
      prix: json['prix'] as int,
      startDateResv: json['startDateResv'] as String,
      endDateResv: json['endDateResv'] as String,
      src: Uint8List.fromList(srcBytes),
    );
  }

  static Uint8List convertDataToUint8List(List<int> data) {
    return Uint8List.fromList(data);
  }
}
