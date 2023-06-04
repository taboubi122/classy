import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../../adresse.dart';
import '../../../size_config.dart';
import 'custom_app_bar.dart';

final dio = Dio();

class head extends StatelessWidget {
  const head({
    Key? key,
    required this.reference,
    required this.nomCentre,
    this.pressOnSeeMore,
  }) : super(key: key);

  final GestureTapCallback? pressOnSeeMore;
  final int reference;
  final String nomCentre;
  Future<List<dynamic>> getAdresse() async {
    try {
      final response = await dio
          .get('http://${Adresse.adresseIP}:5000/api/getAdresse/${nomCentre}');
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
    Future<List<dynamic>> getItem() async {
      try {
        final response = await dio
            .get('http://${Adresse.adresseIP}:5000/api/getIdEtab/${reference}');
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
          final salonData = snapshot.data!;
          final salonItem = salonData[0];
          return afficherDonneesSalon(context, salonItem);
        }
      },
    );
  }

  Widget afficherDonneesSalon(BuildContext context, dynamic salonItem) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(
              horizontal: getProportionateScreenWidth(25),
              vertical: getProportionateScreenWidth(6)),
          child: Text(
            salonItem['type'],
          ),
        ),
        Padding(
          padding: EdgeInsets.only(
            left: getProportionateScreenWidth(25),
            right: getProportionateScreenWidth(64),
          ),
          child: Text(
            salonItem['nom'],
            style: TextStyle(
                fontSize: 20, fontFamily: "Times", color: Colors.black),
          ),
        ),
        Padding(
            padding: EdgeInsets.only(
              left: getProportionateScreenWidth(25),
              right: getProportionateScreenWidth(64),
            ),
            child: FutureBuilder<List<dynamic>>(
              future: getAdresse(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return CircularProgressIndicator();
                } else if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Text('No salon data available');
                } else {
                  final salonData = snapshot.data!;
                  final salonItem = salonData[0];
                  return Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        color: Colors.grey,
                        size: 16,
                      ),
                      const SizedBox(width: 5),
                      Expanded(
                        child: Text(
                          salonItem['adresse'],
                          style: const TextStyle(
                            fontSize: 14,
                            fontFamily: "Times",
                            color: Colors.grey,
                            decoration:
                                TextDecoration.underline, // Add underline
                          ),
                        ),
                      ),
                    ],
                  );
                }
              },
            )),
        Padding(
          padding: EdgeInsets.only(
            left: getProportionateScreenWidth(9),
            right: getProportionateScreenWidth(64),
          ),
          child: CustomAppBar(rating: 4.5),
        ),
      ],
    );
  }
}
