class salon {
  final int reference;
  final String nom;
  final String adresse;
  final double latitude;
  final double longitude;

  salon({
    required this.nom,
    required this.reference,
    required this.longitude,
    required this.latitude,
    required this.adresse,
  });

  factory salon.fromJson(Map<String, dynamic> json) {
    return salon(
      nom: json['nom'] as String,
      reference: json['reference'] as int,
      adresse: json['adresse'] as String,
      latitude: json['latitude'] as double,
      longitude: json['longitude'] as double,
    );
  }
}
