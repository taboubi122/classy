import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/components/categories_menu.dart';
import 'package:shop_app/models/Product.dart';
import 'package:dio/dio.dart';
import '../../../adresse.dart';
import '../../../components/service_menu.dart';
import '../../../constants.dart';
import '../../../size_config.dart';
import 'custom_app_bar.dart';

final dio = Dio();

class ProductDescription extends StatelessWidget {
  const ProductDescription({
    Key? key,
    required this.reference,
    required this.nomCentre,
    this.pressOnSeeMore,
  }) : super(key: key);

  final GestureTapCallback? pressOnSeeMore;
  final int reference;
  final String nomCentre;
  Future<List<dynamic>> getCateg() async {
    try {
      final response = await dio.get(
          'http://${Adresse.adresseIP}:5000/api/servicesNomCentre/${nomCentre}');
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
          padding: EdgeInsets.only(
            left: getProportionateScreenWidth(20),
            top: getProportionateScreenWidth(20),
            right: getProportionateScreenWidth(64),
          ),
          child: Text(
            "Choix de la prestation",
            style: TextStyle(
                fontSize: 17, fontFamily: "Robot", color: Colors.black),
          ),
        ),
        FutureBuilder<List<dynamic>>(
          future: getCateg(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Text('No salon data available');
            } else {
              final categorie = snapshot.data!;
              return Padding(
                padding: EdgeInsets.symmetric(
                  vertical: 10,
                ),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      for (var categItem in categorie)
                        CategorieMenu(
                          text: categItem['nomCateg'],
                          refCateg: categItem['refCateg'],
                          refCentre: categItem['refCentre'],
                          nomCentre: nomCentre,
                        ),
                    ],
                  ),
                ),
              );
            }
          },
        ),
      ],
    );
  }
}
