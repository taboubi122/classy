import 'dart:convert';
import 'dart:typed_data';

class client {
  final String nom;
  final String prenom;
  final Uint8List photo;
  final int CIN;
  final int tel;
  client({
    required this.CIN,
    required this.tel,
    required this.nom,
    required this.prenom,
    required this.photo,
  });

  factory client.fromJson(Map<String, dynamic> json) {
    final photoData = json['photo']['data'] as List<dynamic>;
    final photoBytes = photoData.cast<int>();
    return client(
      nom: json['nom'] as String,
      CIN: json['CIN'] as int,
      tel: json['tel'] as int,
      prenom: json['prenom'] as String,
      photo: Uint8List.fromList(photoBytes),
    );
  }

  static Uint8List convertDataToUint8List(List<int> data) {
    return Uint8List.fromList(data);
  }
}
