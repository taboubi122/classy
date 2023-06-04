import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../../adresse.dart';
import '../../../size_config.dart';

final dio = Dio();

class prestation extends StatelessWidget {
  const prestation({
    Key? key,
    required this.refCentre,
    required this.nomService,
    this.pressOnSeeMore,
  }) : super(key: key);

  final GestureTapCallback? pressOnSeeMore;
  final int refCentre;
  final String nomService;
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

  Future<List<dynamic>> getItem() async {
    try {
      final response = await dio.get(
        'http://${Adresse.adresseIP}:5000/api/getDetailsServiceMobile',
        data: {
          'refCentre': refCentre,
          'nomService': nomService,
        },
      );
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

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
      future: getItem(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Text('No salon data available');
        } else {
          final services = snapshot.data!;
          final serviceItem = services[0];
          return afficherDonneesPrestation(context, serviceItem);
        }
      },
    );
  }

  Widget afficherDonneesPrestation(BuildContext context, dynamic serviceItem) {
    final String duree = serviceItem['duree'];
    final int prix = serviceItem['prix'];

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(
              left: getProportionateScreenWidth(25),
              right: getProportionateScreenWidth(64),
              top: getProportionateScreenWidth(5),
            ),
            child: Wrap(
              spacing: 5,
              children: [
                Text(
                  nomService,
                  style: const TextStyle(
                    fontSize: 13,
                    fontFamily: "Robot",
                    color: Colors.black,
                  ),
                ),
                Icon(Icons.schedule_outlined, size: 13),
                SizedBox(width: 1),
                Text(
                  '${formatDuration(duree)}',
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 13,
                    fontFamily: "Robot",
                  ),
                ),
                SizedBox(width: 4),
                const Icon(Icons.monetization_on_outlined, size: 13),
                SizedBox(width: 1),
                Text(
                  '$prix D',
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 13,
                    fontFamily: "Robot",
                  ),
                ),
              ],
            ),
          ),
          Container(
            color: Colors.white,
            padding: EdgeInsets.only(
              left: getProportionateScreenWidth(25),
              right: getProportionateScreenWidth(64),
              top: getProportionateScreenWidth(1),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    primary: Colors.white, // Background blanc
                    onPrimary: Colors.black, // Texte noir
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(5), // Bordure arrondie
                      side: const BorderSide(
                        color: Colors.black, // Bordure noire
                      ),
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(
                        "Choisir avec qui",
                        style: TextStyle(color: Colors.black, fontSize: 14),
                      ),
                      SizedBox(width: 5),
                      Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: Colors.black,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
