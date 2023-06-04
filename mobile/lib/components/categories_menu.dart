import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/screens/reservation/reservation.dart';

import '../adresse.dart';

class CategorieMenu extends StatefulWidget {
  const CategorieMenu({
    Key? key,
    required this.text,
    required this.refCateg,
    required this.refCentre,
    required this.nomCentre,
  }) : super(key: key);

  final String text;
  final String nomCentre;
  final int refCateg;
  final int refCentre;

  @override
  _CategorieMenuState createState() => _CategorieMenuState();
}

final dio = Dio();

class _CategorieMenuState extends State<CategorieMenu> {
  bool isExpanded = false;
  Future<List<dynamic>> getItem() async {
    try {
      final response = await dio
          .get('http://${Adresse.adresseIP}:5000/api/getServiceMobile', data: {
        'refCentre': widget.refCentre,
        'refCateg': widget.refCateg,
      });
      final dynamic data = response.data;
      print(data);
      if (data != null) {
        return data as List<dynamic>;
      } else {
        throw Exception('No data available.');
      }
    } catch (e) {
      throw Exception('Failed to get item: $e');
    }
  }

  String formatDuration(String duration) {
    final parts = duration.split(':');
    final hours = int.parse(parts[0]);
    final minutes = int.parse(parts[1]);
    final seconds = int.parse(parts[2]);

    if (hours > 0) {
      return '$hours h';
    } else if (minutes > 0) {
      return '$minutes min';
    } else {
      return '$seconds s';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 1, vertical: 10),
      child: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 2,
              blurRadius: 5,
              offset: Offset(0, 2), // décalage de l'ombre
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              color: Colors.white, // Arrière-plan noir
              child: TextButton(
                style: TextButton.styleFrom(
                  padding: EdgeInsets.all(10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0),
                  ),
                  backgroundColor: Colors.white,
                ),
                onPressed: () {
                  setState(() {
                    isExpanded = !isExpanded;
                  });
                },
                child: Row(
                  children: [
                    const SizedBox(width: 20),
                    Expanded(
                      child: Text(
                        widget.text,
                        style: TextStyle(color: Colors.black),
                      ),
                    ),
                    SizedBox(width: 60),
                    const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: Colors.black,
                    ),
                  ],
                ),
              ),
            ),
            if (isExpanded)
              FutureBuilder<List<dynamic>>(
                future: getItem(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return CircularProgressIndicator();
                  } else if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Text('No salon data available');
                  } else {
                    final service = snapshot.data!;
                    return Container(
                      color: Colors.white, // Arrière-plan noir
                      padding: EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          for (var servItem in service)
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  height: 1, // Hauteur personnalisée du Divider
                                  width: MediaQuery.of(context)
                                      .size
                                      .width, // Largeur de l'écran
                                  color: const Color.fromARGB(
                                          255, 134, 134, 134)
                                      .withOpacity(
                                          0.2), // Couleur personnalisée plus claire
                                ),
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            servItem['nomService'],
                                            style: const TextStyle(
                                                color: Colors.black,
                                                fontSize: 12),
                                          ),
                                          const SizedBox(height: 3),
                                          Text(
                                            servItem['description'],
                                            style: const TextStyle(
                                                color: Colors.grey,
                                                fontSize: 12),
                                          ),
                                          Text(
                                            '${formatDuration(servItem['duree'])}   ${servItem['prix']} D',
                                            style: const TextStyle(
                                                color: Colors.black,
                                                fontSize: 12),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    ElevatedButton(
                                      onPressed: () {
                                        Navigator.pushNamed(
                                          context,
                                          reservation.routeName,
                                          arguments: salonReservation(
                                            refCentre: servItem['refCentre'],
                                            nomService: servItem['nomService'],
                                            nomCentre: widget.nomCentre,
                                          ),
                                        );
                                      },
                                      style: ElevatedButton.styleFrom(
                                        minimumSize: const Size(
                                            50, 20), // Taille minimale de 50x20
                                        primary:
                                            Colors.white, // Background blanc
                                        onPrimary: Colors.black, // Texte noir
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                              5), // Bordure arrondie
                                          side: const BorderSide(
                                              color: Colors
                                                  .black), // Bordure noire
                                        ),
                                      ),
                                      child: Text(
                                        "Choisir",
                                        style: TextStyle(
                                            color: Colors.black, fontSize: 9),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                              ],
                            ),
                        ],
                      ),
                    );
                  }
                },
              ),
          ],
        ),
      ),
    );
  }
}
