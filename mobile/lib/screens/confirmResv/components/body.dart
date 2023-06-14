import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shop_app/screens/home/home_screen.dart';
import '../../../adresse.dart';
import '../../../size_config.dart';

final dio = Dio();

class Body extends StatelessWidget {
  Body({
    Key? key,
    required this.refCentre,
    required this.nomService,
    required this.nomCentre,
    this.pressOnSeeMore,
  }) : super(key: key);

  final GestureTapCallback? pressOnSeeMore;
  final int refCentre;
  final String nomService;
  final String nomCentre;
  late String selectedPerso = '';
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

  Future<void> Insert() async {
    try {
      final response = await dio
          .post('http://${Adresse.adresseIP}:5000/api/addResvPerso', data: {
        'email': nomCentre,
        'password': nomService,
      });
      print('insert success');
    } catch (err) {
      print(err);
      print('Login failed');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
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
        child: Padding(
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
                  fontFamily: "Roboto",
                  color: Colors.black,
                ),
              ),
              Icon(Icons.schedule_outlined, size: 13),
              SizedBox(width: 1),
              Text(
                nomCentre,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 13,
                  fontFamily: "Roboto",
                ),
              ),
              SizedBox(width: 4),
              const Icon(Icons.monetization_on_outlined, size: 13),
              SizedBox(width: 1),
              Text(
                nomService,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 13,
                  fontFamily: "Roboto",
                ),
              ),
            ],
          ),
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
                primary: Colors.white,
                onPrimary: Colors.black,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5),
                  side: const BorderSide(
                    color: Colors.black,
                  ),
                ),
              ),
              child: const Row(
                children: [
                  SizedBox(width: 5),
                ],
              ),
            ),
          ],
        ),
      ),
      SizedBox(height: 12),
      Container(
        color: const Color.fromARGB(100, 236, 236, 236),
        child: Padding(
            padding: EdgeInsets.all(0),
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                primary: Color.fromARGB(174, 0, 0, 0),
                onPrimary: Colors.white,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.add_circle_outline,
                    size: 14,
                    color: Colors.white,
                  ),
                  SizedBox(
                    width: 4,
                  ),
                ],
              ),
            )),
      ),
    ]);
  }

  void setState(VoidCallback callback) {
    // Votre implémentation de la logique de setState ici
  }
}
