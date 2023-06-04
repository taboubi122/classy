import 'package:flutter/material.dart';
import 'package:shop_app/components/joursMenu.dart';
import 'package:shop_app/screens/reservation/components/calendrier.dart';
import 'package:shop_app/screens/reservation/components/prestation.dart';
import 'package:shop_app/screens/seeMoreCentre/seeMoreCentre.dart';

import '../../../components/categories_menu.dart';
import '../../../size_config.dart';

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
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
                  spreadRadius: 2,
                  blurRadius: 5,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: prestation(refCentre: refCentre, nomService: nomService),
          ),
          SizedBox(height: 12),
          Container(
            color: const Color.fromARGB(100, 236, 236, 236),
            child: Padding(
              padding: EdgeInsets.all(0),
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  primary: Colors.black, // Fond blanc
                  onPrimary: Colors.white, // Texte noir
                  shape: const RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.zero, // Supprimer le borderRadius
                  ),
                ),
                child: const Row(
                  mainAxisAlignment:
                      MainAxisAlignment.center, // Centrer le contenu
                  children: [
                    Icon(
                      Icons.add_circle_outline,
                      size: 14,
                      color: Colors.white,
                    ),
                    SizedBox(
                      width:
                          4, // Espacement horizontal entre l'icône et le texte
                    ),
                    Text(
                      "Ajouter une autre prestation",
                      style: TextStyle(color: Colors.white, fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ),
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
