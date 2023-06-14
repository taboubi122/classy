import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'dart:async';

import 'package:shop_app/salon.dart';

import '../../adresse.dart';
import '../../size_config.dart';

final dio = Dio();

class AutrePrestation extends StatelessWidget {
  final String nomCentre;
  final String nomService;
  const AutrePrestation(
      {Key? key, required this.nomService, required this.nomCentre})
      : super(key: key);
  Future<List<dynamic>> getItems() async {
    try {
      final response = await dio.get(
        'http://${Adresse.adresseIP}:5000/api/getAllpersonnelResv',
        queryParameters: {
          'nomCentre': nomCentre,
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
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(45.0),
        child: AppBar(
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
      ),
      body: Column(
        children: [
          SizedBox(
            height: 10,
          ),
          Padding(
            padding: EdgeInsets.only(
              left: getProportionateScreenWidth(0),
              right: getProportionateScreenWidth(200),
            ),
            child: Text(
              nomCentre,
              style: TextStyle(
                  fontSize: 20, fontFamily: "Times", color: Colors.black),
            ),
          ),
          Divider(),
          Padding(
            padding: EdgeInsets.only(
              left: getProportionateScreenWidth(10),
              right: getProportionateScreenWidth(100),
            ),
            child: const Text(
              "Choix de la Prestation à ajouter",
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
    );
  }
}
