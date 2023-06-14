import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/components/joursMenu.dart';
import 'package:shop_app/screens/reservation/components/calendrier.dart';
import 'package:shop_app/screens/reservation/components/prestation.dart';
import 'package:shop_app/screens/seeMoreCentre/seeMoreCentre.dart';

import '../../../adresse.dart';
import '../../../components/categories_menu.dart';
import '../../../size_config.dart';

final dio = Dio();

class Body extends StatelessWidget {
  final String nomService;
  final String nomCentre;
  final int refCentre;

  Body(
      {Key? key,
      required this.refCentre,
      required this.nomService,
      required this.nomCentre})
      : super(key: key);

  Future<void> Insert(param1) async {
    final DateTime formattedDateTime = DateTime.utc(
      param1.year,
      param1.month,
      param1.day,
      param1.hour,
      param1.minute,
      param1.second,
    );
    DateTime selectDateTime =
        DateTime.parse(formattedDateTime.toString().replaceAll(' ', 'T'));
    print(selectDateTime);

    try {
      final response = await dio.post(
        'http://${Adresse.adresseIP}:5000/api/addResvPerso',
        data: {
          'nomService': nomService,
          'nomSalon': nomCentre,
          'selectedTime': selectDateTime.toIso8601String(),
          'cinClient': 17124618,
          'cinPersonnel': 7845152,
        },
      );

      print('Insert success');
    } catch (err) {
      print(err);
      print('Insert failed');
    }
  }

  void HandleResv(DateTime param1) {
    Insert(param1);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        centerTitle: true,
        elevation: 3,
        title: const Text(
          "Prendre RDV",
          style: TextStyle(
            color: Color.fromARGB(255, 15, 15, 15),
            fontSize: 14,
          ),
        ),
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.black,
            size: 20,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: ListView(
        children: [
          Container(
            color: Color.fromARGB(67, 236, 236, 236),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: getProportionateScreenWidth(25),
                    vertical: getProportionateScreenWidth(6),
                  ),
                  child: Text(
                    nomCentre,
                    style: TextStyle(
                        fontSize: 20, fontFamily: "Times", color: Colors.black),
                  ),
                ),
                const Divider(),
                Padding(
                  padding: EdgeInsets.only(
                    left: getProportionateScreenWidth(25),
                    right: getProportionateScreenWidth(64),
                  ),
                  child: const Text(
                    "1. Prestation sélectionnée",
                    style: TextStyle(
                      fontSize: 16,
                      fontFamily: "Robot",
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          prestation(
              refCentre: refCentre,
              nomService: nomService,
              nomCentre: nomCentre),
          SizedBox(height: 12),
          Container(
            color: const Color.fromARGB(100, 236, 236, 236),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: EdgeInsets.only(
                    left: getProportionateScreenWidth(25),
                    right: getProportionateScreenWidth(64),
                  ),
                  child: const Text(
                    "2. Choix de la date & heure",
                    style: TextStyle(
                      fontSize: 16,
                      fontFamily: "Robot",
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Calendrier(
                    onReservation: (param1) => HandleResv(param1),
                    nomService: nomService,
                    nomCentre: nomCentre,
                    refCentre: refCentre),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
